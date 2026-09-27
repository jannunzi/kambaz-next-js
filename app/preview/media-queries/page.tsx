import type { Metadata } from "next";
import MediaQueriesDemo from "@/app/labs/lab2/MediaQueriesDemo";

export const metadata: Metadata = {
  title: "Media queries preview",
};

export default function MediaQueriesPreviewPage() {
  return <MediaQueriesDemo />;
}
