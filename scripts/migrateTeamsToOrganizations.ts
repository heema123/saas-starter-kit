import { PrismaClient } from '@prisma/client';
import { exit } from 'process';

// Initialize Prisma client
const prisma = new PrismaClient();

async function migrateTeamsToOrganizations() {
  console.log('Starting migration from Teams to Organizations...');

  try {
    // Count teams to migrate
    const teamCount = await prisma.team.count();
    console.log(`Found ${teamCount} teams to migrate.`);

    if (teamCount === 0) {
      console.log('No teams to migrate. Exiting.');
      return;
    }

    // Get all teams
    const teams = await prisma.team.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    console.log('Beginning transaction...');

    // Use a transaction to ensure all migrations succeed or fail together
    await prisma.$transaction(async (tx) => {
      for (const team of teams) {
        console.log(`Migrating team: ${team.name} (${team.slug})`);

        // Create organization with the same properties as team
        const organization = await tx.organization.create({
          data: {
            name: team.name,
            slug: team.slug,
            domain: team.domain,
            defaultRole: team.defaultRole,
            billingId: team.billingId,
            billingProvider: team.billingProvider,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
          },
        });

        console.log(`Created organization: ${organization.id}`);

        // Migrate team members to organization members
        for (const member of team.members) {
          await tx.organizationMember.create({
            data: {
              organizationId: organization.id,
              userId: member.userId,
              role: member.role,
              createdAt: member.createdAt,
              updatedAt: member.updatedAt,
            },
          });
        }
        console.log(`Migrated ${team.members.length} members`);

        // Migrate invitations
        const invitations = await tx.invitation.findMany({
          where: { teamId: team.id },
        });

        for (const invitation of invitations) {
          await tx.invitation.create({
            data: {
              organizationId: organization.id,
              email: invitation.email,
              role: invitation.role,
              token: `${invitation.token}_org`, // Ensure uniqueness
              expires: invitation.expires,
              invitedBy: invitation.invitedBy,
              createdAt: invitation.createdAt,
              updatedAt: invitation.updatedAt,
              sentViaEmail: invitation.sentViaEmail,
              allowedDomains: invitation.allowedDomains,
            },
          });
        }
        console.log(`Migrated ${invitations.length} invitations`);

        // Migrate API keys
        const apiKeys = await tx.apiKey.findMany({
          where: { teamId: team.id },
        });

        for (const apiKey of apiKeys) {
          await tx.apiKey.create({
            data: {
              name: apiKey.name,
              key: apiKey.key,
              organizationId: organization.id,
              expiresAt: apiKey.expiresAt,
              lastUsed: apiKey.lastUsed,
              createdAt: apiKey.createdAt,
              updatedAt: apiKey.updatedAt,
            },
          });
        }
        console.log(`Migrated ${apiKeys.length} API keys`);

        // Update Jackson SSO connections (tenant IDs)
        try {
          const samlConnectionsKey = `saml:tenant:${team.id}`;
          const samlConnection = await tx.jackson_store.findUnique({
            where: { key: samlConnectionsKey },
          });

          if (samlConnection) {
            // Create new connection with organization ID
            await tx.jackson_store.create({
              data: {
                key: `saml:tenant:${organization.id}`,
                value: samlConnection.value,
                iv: samlConnection.iv,
                tag: samlConnection.tag,
                createdAt: samlConnection.createdAt,
                modifiedAt: samlConnection.modifiedAt,
                namespace: samlConnection.namespace,
              },
            });
            console.log(`Migrated SSO connection for team ${team.id}`);
          }
        } catch (error) {
          console.warn(`Warning: Could not migrate SSO connection for team ${team.id}`, error);
        }

        console.log(`Successfully migrated team: ${team.name} to organization: ${organization.name}`);
      }
    });

    console.log('Migration completed successfully!');
    console.log(`Migrated ${teams.length} teams to organizations.`);
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateTeamsToOrganizations()
  .then(() => {
    console.log('Migration script completed!');
    exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    exit(1);
  }); 