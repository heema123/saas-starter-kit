import { Role } from '@prisma/client';

type RoleType = (typeof Role)[keyof typeof Role];
export type Action = 'create' | 'update' | 'read' | 'delete' | 'leave';
export type Resource =
  | 'team'
  | 'team_member'
  | 'team_invitation'
  | 'team_sso'
  | 'team_dsync'
  | 'team_audit_log'
  | 'team_webhook'
  | 'team_payments'
  | 'team_api_key'
  | 'organization'
  | 'organization_member'
  | 'organization_invitation'
  | 'organization_sso'
  | 'organization_dsync'
  | 'organization_audit_log'
  | 'organization_webhook'
  | 'organization_payments'
  | 'organization_api_key';

type RolePermissions = {
  [role in RoleType]: Permission[];
};

export type Permission = {
  resource: Resource;
  actions: Action[] | '*';
};

export const availableRoles = [
  {
    id: Role.MEMBER,
    name: 'Member',
  },
  {
    id: Role.ADMIN,
    name: 'Admin',
  },
  {
    id: Role.OWNER,
    name: 'Owner',
  },
];

export const permissions: RolePermissions = {
  OWNER: [
    {
      resource: 'team',
      actions: '*',
    },
    {
      resource: 'team_member',
      actions: '*',
    },
    {
      resource: 'team_invitation',
      actions: '*',
    },
    {
      resource: 'team_sso',
      actions: '*',
    },
    {
      resource: 'team_dsync',
      actions: '*',
    },
    {
      resource: 'team_audit_log',
      actions: '*',
    },
    {
      resource: 'team_payments',
      actions: '*',
    },
    {
      resource: 'team_webhook',
      actions: '*',
    },
    {
      resource: 'team_api_key',
      actions: '*',
    },
    {
      resource: 'organization',
      actions: '*',
    },
    {
      resource: 'organization_member',
      actions: '*',
    },
    {
      resource: 'organization_invitation',
      actions: '*',
    },
    {
      resource: 'organization_sso',
      actions: '*',
    },
    {
      resource: 'organization_dsync',
      actions: '*',
    },
    {
      resource: 'organization_audit_log',
      actions: '*',
    },
    {
      resource: 'organization_payments',
      actions: '*',
    },
    {
      resource: 'organization_webhook',
      actions: '*',
    },
    {
      resource: 'organization_api_key',
      actions: '*',
    },
  ],
  ADMIN: [
    {
      resource: 'team',
      actions: '*',
    },
    {
      resource: 'team_member',
      actions: '*',
    },
    {
      resource: 'team_invitation',
      actions: '*',
    },
    {
      resource: 'team_sso',
      actions: '*',
    },
    {
      resource: 'team_dsync',
      actions: '*',
    },
    {
      resource: 'team_audit_log',
      actions: '*',
    },
    {
      resource: 'team_webhook',
      actions: '*',
    },
    {
      resource: 'team_api_key',
      actions: '*',
    },
    {
      resource: 'organization',
      actions: '*',
    },
    {
      resource: 'organization_member',
      actions: '*',
    },
    {
      resource: 'organization_invitation',
      actions: '*',
    },
    {
      resource: 'organization_sso',
      actions: '*',
    },
    {
      resource: 'organization_dsync',
      actions: '*',
    },
    {
      resource: 'organization_audit_log',
      actions: '*',
    },
    {
      resource: 'organization_webhook',
      actions: '*',
    },
    {
      resource: 'organization_api_key',
      actions: '*',
    },
  ],
  MEMBER: [
    {
      resource: 'team',
      actions: ['read', 'leave'],
    },
    {
      resource: 'organization',
      actions: ['read', 'leave'],
    },
  ],
};
