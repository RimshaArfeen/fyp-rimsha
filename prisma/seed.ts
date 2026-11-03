import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/** Calendar day at 12:00 UTC, offset from today (same convention as toDay() in the app). */
const day = (offset: number) => {
  const d = new Date()
  d.setUTCHours(12, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() + offset)
  return d
}
const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000)

async function main() {
  console.log('🌱 Starting seed...\n')

  // ============================================================
  // STEP 1: CLEAN EXISTING DATA (children before parents)
  // ============================================================
  console.log('🧹 Cleaning existing data...')
  await prisma.feedbackReply.deleteMany()
  await prisma.feedback.deleteMany()
  await prisma.message.deleteMany()
  await prisma.task.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.invite.deleteMany()
  await prisma.joinRequest.deleteMany()
  await prisma.project.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.team.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Cleaned\n')

  // ============================================================
  // STEP 2: PASSWORD
  // ============================================================
  const passwordHash = await bcrypt.hash('password123', 12)

  // ============================================================
  // STEP 3: STUDENTS
  // ============================================================
  console.log('👥 Creating students...')

  const rimsha = await prisma.user.create({
    data: {
      email: 'rimsha.arfeen@university.edu',
      password: passwordHash,
      name: 'Rimsha Arfeen',
      role: 'student',
      contact: '+92-300-1111111',
      lastSeenAt: new Date(),
      registrationNumber: 'BSCS-2022-001',
      program: 'BSCS',
      semester: 8,
      cgpa: 3.85,
      enrolledCourses: ['Final Year Project', 'Machine Learning', 'Cloud Computing'],
      skills: ['Python', 'React', 'Node.js', 'MongoDB', 'Prisma', 'Next.js', 'AI/ML'],
      interestAreas: ['Artificial Intelligence', 'Full Stack Development', 'Cloud Systems'],
      experienceLevel: 'Advanced',
      githubLink: 'github.com/RimshaArfeen',
      linkedinProfile: 'linkedin.com/in/rimsha-arfeen',
    },
  })

  const marium = await prisma.user.create({
    data: {
      email: 'marium@university.edu',
      password: passwordHash,
      name: 'Marium',
      role: 'student',
      contact: '+92-300-2222222',
      lastSeenAt: new Date(),
      registrationNumber: 'BSCS-2022-002',
      program: 'BSCS',
      semester: 8,
      cgpa: 3.72,
      enrolledCourses: ['Final Year Project', 'Machine Learning', 'Web Engineering'],
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
      interestAreas: ['Frontend Development', 'UI/UX Design'],
      experienceLevel: 'Intermediate',
      githubLink: 'github.com/marium',
      linkedinProfile: 'linkedin.com/in/marium',
    },
  })

  const sonia = await prisma.user.create({
    data: {
      email: 'sonia@university.edu',
      password: passwordHash,
      name: 'Sonia',
      role: 'student',
      contact: '+92-300-3333333',
      registrationNumber: 'BSCS-2022-003',
      program: 'BSCS',
      semester: 8,
      cgpa: 3.65,
      enrolledCourses: ['Final Year Project', 'Data Mining', 'Software Engineering'],
      skills: ['Python', 'Pandas', 'SQL', 'Data Visualization'],
      interestAreas: ['Data Science', 'Analytics'],
      experienceLevel: 'Intermediate',
      githubLink: 'github.com/sonia',
      linkedinProfile: 'linkedin.com/in/sonia',
    },
  })

  const anousha = await prisma.user.create({
    data: {
      email: 'anousha@university.edu',
      password: passwordHash,
      name: 'Anousha',
      role: 'student',
      contact: '+92-300-4444444',
      registrationNumber: 'BSCS-2022-004',
      program: 'BSCS',
      semester: 8,
      cgpa: 3.9,
      enrolledCourses: ['Final Year Project', 'Deep Learning', 'Computer Vision'],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV'],
      interestAreas: ['Deep Learning', 'Computer Vision', 'NLP'],
      experienceLevel: 'Advanced',
      githubLink: 'github.com/anousha',
      linkedinProfile: 'linkedin.com/in/anousha',
    },
  })

  // Not in the team: she sends a join request.
  const ramsha = await prisma.user.create({
    data: {
      email: 'ramsha@university.edu',
      password: passwordHash,
      name: 'Ramsha',
      role: 'student',
      contact: '+92-300-5555555',
      registrationNumber: 'BSCS-2022-005',
      program: 'BSCS',
      semester: 8,
      cgpa: 3.78,
      enrolledCourses: ['Final Year Project', 'Web Engineering', 'Database Systems'],
      skills: ['JavaScript', 'Express.js', 'PostgreSQL', 'Docker'],
      interestAreas: ['Backend Development', 'DevOps'],
      experienceLevel: 'Intermediate',
      githubLink: 'github.com/ramsha',
      linkedinProfile: 'linkedin.com/in/ramsha',
    },
  })

  console.log('✅ Created 5 students\n')

  // ============================================================
  // STEP 4: SUPERVISOR
  // ============================================================
  console.log('👨‍🏫 Creating supervisor...')

  const drShazia = await prisma.user.create({
    data: {
      email: 'shazia@university.edu',
      password: passwordHash,
      name: 'Dr. Shazia',
      role: 'teacher',
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
  // STEP 5: ADMIN
  // ============================================================
  console.log('🛡️  Creating admin...')

  await prisma.user.create({
    data: {
      email: 'admin@university.edu',
      password: passwordHash,
      name: 'System Administrator',
      role: 'admin',
      contact: '+92-300-0000000',
      department: 'IT Services',
      designation: 'Platform Administrator',
    },
  })

  console.log('✅ Created admin\n')

  // ============================================================
  // STEP 6: TEAM (led by Rimsha)
  // ============================================================
  console.log('👥 Creating team...')

  const team = await prisma.team.create({
    data: {
      name: 'ProjectPulse Team',
      maxSize: 5,
      projectDomain: 'Web Development',
      description:
        'Building a centralized platform for managing final year projects between students and supervisors.',
      skills: ['React', 'Node.js', 'MongoDB'],
      isOpen: true,
      supervisorStatus: 'ACCEPTED',
      leadId: rimsha.id,
    },
  })

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
  // STEP 7: JOIN REQUEST (Ramsha -> Team)
  // ============================================================
  console.log('📨 Creating join request...')

  await prisma.joinRequest.create({
    data: {
      requesterId: ramsha.id,
      teamId: team.id,
      message:
        'Hi Rimsha! I have strong backend and DevOps skills and would love to contribute to ProjectPulse. I can handle deployment and CI/CD.',
      status: 'pending',
    },
  })

  console.log('✅ Created pending join request\n')

  // ============================================================
  // STEP 8: PROJECT (dates relative to today so nothing looks stale)
  // ============================================================
  console.log('📁 Creating project...')

  const project = await prisma.project.create({
    data: {
      title: 'ProjectPulse: Academic Project Management Platform',
      description:
        'A comprehensive web-based platform that connects students, teams, and supervisors in a unified ecosystem for managing final year projects. Features include team formation, supervisor discovery, milestone tracking, submission versioning, and structured feedback.',
      timelineStart: day(-120),
      timelineEnd: day(120),
      status: 'APPROVED',
      teamId: team.id,
      supervisorId: drShazia.id,
    },
  })

  console.log('✅ Created project\n')

  // ============================================================
  // STEP 9: MILESTONES
  //   Proposal       approved
  //   SRS            approved
  //   Design         revision   (supervisor asked for changes)
  //   Implementation pending, nothing submitted yet
  // ============================================================
  console.log('🎯 Creating milestones...')

  const proposalMilestone = await prisma.milestone.create({
    data: {
      title: 'Project Proposal',
      description:
        'Submit initial project proposal with problem statement, objectives, scope, and proposed solution.',
      deadline: day(-90),
      status: 'approved',
      projectId: project.id,
      assigneeIds: [rimsha.id, marium.id],
    },
  })

  const srsMilestone = await prisma.milestone.create({
    data: {
      title: 'SRS Document',
      description:
        'Software Requirements Specification covering functional and non-functional requirements, use cases, and ERD.',
      deadline: day(-55),
      status: 'approved',
      projectId: project.id,
      assigneeIds: [marium.id],
    },
  })

  const designMilestone = await prisma.milestone.create({
    data: {
      title: 'System Design & Architecture',
      description:
        'High-level and low-level design documents including database schema, API contracts, and UI wireframes.',
      deadline: day(-5),
      status: 'revision',
      projectId: project.id,
      assigneeIds: [sonia.id, rimsha.id],
    },
  })

  await prisma.milestone.create({
    data: {
      title: 'Final Implementation & Testing',
      description:
        'Complete implementation of all modules, unit testing, integration testing, and user acceptance testing.',
      deadline: day(60),
      status: 'pending',
      projectId: project.id,
      assigneeIds: [anousha.id, rimsha.id, marium.id],
    },
  })

  console.log('✅ Created 4 milestones\n')

  // ============================================================
  // STEP 10: SUBMISSIONS (version history)
  // NOTE: these fileUrls are placeholders, so downloads will 404.
  // ============================================================
  console.log('📤 Creating submissions...')

  const proposalV1 = await prisma.submission.create({
    data: {
      fileName: 'ProjectPulse_Proposal_v1.pdf',
      fileUrl: '/uploads/seed/ProjectPulse_Proposal_v1.pdf',
      version: 1,
      notes: 'Initial draft of the proposal.',
      status: 'revision',
      reviewedAt: day(-100),
      milestoneId: proposalMilestone.id,
      submittedById: rimsha.id,
      createdAt: day(-105),
    },
  })

  const proposalV2 = await prisma.submission.create({
    data: {
      fileName: 'ProjectPulse_Proposal_v2.pdf',
      fileUrl: '/uploads/seed/ProjectPulse_Proposal_v2.pdf',
      version: 2,
      notes: 'Revised proposal addressing supervisor feedback on scope and timeline.',
      status: 'approved',
      reviewedAt: day(-92),
      milestoneId: proposalMilestone.id,
      submittedById: rimsha.id,
      createdAt: day(-96),
    },
  })

  const srsSubmission = await prisma.submission.create({
    data: {
      fileName: 'ProjectPulse_SRS_v1.pdf',
      fileUrl: '/uploads/seed/ProjectPulse_SRS_v1.pdf',
      version: 1,
      notes: 'Complete SRS with use case diagrams and ERD.',
      status: 'approved',
      reviewedAt: day(-58),
      milestoneId: srsMilestone.id,
      submittedById: marium.id,
      createdAt: day(-62),
    },
  })

  const designSubmission = await prisma.submission.create({
    data: {
      fileName: 'ProjectPulse_Design_Doc_v1.pdf',
      fileUrl: '/uploads/seed/ProjectPulse_Design_Doc_v1.pdf',
      version: 1,
      notes: 'Contains system architecture, database schema, and wireframes.',
      status: 'revision',
      reviewedAt: day(-3),
      milestoneId: designMilestone.id,
      submittedById: sonia.id,
      createdAt: day(-7),
    },
  })

  console.log('✅ Created 4 submissions\n')

  // ============================================================
  // STEP 11: FEEDBACK (projectId is required)
  // ============================================================
  console.log('💬 Creating feedback...')

  await prisma.feedback.create({
    data: {
      content:
        'The problem statement is well-articulated. However, the scope is too broad. Please narrow down to 2-3 core features and elaborate the tech stack justification.',
      inlineComments: [
        'Page 2, Section 2: Expand the fragmented communication issue.',
        'Page 4: Add a competitive analysis section.',
      ],
      resolved: true,
      projectId: project.id,
      milestoneId: proposalMilestone.id,
      submissionId: proposalV1.id,
      authorId: drShazia.id,
      createdAt: day(-100),
    },
  })

  await prisma.feedback.create({
    data: {
      content:
        'Much improved. Scope is now realistic and the timeline is achievable. Approved, proceed to the SRS phase.',
      inlineComments: ['Page 3: Great tech stack justification.'],
      resolved: true,
      projectId: project.id,
      milestoneId: proposalMilestone.id,
      submissionId: proposalV2.id,
      authorId: drShazia.id,
      createdAt: day(-92),
    },
  })

  await prisma.feedback.create({
    data: {
      content:
        'SRS is comprehensive. Add non-functional requirements around scalability and security. Otherwise approved.',
      inlineComments: [
        'Section 3.2: Specify expected concurrent user load.',
        'Section 4.1: Add JWT authentication flow diagram.',
      ],
      resolved: true,
      projectId: project.id,
      milestoneId: srsMilestone.id,
      submissionId: srsSubmission.id,
      authorId: drShazia.id,
      createdAt: day(-58),
    },
  })

  // Open feedback with a reply: shows the Reply and Mark as resolved flow.
  const designFeedback = await prisma.feedback.create({
    data: {
      content:
        'Database schema looks good but the API contract section needs more detail. Please document request/response schemas for all endpoints and add an error handling strategy. Marking as revision required.',
      inlineComments: [
        'Page 8: Add pagination strategy for team listing.',
        'Page 12: Specify rate limiting approach.',
      ],
      resolved: false,
      projectId: project.id,
      milestoneId: designMilestone.id,
      submissionId: designSubmission.id,
      authorId: drShazia.id,
      createdAt: day(-3),
    },
  })

  await prisma.feedbackReply.create({
    data: {
      content: 'Thank you, ma\'am. We will add the request/response schemas and resubmit this week.',
      feedbackId: designFeedback.id,
      authorId: sonia.id,
      createdAt: day(-2),
    },
  })

  console.log('✅ Created 4 feedback entries + 1 reply\n')

  // ============================================================
  // STEP 12: TASKS + CHAT
  // ============================================================
  console.log('🗂️  Creating tasks and chat messages...')

  await prisma.task.createMany({
    data: [
      { title: 'Write API request/response schemas', status: 'pending', due: day(5), teamId: team.id, projectId: project.id, assignedToId: sonia.id },
      { title: 'Set up CI pipeline', status: 'pending', due: day(14), teamId: team.id, projectId: project.id, assignedToId: marium.id },
      { title: 'Finalize ERD', status: 'done', due: day(-20), teamId: team.id, projectId: project.id, assignedToId: anousha.id },
    ],
  })

  await prisma.message.createMany({
    data: [
      { content: 'Backend routes are ready for review.', teamId: team.id, authorId: marium.id, createdAt: minutesAgo(90) },
      { content: 'Great. I will update the API docs today.', teamId: team.id, authorId: sonia.id, createdAt: minutesAgo(80) },
      { content: 'Please resubmit the design doc once the schemas are in.', teamId: team.id, authorId: rimsha.id, createdAt: minutesAgo(60) },
    ],
  })

  console.log('✅ Created 3 tasks and 3 messages\n')

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('═══════════════════════════════════════════════════════')
  console.log('✅ Seed completed successfully!')
  console.log('═══════════════════════════════════════════════════════')
  console.log('\n🔐 Password for every account: password123\n')
  console.log('   Team lead:  rimsha.arfeen@university.edu')
  console.log('   Members:    marium@ / sonia@ / anousha@ university.edu')
  console.log('   No team:    ramsha@university.edu (pending join request)')
  console.log('   Supervisor: shazia@university.edu')
  console.log('   Admin:      admin@university.edu')
  console.log('\n   Demo state: Proposal + SRS approved, Design needs revision,')
  console.log('   Implementation pending (nothing submitted yet).')
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