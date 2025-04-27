import { z } from 'zod';
import { role, email, domains } from './primitives';

export const createTeamInvitationSchema = z.object({
  email: email,
  role,
  sentViaEmail: z.boolean().optional().default(true),
  domains: domains.optional(),
});

export const createOrganizationInvitationSchema = z.object({
  email: email,
  role,
  sentViaEmail: z.boolean().optional().default(true),
  domains: domains.optional(),
});

export const invitationTokenSchema = z.object({
  token: z.string(),
});

export const validateInvitationSchema = z.object({
  token: z.string(),
  email: email.optional(),
  password: z.string().optional(),
  name: z.string().optional(),
});

export const acceptInvitationSchema = z.object({
  token: z.string(),
}); 