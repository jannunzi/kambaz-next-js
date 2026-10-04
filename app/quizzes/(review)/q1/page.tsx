import type { Metadata } from "next";
import { CHAPTER1_REVIEW_BANK, bankStats } from "@/lib/question-bank";
import {
  QUIZ_TIME_LIMIT_MINUTES,
  WEBSITE_CODING_DRAW_COUNT,
  WEBSITE_TRADITIONAL_DRAW_COUNT,
} from "@/lib/quiz-exam";
import QuestionBankReview from "../../components/QuestionBankReview";
import { renderStaffReview } from "../../components/render-staff-review";

export const metadata: Metadata = {
  title: "Q1 question bank (review draft) — CS 4550 / CS 5610",
  description:
    "Author review of every proposed Chapter 1 quiz question and option. Answers are shown.",
};

export default async function Quiz1BankPage() {
  return renderStaffReview(() => {
    const stats = bankStats(CHAPTER1_REVIEW_BANK);
    return (
      <QuestionBankReview
        bank={CHAPTER1_REVIEW_BANK}
        stats={stats}
        chapterHref="/book/ch1"
        quizId="q1"
        studentDrawNote={`Website Q1 draws ${WEBSITE_TRADITIONAL_DRAW_COUNT} traditional items plus ${WEBSITE_CODING_DRAW_COUNT} coding items (form attributes + a bullet list), about ${QUIZ_TIME_LIMIT_MINUTES.q1} minutes, 100 points. Canvas fallback stays ${WEBSITE_TRADITIONAL_DRAW_COUNT + WEBSITE_CODING_DRAW_COUNT} traditional groups only — Canvas cannot run the coding grader.`}
      />
    );
  });
}
