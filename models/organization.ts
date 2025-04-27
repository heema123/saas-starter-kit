import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { findOrCreateApp } from '@/lib/svix';
import { Role, Organization } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUser } from './user';
import { normalizeUser } from './user';
import { validateWithSchema, organizationSlugSchema } from '@/lib/zod';

export const createOrganization = async (param: {
  userId: string;
  name: string;
  slug: string;
}) => {
  const { userId, name, slug } = param;

  const organization = await prisma.organization.create({
    data: {
      name,
      slug,
    },
  });

  await addOrganizationMember(organization.id, userId, Role.OWNER);

  await findOrCreateApp(organization.name, organization.id);

  return organization;
};

export const getByCustomerId = async (
  billingId: string
): Promise<Organization | null> => {
  return await prisma.organization.findFirst({
    where: {
      billingId,
    },
  });
};

export const getOrganization = async (key: { id: string } | { slug: string }) => {
  return await prisma.organization.findUniqueOrThrow({
    where: key,
  });
};

export const deleteOrganization = async (key: { id: string } | { slug: string }) => {
  return await prisma.organization.delete({
    where: key,
  });
};

export const addOrganizationMember = async (
  organizationId: string,
  userId: string,
  role: Role
) => {
  return await prisma.organizationMember.upsert({
    create: {
      organizationId,
      userId,
      role,
    },
    update: {
      role,
    },
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });
};

export const removeOrganizationMember = async (organizationId: string, userId: string) => {
  return await prisma.organizationMember.delete({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });
};

export const getOrganizations = async (userId: string) => {
  return await prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      _count: {
        select: { members: true },
      },
    },
  });
};

export async function getOrganizationRoles(userId: string) {
  return await prisma.organizationMember.findMany({
    where: {
      userId,
    },
    select: {
      organizationId: true,
      role: true,
    },
  });
}

// Check if the user is an admin or owner of the organization
export async function isOrganizationAdmin(userId: string, organizationId: string) {
  const organizationMember = await prisma.organizationMember.findUniqueOrThrow({
    where: {
      organizationId_userId: {
        userId,
        organizationId,
      },
    },
  });

  return organizationMember.role === Role.ADMIN || organizationMember.role === Role.OWNER;
}

export const getOrganizationMembers = async (slug: string) => {
  const members = await prisma.organizationMember.findMany({
    where: {
      organization: {
        slug,
      },
    },
  });

  if (members.length === 0) {
    return [];
  }

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: members.map((member) => member.userId),
      },
    },
  });

  return members.map((member) => {
    const user = users.find((user) => user.id === member.userId);
    return {
      ...normalizeUser(user as any),
      id: member.id,
      userId: member.userId,
      organizationId: member.organizationId,
      role: member.role,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  });
};

export const updateOrganization = async (slug: string, data: Partial<Organization>) => {
  return await prisma.organization.update({
    where: {
      slug,
    },
    data: data,
  });
};

export const isOrganizationExists = async (slug: string) => {
  const organization = await prisma.organization.findUnique({
    where: {
      slug,
    },
  });

  return !!organization;
};

export const throwIfNoOrganizationAccess = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getSession(req, res);

  if (!session) {
    res.status(401).json({ error: { message: 'Unauthorized' } });
    return null;
  }

  const { slug } = validateWithSchema(organizationSlugSchema, req.query);

  const user = await getCurrentUser(req, res);

  try {
    const { role, organization } = await getOrganizationMember(user.id, slug);

    return {
      ...user,
      role,
      organization,
    };
  } catch (e) {
    res.status(403).json({
      error: {
        message: `You don't have access to this organization`,
      },
    });
    return null;
  }
};

export const getOrganizationMember = async (userId: string, slug: string) => {
  const organizationMember = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organization: {
        slug,
      },
    },
  });

  const organizationDetails = await prisma.organization.findUniqueOrThrow({
    where: {
      slug,
    },
  });

  if (!organizationMember) {
    throw new Error(`User is not a member of the organization: ${slug}`);
  }

  return {
    role: organizationMember.role,
    organization: organizationDetails,
    organizationId: organizationMember.organizationId,
  };
};

// Get current user with organization info
export const getCurrentUserWithOrganization = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const user = await getCurrentUser(req, res);

  const { slug } = validateWithSchema(organizationSlugSchema, req.query);

  const { role, organization } = await getOrganizationMember(user.id, slug);

  return {
    ...user,
    role,
    organization,
  };
}; 