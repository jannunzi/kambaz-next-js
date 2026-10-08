import type { Metadata } from "next";
import type { ReactNode } from "react";
import CourseInfoLayout from "@/app/course-info/CourseInfoLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the WebDevTV Uploader YouTube integration and the kambaz.dev course website.",
};

export default function PrivacyLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <CourseInfoLayout>{children}</CourseInfoLayout>;
}
