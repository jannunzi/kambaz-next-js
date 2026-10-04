import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import StatusPanel from "../../components/StatusPanel";
import { isQuizTakingConfigured, isXaiConfigured } from "@/lib/config";
import { loadQuizAccessForRoster } from "@/lib/quiz-exam/access-overrides";
import { findLatestQuizAttempt } from "@/lib/quiz-exam/attempts";
import { listQuizGradeOverrides } from "@/lib/quiz-exam/grade-overrides";
import {
  drawWebsiteAttempt,
  getExamBank,
  toStudentQuestion,
} from "@/lib/quiz-exam";
import { isWebsiteCodingQuizId } from "@/lib/question-bank";
import { buildAttemptReview } from "@/lib/quiz-exam/review";
import {
  canRevealAnswers,
  getAnswerRevealPhase,
  getQuizSchedule,
  isCanvasOnlyQuiz,
  isTakeWindowOpen,
  scheduleToIso,
  syllabusTakeWindowSentence,
  type QuizAnswersVisibleMode,
  type QuizTakeOverrideMode,
} from "@/lib/quiz-exam/schedule";
import { canvasUserIdFromMetadata } from "@/lib/roster/emails";
import { loadClerkRosterEmails } from "@/lib/roster/load-clerk-emails";
import { STUDENT_COPY } from "@/lib/quiz-exam/student-copy";
import { lookupCanvasRoster } from "@/lib/roster/lookup";
import {
  effectiveIsStaff,
  isImpersonatingStudent,
} from "@/lib/roster/staff-access";
import {
  IMPERSONATION_STUDENT_NAME,
  impersonationStudentEmail,
} from "@/lib/roster/view-mode";
import { SubmittedAttemptView, WindowBanner } from "../components/AttemptReview";
import ExamForm from "../components/ExamForm";
import QuizAccessOverrides from "../components/QuizAccessOverrides";
import StaffAttemptsLink from "../../staff/components/StaffAttemptsLink";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ quizId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { quizId } = await params;
  const bank = getExamBank(quizId);
  return {
    title: bank
      ? `Take ${bank.title} — CS 4550 / CS 5610`
      : "Graded quiz",
  };
}

function TakeNav({
  quizId,
  showAuthorReview,
}: {
  quizId: string;
  showAuthorReview: boolean;
}) {
  return (
    <p className="mb-4 text-sm">
      <Link href="/quizzes/take">Graded quizzes</Link>
      {showAuthorReview ? (
        <>
          {" · "}
          <Link href={`/quizzes/${quizId}`}>Author review (answers shown)</Link>
          {" · "}
          <Link href={`/quizzes/staff/${quizId}/attempts`}>Staff attempts</Link>
        </>
      ) : null}
      {" · "}
      <Link href="/book">Book</Link>
      {" · "}
      <Link href="/blog">Blog</Link>
      {" · "}
      <Link href="/slides">Slides</Link>
    </p>
  );
}

export default async function TakeExamPage({ params }: PageProps) {
  const { quizId } = await params;
  const bank = getExamBank(quizId);
  if (!bank) notFound();

  if (!isQuizTakingConfigured()) {
    return (
      <StatusPanel title="Graded quizzes are not available yet" tone="warn">
        <p>
          This exam cannot start right now. The rest of the course book stays
          available.
        </p>
      </StatusPanel>
    );
  }

  const { isAuthenticated, redirectToSignIn, sessionClaims } = await auth();
  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }
  const emails = await loadClerkRosterEmails({
    user,
    sessionClaims,
    userId: user.id,
  });
  const canvasUserId = canvasUserIdFromMetadata(user);
  const impersonating = await isImpersonatingStudent();
  const showAuthorReview = await effectiveIsStaff();
  const roster = await lookupCanvasRoster({
    emails,
    canvasUserIds: canvasUserId ? [canvasUserId] : [],
    impersonating,
  });

  if (roster.status === "empty") {
    return (
      <article>
        <StatusPanel title="Canvas roster has not been loaded" tone="warn">
          <p>
            You are signed in, but this course has no roster yet. Graded
            attempts are disabled until the instructor imports Canvas student
            emails.
          </p>
        </StatusPanel>
        <QuizAccessOverrides quizId={quizId} />
        <StaffAttemptsLink quizId={quizId} />
      </article>
    );
  }

  if (roster.status === "not_on_roster" || roster.status === "not_configured") {
    return (
      <article>
        <StatusPanel title={STUDENT_COPY.notOnRosterTitle} tone="warn">
          <p>{STUDENT_COPY.notOnRosterPage}</p>
          <p>
            If that still fails, ask the instructor to refresh the roster.
          </p>
        </StatusPanel>
        <QuizAccessOverrides quizId={quizId} />
        <StaffAttemptsLink quizId={quizId} />
      </article>
    );
  }

  const now = new Date();
  const schedule = getQuizSchedule(quizId);
  const { takeOverride, answersVisible } = await loadQuizAccessForRoster(
    quizId,
    roster.entry.section,
  );
  const attempt = impersonating
    ? null
    : await findLatestQuizAttempt(user.id, quizId);
  const phase = schedule
    ? getAnswerRevealPhase(schedule, now, Boolean(attempt), takeOverride)
    : attempt
      ? "submitted_waiting"
      : "take_open";

  const showForm =
    Boolean(schedule) &&
    !attempt &&
    (impersonating || phase === "take_open");
  const questions = showForm
    ? drawWebsiteAttempt(quizId, `${user.id}:${bank.id}`).map(toStudentQuestion)
    : [];
  const showCodingKeyNote =
    showAuthorReview && isWebsiteCodingQuizId(quizId) && !isXaiConfigured();

  return (
    <article>
      <TakeNav quizId={quizId} showAuthorReview={showAuthorReview} />
      <h1 className="mt-0 text-3xl font-semibold tracking-tight">
        {bank.title}
      </h1>
      {schedule && !(isCanvasOnlyQuiz(quizId) && phase !== "take_open") ? (
        <p className="mt-3 mb-0 text-sm text-neutral-700">
          {syllabusTakeWindowSentence(schedule)}
        </p>
      ) : null}
      {impersonating ? (
        <p className="rounded-lg border-2 border-amber-500 bg-amber-50 px-4 py-3 text-amber-950">
          Impersonation — viewing as {IMPERSONATION_STUDENT_NAME} (
          {impersonationStudentEmail()}). You can submit to smoke-test the
          exam UI. The attempt is <strong>not saved</strong>.
        </p>
      ) : null}

      {attempt && schedule && phase ? (
        <AttemptReviewSection
          title={bank.title}
          schedule={schedule}
          phase={phase}
          attempt={attempt}
          now={now}
          takeOverride={takeOverride}
          answersVisible={answersVisible}
        />
      ) : attempt && !schedule ? (
        <StatusPanel title="Attempt submitted" tone="ok">
          <p>
            Your score is {attempt.score} / {attempt.maxScore}. This quiz has
            no class review schedule configured yet, so answers stay hidden.
          </p>
        </StatusPanel>
      ) : showForm && schedule ? (
        <>
          {impersonating &&
          schedule &&
          !isTakeWindowOpen(schedule, now, takeOverride) ? (
            <div className="mt-4">
              <WindowBanner
                schedule={schedule}
                phase="take_closed"
                now={now}
                takeOverride={takeOverride}
                answersVisible={answersVisible}
              />
              <p className="text-sm text-neutral-700">
                Students cannot start a new attempt right now. Impersonation
                still shows the form so you can smoke-test the UI (not saved).
              </p>
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 text-sky-950">
              Student exam mode. Correct answers stay hidden until the
              class-wide review window. Returning to this same URL later is how
              you review.
            </p>
          )}
          {showCodingKeyNote ? (
            <p className="mt-4 rounded-lg border-2 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Staff only: <code>XAI_API_KEY</code> is not set. The local
              lenient grader still scores typical coding answers. Add the key
              (same name SnapTools uses) so unusual answers can go to Grok.
            </p>
          ) : null}
          <div className="mt-4">
            <ExamForm
              quizId={quizId}
              title={bank.title}
              questions={questions}
              startedAt={now.toISOString()}
              schedule={scheduleToIso(schedule)}
              impersonating={impersonating}
            />
          </div>
        </>
      ) : schedule ? (
        <div className="mt-4">
          <WindowBanner
            schedule={schedule}
            phase="take_closed"
            now={now}
            takeOverride={takeOverride}
            answersVisible={answersVisible}
          />
        </div>
      ) : (
        <StatusPanel title="This quiz is not open" tone="warn">
          <p>No class-wide take window is configured for this quiz.</p>
        </StatusPanel>
      )}
      <QuizAccessOverrides quizId={quizId} />
      <StaffAttemptsLink quizId={quizId} />
    </article>
  );
}

async function AttemptReviewSection({
  title,
  schedule,
  phase,
  attempt,
  now,
  takeOverride,
  answersVisible,
}: {
  title: string;
  schedule: NonNullable<ReturnType<typeof getQuizSchedule>>;
  phase: NonNullable<ReturnType<typeof getAnswerRevealPhase>>;
  attempt: NonNullable<Awaited<ReturnType<typeof findLatestQuizAttempt>>>;
  now: Date;
  takeOverride?: QuizTakeOverrideMode;
  answersVisible?: QuizAnswersVisibleMode;
}) {
  const reveal = canRevealAnswers(phase, answersVisible);
  const classOverrides = await listQuizGradeOverrides(attempt.quizId);
  const review = buildAttemptReview(attempt, reveal, classOverrides);
  if (!review) {
    return (
      <StatusPanel title="Attempt submitted" tone="ok">
        <p>
          Your score is {attempt.score} / {attempt.maxScore}. The drawn
          questions could not be rebuilt from the bank, so a full review is
          unavailable.
        </p>
      </StatusPanel>
    );
  }

  return (
    <div className="mt-4">
      <SubmittedAttemptView
        title={title}
        schedule={schedule}
        phase={phase}
        score={review.score}
        maxScore={review.maxScore}
        questions={review.questions}
        graded={review.graded}
        submittedAt={review.submittedAt}
        now={now}
        takeOverride={takeOverride}
        answersVisible={answersVisible}
      />
    </div>
  );
}
