import env from '@/lib/env';
import { ApiError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { OrganizationInvitation } from '@prisma/client';
import { randomUUID } from 'crypto';

export type OrganizationInvitationType = Pick<
  OrganizationInvitation,
  'id' | 'email' | 'role' | 'expires' | 'allowedDomains' | 'token'
> & { url: string };

export const getOrganizationInvitations = async (organizationId: string, sentViaEmail: boolean) => {
  const invitations = await prisma.organizationInvitation.findMany({
    where: {
      organizationId,
      sentViaEmail,
    },
    select: {
      id: true,
      email: true,
      role: true,
      expires: true,
      token: true,
      allowedDomains: true,
    },
  });

  return invitations.map((invitation) => ({
    ...invitation,
    url: `${env.appUrl}/organization-invitations/${invitation.token}`,
  })) as (OrganizationInvitation & { url: string })[];
};

export const getOrganizationInvitation = async (
  key: { token: string } | { id: string }
) => {
  const invitation = await prisma.organizationInvitation.findUnique({
    where: key,
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!invitation) {
    throw new ApiError(404, 'Invitation not found.');
  }

  return invitation;
};

export const createOrganizationInvitation = async (
  params: Omit<
    OrganizationInvitation,
    'id' | 'token' | 'expires' | 'createdAt' | 'updatedAt'
  >
) => {
  const data: Omit<OrganizationInvitation, 'id' | 'createdAt' | 'updatedAt'> = {
    ...params,
    token: randomUUID(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  return await prisma.organizationInvitation.create({
    data,
  });
};

export const deleteOrganizationInvitation = async (
  key: { token: string } | { id: string }
) => {
  return await prisma.organizationInvitation.delete({
    where: key,
  });
};

export const isOrganizationInvitationExpired = async (expires: Date) => {
  return expires.getTime() < Date.now();
};

export const getOrganizationInvitationCount = async ({ where }) => {
  return await prisma.organizationInvitation.count({
    where,
  });
}; 