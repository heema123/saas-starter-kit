import { sendAudit } from '@/lib/retraced';
import { getOrganizationMembers, throwIfNoOrganizationAccess } from 'models/organization';
import {
  addOrganizationMember,
  removeOrganizationMember,
  isOrganizationAdmin,
} from 'models/organization';
import { throwIfNotAllowed } from 'models/user';
import type { NextApiRequest, NextApiResponse } from 'next';
import { recordMetric } from '@/lib/metrics';
import {
  deleteMemberSchema,
  updateMemberSchema,
  validateWithSchema,
} from '@/lib/zod';
import { ApiError } from '@/lib/errors';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await throwIfNoOrganizationAccess(req, res);

    switch (req.method) {
      case 'GET':
        await handleGET(req, res);
        break;
      case 'PUT':
        await handlePUT(req, res);
        break;
      case 'PATCH':
        await handlePATCH(req, res);
        break;
      case 'DELETE':
        await handleDELETE(req, res);
        break;
      default:
        res.setHeader('Allow', 'GET, PUT, PATCH, DELETE');
        res.status(405).json({
          error: { message: `Method ${req.method} Not Allowed` },
        });
    }
  } catch (error: any) {
    const message = error.message || 'Something went wrong';
    const status = error.status || 500;

    res.status(status).json({
      error: { message },
    });
  }
}

// Get members of an organization
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const organizationMember = await throwIfNoOrganizationAccess(req, res);
  throwIfNotAllowed(organizationMember, 'organization_member', 'read');

  const members = await getOrganizationMembers(organizationMember.organization.slug);

  recordMetric('member.fetched');

  res.status(200).json({ data: members });
};

// Leave an organization
const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const organizationMember = await throwIfNoOrganizationAccess(req, res);

  const membersCount = await getOrganizationMembers(organizationMember.organization.slug);

  if (membersCount.length === 1) {
    throw new ApiError(
      400,
      'You are the only member of this organization. Please delete the organization instead.'
    );
  }

  await removeOrganizationMember(
    organizationMember.organization.id,
    organizationMember.id
  );

  sendAudit({
    action: 'member.left',
    crud: 'd',
    user: organizationMember,
    organization: organizationMember.organization,
  });

  recordMetric('member.left');

  res.status(204).end();
};

// Update a member's role
const handlePATCH = async (req: NextApiRequest, res: NextApiResponse) => {
  const organizationMember = await throwIfNoOrganizationAccess(req, res);
  throwIfNotAllowed(organizationMember, 'organization_member', 'update');

  if (!(await isOrganizationAdmin(organizationMember.id, organizationMember.organization.id))) {
    throw new ApiError(403, 'Only admins can change roles');
  }

  const { memberId, role } = validateWithSchema(updateMemberSchema, req.body);

  const member = await addOrganizationMember(
    organizationMember.organization.id,
    memberId,
    role
  );

  sendAudit({
    action: 'member.updated',
    crud: 'u',
    user: organizationMember,
    organization: organizationMember.organization,
  });

  recordMetric('member.updated');

  res.status(200).json({ data: member });
};

// Delete a member
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const organizationMember = await throwIfNoOrganizationAccess(req, res);
  throwIfNotAllowed(organizationMember, 'organization_member', 'delete');

  if (!(await isOrganizationAdmin(organizationMember.id, organizationMember.organization.id))) {
    throw new ApiError(403, 'Only admins can remove members');
  }

  const { memberId } = validateWithSchema(deleteMemberSchema, req.query);

  const member = await removeOrganizationMember(
    organizationMember.organization.id,
    memberId
  );

  sendAudit({
    action: 'member.removed',
    crud: 'd',
    user: organizationMember,
    organization: organizationMember.organization,
  });

  recordMetric('member.removed');

  res.status(200).json({ data: member });
}; 