import { ApiError } from '@/lib/errors';
import {
  createOrganizationInvitation,
  deleteOrganizationInvitation,
  getOrganizationInvitations,
} from 'models/organizationInvitation';
import {
  throwIfNoOrganizationAccess,
  getCurrentUserWithOrganization,
  getOrganization,
} from 'models/organization';
import { throwIfNotAllowed } from 'models/user';
import type { NextApiRequest, NextApiResponse } from 'next';
import { recordMetric } from '@/lib/metrics';
import { sendAudit } from '@/lib/retraced';
import { sendTeamInviteEmail } from '@/lib/email/sendTeamInviteEmail';
import { Role } from '@prisma/client';
import { createOrganizationInvitationSchema, validateWithSchema } from '@/lib/zod';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = await throwIfNoOrganizationAccess(req, res);
    if (!user) return;

    switch (req.method) {
      case 'GET':
        await handleGET(req, res, user);
        break;
      case 'POST':
        await handlePOST(req, res, user);
        break;
      case 'DELETE':
        await handleDELETE(req, res, user);
        break;
      default:
        res.setHeader('Allow', 'GET, POST, DELETE');
        res.status(405).json({
          error: { message: `Method ${req.method} Not Allowed` },
        });
    }
  } catch (error: any) {
    const message = error.message || 'Something went wrong';
    const status = error.status || 500;

    res.status(status).json({ error: { message } });
  }
}

// Get organization invitations
const handleGET = async (req: NextApiRequest, res: NextApiResponse, user: any) => {
  const { sentViaEmail = 'true' } = req.query;

  throwIfNotAllowed(user, 'organization_invitation', 'read');

  const organizationInvitations = await getOrganizationInvitations(
    user.organization.id,
    sentViaEmail === 'true'
  );

  recordMetric('organization.invitation.fetched');

  return res.status(200).json({ data: organizationInvitations });
};

// Create a new organization invitation
const handlePOST = async (req: NextApiRequest, res: NextApiResponse, user: any) => {
  throwIfNotAllowed(user, 'organization_invitation', 'create');

  const { email, role, sentViaEmail, domains } = validateWithSchema(createOrganizationInvitationSchema, req.body);

  const organization = await getOrganization({ id: user.organization.id });

  let allowedDomains: string[] = [];

  if (domains) {
    allowedDomains = domains
      .split(',')
      .map((domain) => domain.trim())
      .filter(Boolean);
  }

  const invitation = await createOrganizationInvitation({
    email,
    role: role as Role,
    organizationId: user.organization.id,
    allowedDomains,
    sentViaEmail,
  });

  // Send an email to the user with the invitation link
  if (sentViaEmail) {
    await sendTeamInviteEmail({
      organizationId: user.organization.id,
      organizationName: organization.name,
      organizationSlug: organization.slug,
      inviteeEmail: email,
      token: invitation.token,
      invitedByEmail: user.email,
      invitedByName: user.name,
      role,
    });
  }

  sendAudit({
    action: 'organization.invitation.create',
    crud: 'c',
    user,
    organization: user.organization,
  });

  recordMetric('organization.invitation.created');

  return res.status(201).json({ data: invitation });
};

// Delete an organization invitation
const handleDELETE = async (req: NextApiRequest, res: NextApiResponse, user: any) => {
  throwIfNotAllowed(user, 'organization_invitation', 'delete');

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invitation ID is required');
  }

  await deleteOrganizationInvitation({ id });

  sendAudit({
    action: 'organization.invitation.delete',
    crud: 'd',
    user,
    organization: user.organization,
  });

  recordMetric('organization.invitation.deleted');

  return res.status(204).end();
}; 