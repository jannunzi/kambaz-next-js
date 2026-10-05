import type { ReactNode } from "react";
import CourseSiteHeader from "@/app/course-info/CourseSiteHeader";
import { AccountProvider } from "@/lib/account/AccountContext";
import BookTOC from "./TOC";
import BookAffiliateBanner from "./components/BookAffiliateBanner";
import "./book.css";

export default function BookLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AccountProvider>
      <div className="book-shell flex min-h-screen flex-col">
        <CourseSiteHeader />
        <div className="flex min-h-0 flex-1">
          <BookTOC />
          <main className="min-w-0 w-full flex-1 overflow-x-auto py-6">
            <div className="page-content px-4 sm:px-6">{children}</div>
          </main>
        </div>
        <BookAffiliateBanner />
      </div>
    </AccountProvider>
  );
}
