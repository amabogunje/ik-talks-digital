import bcrypt from "bcryptjs";
import { CourseLevel, CourseSkillArea, Language, PrismaClient, Role } from "@prisma/client";
import { recommendedResources } from "@/lib/recommends";

const prisma = new PrismaClient();

async function main() {
  await prisma.contentTranslation.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.practiceSession.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.scriptTemplate.deleteMany();
  await prisma.scriptRequest.deleteMany();
  await prisma.promptScenario.deleteMany();
  await prisma.recommendationResource.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      name: "IK Admin",
      email: "admin@iktalks.africa",
      passwordHash,
      role: Role.ADMIN,
      language: Language.EN
    }
  });

  const user = await prisma.user.create({
    data: {
      name: "Ada Speaker",
      email: "ada@iktalks.africa",
      passwordHash,
      role: Role.USER,
      language: Language.EN
    }
  });

  const scenarios = await Promise.all([
    prisma.promptScenario.create({
      data: {
        title: "Wedding MC Intro",
        slug: "wedding-mc-intro",
        description: "Open a joyful wedding reception with warmth, rhythm, and confidence.",
        guidance: "Smile, greet both families, set the energy, and keep your pace relaxed but upbeat."
      }
    }),
    prisma.promptScenario.create({
      data: {
        title: "Corporate Event Opening",
        slug: "corporate-event-opening",
        description: "Welcome guests to a business event with clarity and authority.",
        guidance: "Lead with gratitude, frame the purpose of the event, and sound composed."
      }
    }),
    prisma.promptScenario.create({
      data: {
        title: "Panel Moderator Intro",
        slug: "panel-moderator-intro",
        description: "Introduce a panel discussion and set expectations for the audience.",
        guidance: "Mention the theme, introduce the experts, and invite the audience into the conversation."
      }
    }),
    prisma.promptScenario.create({
      data: {
        title: "Personal Introduction",
        slug: "personal-introduction",
        description: "Present yourself with confidence for interviews, events, or networking.",
        guidance: "Say who you are, what you do, and one memorable thing about your journey."
      }
    })
  ]);

  await prisma.scriptTemplate.createMany({
    data: [
      {
        scenarioId: scenarios[0].id,
        language: Language.EN,
        tone: "friendly",
        audience: "wedding",
        template:
          "Good evening everyone. What a beautiful joy it is to welcome our families and friends as we celebrate this special day."
      },
      {
        scenarioId: scenarios[1].id,
        language: Language.FR,
        tone: "formal",
        audience: "corporate",
        template:
          "Bonsoir a toutes et a tous. Merci de vous joindre a nous pour ce moment important pour notre communaute professionnelle."
      },
      {
        scenarioId: scenarios[3].id,
        language: Language.PIDGIN,
        tone: "energetic",
        audience: "youth",
        template:
          "My people, how una dey? Na me be this, and I carry energy plus clear message come meet una today."
      }
    ]
  });

  const course = await prisma.course.create({
    data: {
      title: "Command the Room",
      slug: "command-the-room",
      description: "Build stage confidence, vocal control, and the presence to hold any room.",
      thumbnail:
        "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      skillArea: CourseSkillArea.PUBLIC_SPEAKING,
      level: CourseLevel.BEGINNER,
      lessons: {
        create: [
          {
            title: "Presence Before Words",
            slug: "presence-before-words",
            description: "How posture, stillness, and breath shape first impressions.",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            durationMin: 8,
            order: 1
          },
          {
            title: "Voice With Authority",
            slug: "voice-with-authority",
            description: "Practical vocal techniques for stronger delivery.",
            videoUrl: "https://www.w3schools.com/html/movie.mp4",
            durationMin: 11,
            order: 2
          }
        ]
      }
    },
    include: { lessons: true }
  });

  await prisma.course.create({
    data: {
      title: "Host With Grace",
      slug: "host-with-grace",
      description: "Learn MC structure, transitions, and crowd-reading for live events.",
      thumbnail:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      skillArea: CourseSkillArea.HOSTING,
      level: CourseLevel.BEGINNER,
      lessons: {
        create: [
          {
            title: "Opening an Event",
            slug: "opening-an-event",
            description: "Set tone, acknowledge the room, and earn attention quickly.",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            durationMin: 9,
            order: 1
          },
          {
            title: "Smooth Transitions",
            slug: "smooth-transitions",
            description: "Move between segments without losing energy.",
            videoUrl: "https://www.w3schools.com/html/movie.mp4",
            durationMin: 10,
            order: 2
          }
        ]
      }
    }
  });

  await prisma.course.create({
    data: {
      title: "Speak to Inspire",
      slug: "speak-to-inspire",
      description: "Shape memorable stories, persuasive messages, and audience connection for talks that move people.",
      thumbnail:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
      featured: false,
      skillArea: CourseSkillArea.COMMUNICATION,
      level: CourseLevel.ADVANCED,
      lessons: {
        create: [
          {
            title: "Stories That Stick",
            slug: "stories-that-stick",
            description: "Turn personal and professional moments into clear, compelling speaking stories.",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            durationMin: 10,
            order: 1
          },
          {
            title: "Speaking With Conviction",
            slug: "speaking-with-conviction",
            description: "Use structure, emphasis, and emotional intent to make your message land.",
            videoUrl: "https://www.w3schools.com/html/movie.mp4",
            durationMin: 12,
            order: 2
          }
        ]
      }
    }
  });

  await prisma.recommendationResource.createMany({
    data: recommendedResources.map((resource, index) => ({
      titleEn: resource.title.EN,
      titleFr: resource.title.FR,
      source: resource.source,
      contentType: resource.contentType,
      category: resource.category,
      summaryEn: resource.summary.EN,
      summaryFr: resource.summary.FR,
      ikNoteEn: resource.ikNote.EN,
      ikNoteFr: resource.ikNote.FR,
      estimatedLength: resource.estimatedLength,
      url: resource.url,
      thumbnail: resource.thumbnail,
      featured: resource.featured,
      active: true,
      sortOrder: index
    }))
  });

  await prisma.enrollment.create({
    data: {
      userId: user.id,
      courseId: course.id,
      progressPercent: 50,
      lessonsCompleted: 1
    }
  });

  await prisma.lessonProgress.create({
    data: {
      userId: user.id,
      lessonId: course.lessons[0].id,
      completed: true,
      completedAt: new Date()
    }
  });

  const session = await prisma.practiceSession.create({
    data: {
      userId: user.id,
      scenarioId: scenarios[0].id,
      recordingLabel: "Ada wedding practice take 1",
      durationSeconds: 78,
      transcript:
        "Good evening distinguished guests, family and friends. Today na pure joy as we gather to celebrate love and welcome everyone warmly."
    }
  });

  await prisma.feedback.create({
    data: {
      practiceSessionId: session.id,
      confidence: 82,
      clarity: 78,
      pace: 74,
      energy: 88,
      fillerWords: 4,
      summary:
        "You sounded warm and welcoming. Your energy fits a celebratory Nigerian wedding setting, and your opening lands well.",
      improvementTips: JSON.stringify([
        "Pause briefly after greeting the audience so your welcome feels more intentional.",
        "Reduce repeated filler phrases to sound even more polished.",
        "Lift your volume slightly on key lines to command the room."
      ]),
      language: Language.EN
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
