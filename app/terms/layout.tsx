import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for the kambaz.dev course website and the WebDevTV Uploader YouTube integration.",
};

export default function TermsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseInfoLayout>{children}</CourseInfoLayout>;
}
