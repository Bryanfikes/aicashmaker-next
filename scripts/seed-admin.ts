/**
 * Run with: npx tsx scripts/seed-admin.ts
 *
 * Creates the first admin user in the database.
 * Only needed when setting up a fresh Payload instance.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function seedAdmin() {
  const payload = await getPayload({ config })

  const email = 'admin@aicashmaker.com'
  const password = 'ChangeMe123!'

  // Check if a user already exists
  const existing = await payload.find({
    collection: 'users',
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    console.log(`Admin user already exists (${existing.docs[0].email}). Skipping.`)
    process.exit(0)
  }

  const user = await payload.create({
    collection: 'users',
    data: {
      email,
      password,
      role: 'super-admin',
    },
  })

  console.log(`\n✅ Admin user created!`)
  console.log(`   Email:    ${user.email}`)
  console.log(`   Password: ${password}`)
  console.log(`\n⚠️  Change this password immediately after first login.`)
  console.log(`   Admin panel: http://localhost:3000/admin`)
  process.exit(0)
}

seedAdmin().catch((err) => {
  console.error('Failed to create admin:', err)
  process.exit(1)
})
