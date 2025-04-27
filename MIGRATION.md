# Teams to Organizations Migration Guide

This document provides step-by-step instructions for migrating your existing Teams model to the new Organizations model in the SaaS Starter Kit.

## Overview

The SaaS Starter Kit is moving from a Teams-based structure to an Organizations-based structure. This migration involves:

1. Schema updates (via Prisma migrations)
2. Data migration (transferring existing teams data to organizations)
3. Code updates (UI and API changes)

## Prerequisites

Before running the migration, ensure you have:

- Backed up your database
- Updated to the latest codebase 
- Installed all dependencies (`npm install` or `yarn`)

## Migration Steps

### 1. Run Database Schema Migration

First, apply the Prisma schema changes to add the Organizations models:

```bash
npx prisma migrate dev --name add_organizations
```

This will create the new database tables required for organizations while keeping the existing team tables.

### 2. Run Data Migration

The data migration script transfers all data from the Teams model to the Organizations model, including:

- Team basic information (name, slug, etc.)
- Team members with their roles
- Team invitations
- API keys
- SSO connections
- Other related entities

Run the data migration:

```bash
npm run data-migration
```

The script will output progress information and confirm when the migration is complete.

### 3. Verify Migration

After running the migration, you should verify that:

- All organizations appear correctly in the UI
- User memberships are preserved
- Permissions work correctly
- SSO connections work as expected

### 4. Rollback Plan

If issues are encountered, you can:

1. Restore your database backup
2. Revert the code changes
3. Contact support for assistance

## Technical Details

### Data Mapping

The migration maps the following data:

| Teams Model | Organizations Model |
|-------------|---------------------|
| Team | Organization |
| TeamMember | OrganizationMember |
| TeamInvitation | Invitation (with organizationId) |
| Team API Keys | Organization API Keys |

### Schema Changes

The following schema changes are made:

- Addition of Organization and OrganizationMember models
- Updated invitation model with organizationId field
- Updated API key model with organizationId field

## Troubleshooting

If you encounter issues during migration:

- Check the migration logs for specific error messages
- Ensure database connectivity
- Verify that your backup is current before attempting again
- Check for uniqueness constraints that might be violated (duplicate slugs, emails, etc.)

## Support

If you need assistance with the migration process, please contact our support team or open an issue on GitHub. 