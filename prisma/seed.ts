import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...\n')

  // ============================================================
  // STEP 1: CLEAN EXISTING DATA
  // ============================================================
  // Delete in reverse-dependency order to respect foreign keys.
  console.log('🧹 Cleaning existing data...')
  await prisma.feedback.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.project.deleteMany()
  await prisma.joinRequest.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.team.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Cleaned\n')

  // ============================================================
  // STEP 2: HASH PASSWORDS
  // ============================================================
  // All seeded users share the same password for easy testing.
  const passwordHash = await bcrypt.hash('password123', 12)

  // ============================================================
  // STEP 3: CREATE STUDENTS
  // ============================================================
  console.log('👥 Creating students...')

  const rimsha = await prisma.user.create({
    data: {
      email: 'rimsha.arfeen@university.edu',
      password: passwordHash,
      name: 'Rimsha Arfeen',
      role: 'STUDENT',
      contact: '+92-300-1111111',
      registrationNumber: 'BSCS-2022-001',
      program: 'BSCS',
      semester: 8,
      cgpa: 3.85,
      enrolledCourses: ['Final Year Project', 'Machine Learning', 'Cloud Computing'],
      skills: ['Python', 'React', 'Node.js', 'MongoDB', 'Prisma', 'Next.js', 'AI/ML'],
      interestAreas: ['Artificial Intelligence', 'Full Stack Development', 'Cloud Systems'],
      experienceLevel: 'Advanced',
      githubLink: 'https://github.com/RimshaArfeen',
      linkedinProfile: 'https://linkedin.com/in/rimsha-arfeen',
    },
  })

  const marium = await prisma.user.create({
    data: {
      email: 'marium@university.edu',
      password: passwordHash,
      name: 'Marium',
      role: 'STUDENT',
      contact: '+92-300-2222222',
      registrationNumber: 'BSCS-2022-002',
      program: 'BSCS',
      semester: 8,
      cgpa: 3.72,
      enrolledCourses: ['Final Year Project', 'Machine Learning', 'Web Engineering'],
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
      interestAreas: ['Frontend Development', 'UI/UX Design'],
      experienceLevel: 'Intermediate',
      githubLink: 'https://github.com/marium',
      linkedinProfile: 'https://linkedin.com/in/marium',
    },
  })

  const sonia = await prisma.user.create({
    data: {
      email: 'sonia@university.edu',
      password: passwordHash,
      name: 'Sonia',
      role: 'STUDENT',
      contact: '+92-300-3333333',
      registrationNumber: 'BSCS-2022-003',
      program: 'BSCS',
      semester: 8,
      cgpa: 3.65,
      enrolledCourses: ['Final Year Project', 'Data Mining', 'Software Engineering'],
      skills: ['Python', 'Pandas', 'SQL', 'Data Visualization'],
      interestAreas: ['Data Science', 'Analytics'],
      experienceLevel: 'Intermediate',
      githubLink: 'https://github.com/sonia',
      linkedinProfile: 'https://linkedin.com/in/sonia',
    },
  })

  const anousha = await prisma.user.create({
    data: {
      email: 'anousha@university.edu',
      password: passwordHash,
      name: 'Anousha',
      role: 'STUDENT',
      contact: '+92-300-4444444',
      registrationNumber: 'BSCS-2022-004',
      program: 'BSCS',
      semester: 8,
      cgpa: 3.90,
      enrolledCourses: ['Final Year Project', 'Deep Learning', 'Computer Vision'],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV'],
      interestAreas: ['Deep Learning', 'Computer Vision', 'NLP'],
      experienceLevel: 'Advanced',
      githubLink: 'https://github.com/anousha',
      linkedinProfile: 'https://linkedin.com/in/anousha',
    },
  })

  // Ramsha is NOT in the team — she'll send a join request.
  const ramsha = await prisma.user.create({
    data: {
      email: 'ramsha@university.edu',
      password: passwordHash,
      name: 'Ramsha',
      role: 'STUDENT',
      contact: '+92-300-5555555',
      registrationNumber: 'BSCS-2022-005',
      program: 'BSCS',
      semester: 8,
      cgpa: 3.78,
      enrolledCourses: ['Final Year Project', 'Web Engineering', 'Database Systems'],
      skills: ['JavaScript', 'Express.js', 'PostgreSQL', 'Docker'],
      interestAreas: ['Backend Development', 'DevOps'],
      experienceLevel: 'Intermediate',
      githubLink: 'https://github.com/ramsha',
      linkedinProfile: 'https://linkedin.com/in/ramsha',
    },
  })

  console.log('✅ Created 5 students\n')

  // ============================================================
  // STEP 4: CREATE TEACHER (Supervisor)
  // ============================================================
  console.log('👨‍🏫 Creating supervisor...')

  const drShazia = await prisma.user.create({
    data: {
      email: 'shazia@university.edu',
      password: passwordHash,
      name: 'Dr. Shazia',
      role: 'TEACHER',
      contact: '+92-321-9999999',
      employeeId: 'EMP-CS-014',
      department: 'Computer Science',
      designation: 'Associate Professor',
      researchAreas: ['Artificial Intelligence', 'Software Engineering', 'Data Mining'],
      publications: [
        'A Survey on AI-Based Project Management Systems (2023)',
        'Agile Methodologies in Academic Projects (2022)',
      ],
      supervisionDomains: ['AI/ML', 'Web Development', 'Data Science', 'Software Engineering'],
      maxProjects: 5,
    },
  })

  console.log('✅ Created supervisor\n')

  // ============================================================
  // STEP 5: CREATE ADMIN
  // ============================================================
  console.log('🛡️  Creating admin...')

  const admin = await prisma.user.create({
    data: {
      email: 'admin@university.edu',
      password: passwordHash,
      name: 'System Administrator',
      role: 'ADMIN',
      contact: '+92-300-0000000',
      department: 'IT Services',
      designation: 'Platform Administrator',
      enrolledCourses: [],
      skills: [],
      interestAreas: [],
      researchAreas: [],
      publications: [],
      supervisionDomains: [],
    },
  })

  console.log('✅ Created admin\n')

  // ============================================================
  // STEP 6: CREATE TEAM (led by Rimsha)
  // ============================================================
  console.log('👥 Creating team...')

  const team = await prisma.team.create({
    data: {
      name: 'ProjectPulse Team',
      maxSize: 5,
      projectDomain: 'Web Development',
      description:
        'Building a centralized platform for managing final year projects between students and supervisors.',
      isOpen: true,
      supervisorStatus: 'ACCEPTED',
      leadId: rimsha.id,
    },
  })

  // Add Rimsha as LEAD, others as MEMBER.
  await prisma.teamMember.createMany({
    data: [
      { userId: rimsha.id, teamId: team.id, role: 'LEAD' },
      { userId: marium.id, teamId: team.id, role: 'MEMBER' },
      { userId: sonia.id, teamId: team.id, role: 'MEMBER' },
      { userId: anousha.id, teamId: team.id, role: 'MEMBER' },
    ],
  })

  console.log('✅ Created team with 4 members\n')

  // ============================================================
  // STEP 7: CREATE JOIN REQUEST (Ramsha → Team)
  // ============================================================
  console.log('📨 Creating join request...')

  await prisma.joinRequest.create({
    data: {
      requesterId: ramsha.id,
      teamId: team.id,
      message:
        'Hi Rimsha! I have strong backend and DevOps skills and would love to contribute to ProjectPulse. I can handle deployment and CI/CD.',
      status: 'PENDING',
    },
  })

  console.log('✅ Created pending join request from Ramsha\n')

  // ============================================================
  // STEP 8: CREATE PROJECT
  // ============================================================
  console.log('📁 Creating project...')

  const project = await prisma.project.create({
    data: {
      title: 'ProjectPulse: Academic Project Management Platform',
      description:
        'A comprehensive web-based platform that connects students, teams, and supervisors in a unified ecosystem for managing final year projects. Features include team formation, supervisor discovery, milestone tracking, submission versioning, and structured feedback.',
      timelineStart: new Date('2025-09-01'),
      timelineEnd: new Date('2026-05-30'),
      status: 'ACTIVE',
      teamId: team.id,
      supervisorId: drShazia.id,
    },
  })

  console.log('✅ Created project\n')

  // ============================================================
  // STEP 9: CREATE MILESTONES
  // ============================================================
  console.log('🎯 Creating milestones...')

  const proposalMilestone = await prisma.milestone.create({
    data: {
      title: 'Project Proposal',
      description:
        'Submit initial project proposal with problem statement, objectives, scope, and proposed solution.',
      deadline: new Date('2025-10-15'),
      status: 'APPROVED',
      projectId: project.id,
      assigneeId: rimsha.id,
    },
  })

  const srsMilestone = await prisma.milestone.create({
    data: {
      title: 'SRS Document',
      description:
        'Software Requirements Specification covering functional and non-functional requirements, use cases, and ERD.',
      deadline: new Date('2025-12-01'),
      status: 'APPROVED',
      projectId: project.id,
      assigneeId: marium.id,
    },
  })

  const designMilestone = await prisma.milestone.create({
    data: {
      title: 'System Design & Architecture',
      description:
        'High-level and low-level design documents including database schema, API contracts, and UI wireframes.',
      deadline: new Date('2026-01-20'),
      status: 'SUBMITTED',
      projectId: project.id,
      assigneeId: sonia.id,
    },
  })

  const implementationMilestone = await prisma.milestone.create({
    data: {
      title: 'Final Implementation & Testing',
      description:
        'Complete implementation of all modules, unit testing, integration testing, and user acceptance testing.',
      deadline: new Date('2026-04-15'),
      status: 'IN_PROGRESS',
      projectId: project.id,
      assigneeId: anousha.id,
    },
  })

  console.log('✅ Created 4 milestones\n')

  // ============================================================
  // STEP 10: CREATE SUBMISSIONS (with version history)
  // ============================================================
  console.log('📤 Creating submissions...')

  // Proposal v1 (rejected, then v2 approved)
  await prisma.submission.create({
    data: {
      fileName: 'ProjectPulse_Proposal_v1.pdf',
      fileUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/projectpulse/proposal_v1.pdf',
      version: 1,
      notes: 'Initial draft of the proposal.',
      milestoneId: proposalMilestone.id,
      submittedById: rimsha.id,
    },
  })

  const proposalV2 = await prisma.submission.create({
    data: {
      fileName: 'ProjectPulse_Proposal_v2.pdf',
      fileUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/projectpulse/proposal_v2.pdf',
      version: 2,
      notes: 'Revised proposal addressing supervisor feedback on scope and timeline.',
      milestoneId: proposalMilestone.id,
      submittedById: rimsha.id,
    },
  })

  // SRS submission
  const srsSubmission = await prisma.submission.create({
    data: {
      fileName: 'ProjectPulse_SRS_v1.pdf',
      fileUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/projectpulse/srs_v1.pdf',
      version: 1,
      notes: 'Complete SRS with use case diagrams and ERD.',
      milestoneId: srsMilestone.id,
      submittedById: marium.id,
    },
  })

  // Design submission
  const designSubmission = await prisma.submission.create({
    data: {
      fileName: 'ProjectPulse_Design_Doc_v1.pdf',
      fileUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/projectpulse/design_v1.pdf',
      version: 1,
      notes: 'Contains system architecture, database schema, and wireframes.',
      milestoneId: designMilestone.id,
      submittedById: sonia.id,
    },
  })

  console.log('✅ Created 5 submissions (with version history)\n')

  // ============================================================
  // STEP 11: CREATE FEEDBACK
  // ============================================================
  console.log('💬 Creating feedback...')

  // Feedback on Proposal v1
  await prisma.feedback.create({
    data: {
      content:
        'The problem statement is well-articulated. However, the scope is too broad — please narrow down to 2-3 core features and elaborate the tech stack justification.',
      inlineComments: [
        'Page 2, Section 2: Expand the fragmented communication issue.',
        'Page 4: Add a competitive analysis section.',
      ],
      milestoneId: proposalMilestone.id,
      authorId: drShazia.id,
    },
  })

  // Feedback on Proposal v2 (approval)
  await prisma.feedback.create({
    data: {
      content:
        'Much improved. Scope is now realistic and the timeline is achievable. Approved — proceed to SRS phase.',
      inlineComments: ['Page 3: Great tech stack justification.'],
      milestoneId: proposalMilestone.id,
      submissionId: proposalV2.id,
      authorId: drShazia.id,
    },
  })

  // Feedback on SRS
  await prisma.feedback.create({
    data: {
      content:
        'SRS is comprehensive. Add non-functional requirements around scalability and security. Otherwise approved.',
      inlineComments: [
        'Section 3.2: Specify expected concurrent user load.',
        'Section 4.1: Add JWT authentication flow diagram.',
      ],
      milestoneId: srsMilestone.id,
      submissionId: srsSubmission.id,
      authorId: drShazia.id,
    },
  })

  // Feedback on Design (revision required)
  await prisma.feedback.create({
    data: {
      content:
        'Database schema looks good but the API contract section needs more detail. Please document request/response schemas for all endpoints and add error handling strategy. Marking as revision required.',
      inlineComments: [
        'Page 8: Add pagination strategy for team listing.',
        'Page 12: Specify rate limiting approach.',
      ],
      milestoneId: designMilestone.id,
      submissionId: designSubmission.id,
      authorId: drShazia.id,
    },
  })

  console.log('✅ Created 4 feedback entries\n')

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('═══════════════════════════════════════════════════════')
  console.log('✅ Seed completed successfully!')
  console.log('═══════════════════════════════════════════════════════')
  console.log('\n📊 Created:')
  console.log('   • 7 users (5 students, 1 teacher, 1 admin)')
  console.log('   • 1 team (4 members, led by Rimsha Arfeen)')
  console.log('   • 1 join request (from Ramsha, pending)')
  console.log('   • 1 project (supervised by Dr. Shazia)')
  console.log('   • 4 milestones (Proposal, SRS, Design, Implementation)')
  console.log('   • 5 submissions (with version history)')
  console.log('   • 4 feedback entries')
  console.log('\n🔐 Login credentials (all users):')
  console.log('   Password: password123')
  console.log('\n   Students:')
  console.log('   • rimsha.arfeen@university.edu  (Team Lead)')
  console.log('   • marium@university.edu         (Member)')
  console.log('   • sonia@university.edu          (Member)')
  console.log('   • anousha@university.edu        (Member)')
  console.log('   • ramsha@university.edu         (Join request pending)')
  console.log('\n   Supervisor:')
  console.log('   • shazia@university.edu         (Dr. Shazia)')
  console.log('\n   Admin:')
  console.log('   • admin@university.edu')
  console.log('═══════════════════════════════════════════════════════\n')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })