
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function purge() {
  console.log('🔥 Purging all collections...')

  // Use deleteMany on every model. Order matters for relations,
  // but MongoDB doesn't enforce FKs — safe to run in any order.
  await prisma.feedback.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.project.deleteMany()
  await prisma.joinRequest.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.team.deleteMany()
  await prisma.user.deleteMany()

  // Verify — count remaining documents in the User collection
  const remainingUsers = await prisma.user.count()
  const remainingTeams = await prisma.team.count()
  console.log(`   Users remaining: ${remainingUsers}`)
  console.log(`   Teams remaining: ${remainingTeams}`)

  if (remainingUsers > 0 || remainingTeams > 0) {
    console.warn('⚠️  Some documents survived. Check MongoDB Atlas manually.')
  } else {
    console.log('✅ Database is clean')
  }
}

purge()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })