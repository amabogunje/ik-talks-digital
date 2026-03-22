import { CourseLevel, CourseSkillArea } from "@prisma/client";
import { CourseLibraryBrowser } from "@/components/course-library-browser";
import { SiteShell } from "@/components/site-shell";
import { requireUser } from "@/lib/auth";
import { getCourseLibraryData } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { translateCourseText, translateLessonsText } from "@/lib/translation";

const pageCopy = {
  EN: {
    title: "Choose the right course for your next leap.",
    intro: "Pick up where you left off, revisit completed training, or start a new speaking path that matches the room you want to lead.",
    searchLabel: "Search courses",
    searchPlaceholder: "Search by course title or focus area",
    filterLabel: "Filter by skill area",
    allSkills: "All skills",
    noMatches: "No courses match that search yet. Try a broader term or another skill area.",
    myCourses: "My courses",
    myCoursesIntro: "These are the courses you already started. Jump back into the next lesson and keep your momentum.",
    exploreCourses: "Explore more courses",
    exploreCoursesIntro: "Start a fresh learning path when you are ready to grow a new speaking skill.",
    completedCourses: "Completed courses",
    completedCoursesIntro: "Finished courses stay here so you can revisit the material any time.",
    noCurrentCourses: "You have not started a course yet. Choose one below and we will guide your next lesson.",
    progressLabel: "Course progress",
    lessonAndDurationLabel: "Course scope",
    nextUp: "Next up",
    completedState: "Completed",
    inProgressState: "In progress",
    notStartedState: "Not started",
    startCourse: "Start course",
    continueCourse: "Continue lesson",
    reviewCourse: "Review course",
    viewDetails: "View details",
    openLibrary: "Explore courses",
    publicSpeaking: "Public speaking",
    hosting: "Hosting",
    communication: "Communication",
    beginner: "Beginner",
    advanced: "Advanced"
  },
  FR: {
    title: "Choisissez le bon cours pour votre prochaine progression.",
    intro: "Reprenez la ou vous vous etes arrete, revisitez un cours termine ou commencez un nouveau parcours adapte a la salle que vous voulez tenir.",
    searchLabel: "Rechercher un cours",
    searchPlaceholder: "Recherchez par titre ou par domaine",
    filterLabel: "Filtrer par domaine",
    allSkills: "Tous les domaines",
    noMatches: "Aucun cours ne correspond a cette recherche. Essayez un terme plus large ou un autre domaine.",
    myCourses: "Mes cours",
    myCoursesIntro: "Voici les cours que vous avez deja commences. Reprenez la prochaine lecon et gardez votre elan.",
    exploreCourses: "Explorer d'autres cours",
    exploreCoursesIntro: "Commencez un nouveau parcours quand vous etes pret a developper une autre competence de prise de parole.",
    completedCourses: "Cours termines",
    completedCoursesIntro: "Les cours termines restent ici pour que vous puissiez les revisiter a tout moment.",
    noCurrentCourses: "Vous n'avez pas encore commence de cours. Choisissez-en un ci-dessous et nous vous guiderons vers la prochaine lecon.",
    progressLabel: "Progression du cours",
    lessonAndDurationLabel: "Contenu du cours",
    nextUp: "Suite",
    completedState: "Termine",
    inProgressState: "En cours",
    notStartedState: "Pas commence",
    startCourse: "Commencer le cours",
    continueCourse: "Continuer la lecon",
    reviewCourse: "Revoir le cours",
    viewDetails: "Voir le detail",
    openLibrary: "Explorer les cours",
    publicSpeaking: "Prise de parole",
    hosting: "Animation",
    communication: "Communication",
    beginner: "Debutant",
    advanced: "Avance"
  }
} as const;

type CourseState = Awaited<ReturnType<typeof getCourseLibraryData>>["allCourses"][number] & {
  featured: boolean;
  skillArea: CourseSkillArea;
  level: CourseLevel;
};

type CoursePageCopy = (typeof pageCopy)["EN"] | (typeof pageCopy)["FR"];

function formatDuration(minutes: number, language: "EN" | "FR") {
  if (language === "FR") {
    return minutes >= 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60} min` : `${minutes} min`;
  }
  return minutes >= 60 ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min` : `${minutes} min`;
}

function skillAreaLabel(skillArea: CourseSkillArea, copy: CoursePageCopy) {
  switch (skillArea) {
    case CourseSkillArea.HOSTING:
      return copy.hosting;
    case CourseSkillArea.COMMUNICATION:
      return copy.communication;
    default:
      return copy.publicSpeaking;
  }
}

function levelLabel(level: CourseLevel, copy: CoursePageCopy) {
  return level === CourseLevel.ADVANCED ? copy.advanced : copy.beginner;
}

export default async function CoursesPage() {
  const user = await requireUser();
  const language = normalizeLanguage(user.language);
  const dict = getDictionary(language);
  const copy = pageCopy[language];
  const library = await getCourseLibraryData(user.id);
  const allCourses = library.allCourses as CourseState[];
  const [translatedCourses, translatedLessons] = await Promise.all([
    translateCourseText(allCourses, language),
    translateLessonsText(allCourses.flatMap((course) => course.lessons), language)
  ]);
  const translatedById = new Map(translatedCourses.map((course) => [course.id, course]));
  const translatedLessonsById = new Map(translatedLessons.map((lesson) => [lesson.id, lesson]));

  const serializeCourse = (course: CourseState) => {
    const translatedCourse = translatedById.get(course.id) ?? course;
    const translatedNextLesson = course.currentLesson ? translatedLessonsById.get(course.currentLesson.id)?.title ?? course.currentLesson.title : null;
    const statusTone = course.status === "completed" ? "complete" as const : course.status === "in_progress" ? "progress" as const : "neutral" as const;
    const statusLabel = course.status === "completed" ? copy.completedState : course.status === "in_progress" ? copy.inProgressState : copy.notStartedState;
    const primaryLabel = course.status === "completed" ? copy.reviewCourse : course.status === "in_progress" ? copy.continueCourse : copy.startCourse;

    return {
      id: course.id,
      title: translatedCourse.title,
      description: translatedCourse.description,
      thumbnail: course.thumbnail,
      featured: course.featured,
      skillArea: course.skillArea,
      skillAreaLabel: skillAreaLabel(course.skillArea, copy),
      levelLabel: levelLabel(course.level, copy),
      statusLabel,
      statusTone,
      progressPercent: course.progressPercent,
      progressLabel: copy.progressLabel,
      lessonCountLabel: copy.lessonAndDurationLabel,
      durationLabel: `${course.lessonsCount} ${dict.lessonsLabel} - ${formatDuration(course.durationMin, language)}`,
      nextLessonLabel: translatedNextLesson ? `${copy.nextUp}: ${translatedNextLesson}` : copy.openLibrary,
      primaryHref: course.status === "completed" ? course.detailHref : course.resumeHref,
      primaryLabel,
      secondaryHref: course.detailHref,
      secondaryLabel: copy.viewDetails
    };
  };

  return (
    <SiteShell language={language} role={user.role}>
      <div className="space-y-8 sm:space-y-10">
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">{dict.courseLibrary}</p>
          <h1 className="font-display text-4xl text-white sm:text-5xl">{copy.title}</h1>
          <p className="max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">{copy.intro}</p>
        </section>

        <CourseLibraryBrowser
          copy={copy}
          myCourses={(library.myCourses as CourseState[]).map(serializeCourse)}
          availableCourses={(library.availableCourses as CourseState[]).map(serializeCourse)}
          completedCourses={(library.completedCourses as CourseState[]).map(serializeCourse)}
          skillFilters={[
            { value: CourseSkillArea.PUBLIC_SPEAKING, label: copy.publicSpeaking },
            { value: CourseSkillArea.HOSTING, label: copy.hosting },
            { value: CourseSkillArea.COMMUNICATION, label: copy.communication }
          ]}
        />
      </div>
    </SiteShell>
  );
}