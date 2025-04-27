const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();
const { hash } = require('bcryptjs');
const { randomUUID } = require('crypto');

let USER_COUNT = 10;
const ORGANIZATION_COUNT = 5;
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin@123';
const USER_EMAIL = 'user@example.com';
const USER_PASSWORD = 'user@123';
async function seedUsers() {
  const newUsers: any[] = [];
  await createRandomUser(ADMIN_EMAIL, ADMIN_PASSWORD);
  await createRandomUser(USER_EMAIL, USER_PASSWORD);
  await Promise.all(
    Array(USER_COUNT)
      .fill(0)
      .map(() => createRandomUser())
  );

  console.log('Seeded users', newUsers.length);

  return newUsers;

  async function createRandomUser(
    email: string | undefined = undefined,
    password: string | undefined = undefined
  ) {
    try {
      const originalPassword = password || faker.internet.password();
      email = email || faker.internet.email();
      password = await hash(originalPassword, 12);
      const user = await client.user.create({
        data: {
          email,
          name: faker.person.firstName(),
          password,
          emailVerified: new Date(),
        },
      });
      newUsers.push({
        ...user,
        password: originalPassword,
      });
      USER_COUNT--;
    } catch (ex: any) {
      if (ex.message.indexOf('Unique constraint failed') > -1) {
        console.error('Duplicate email', email);
      } else {
        console.log(ex);
      }
    }
  }
}

async function seedOrganizations() {
  const newOrganizations: any[] = [];

  await Promise.all(
    Array(ORGANIZATION_COUNT)
      .fill(0)
      .map(() => createRandomOrganization())
  );
  console.log('Seeded organizations', newOrganizations.length);
  return newOrganizations;

  async function createRandomOrganization() {
    const name = faker.company.name();
    const organization = await client.organization.create({
      data: {
        name,
        slug: name
          .toString()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/--+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, ''),
      },
    });
    newOrganizations.push(organization);
  }
}

async function seedOrganizationMembers(users: any[], organizations: any[]) {
  const newOrganizationMembers: any[] = [];
  const roles = ['OWNER', 'MEMBER'];
  for (const user of users) {
    const count = Math.floor(Math.random() * (ORGANIZATION_COUNT - 1)) + 2;
    const organizationsUsed = new Set();
    for (let j = 0; j < count; j++) {
      try {
        let organizationId;
        do {
          organizationId = organizations[Math.floor(Math.random() * ORGANIZATION_COUNT)].id;
        } while (organizationsUsed.has(organizationId));
        organizationsUsed.add(organizationId);
        newOrganizationMembers.push({
          role:
            user.email === ADMIN_EMAIL
              ? 'OWNER'
              : user.email === USER_EMAIL
                ? 'MEMBER'
                : roles[Math.floor(Math.random() * 2)],
          organizationId,
          userId: user.id,
        });
      } catch (ex) {
        console.log(ex);
      }
    }
  }

  await client.organizationMember.createMany({
    data: newOrganizationMembers,
  });
  console.log('Seeded organization members', newOrganizationMembers.length);
}

async function seedInvitations(organizations: any[], users: any[]) {
  const newInvitations: any[] = [];
  for (const organization of organizations) {
    const count = Math.floor(Math.random() * users.length) + 2;
    for (let j = 0; j < count; j++) {
      try {
        const invitation = await client.invitation.create({
          data: {
            organizationId: organization.id,
            invitedBy: users[Math.floor(Math.random() * users.length)].id,
            email: faker.internet.email(),
            role: 'MEMBER',
            sentViaEmail: true,
            token: randomUUID(),
            allowedDomains: [],
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
        newInvitations.push(invitation);
      } catch (ex) {
        console.log(ex);
      }
    }
  }

  console.log('Seeded invitations', newInvitations.length);

  return newInvitations;
}

async function init() {
  const users = await seedUsers();
  const organizations = await seedOrganizations();
  await seedOrganizationMembers(users, organizations);
  await seedInvitations(organizations, users);
}

init();
