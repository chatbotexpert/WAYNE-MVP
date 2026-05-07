const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed metrics
  const metrics = [
    { name: 'NPORS', description: 'National Plant Operators Registration Scheme' },
    { name: 'EUSR', description: 'Energy & Utility Skills Register' },
    { name: 'NVQ', description: 'National Vocational Qualification' },
    { name: 'In-House Certificate', description: 'Company Specific Training' },
    { name: 'NRSWA', description: 'New Roads and Street Works Act' },
  ];

  for (const metric of metrics) {
    await prisma.metric.upsert({
      where: { name: metric.name },
      update: {},
      create: metric,
    });
  }

  // Seed Admin user
  const adminEmail = 'admin@wayne.com';
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Super Admin',
      email: adminEmail,
      password_hash: adminPassword,
      role: 'Admin',
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
