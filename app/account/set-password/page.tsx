import type { Metadata } from "next";
import Link from "next/link";
import "@/app/(kambaz)/kambaz.css";
import { isClerkConfigured } from "@/lib/config";
import { safeReturnPath } from "@/lib/auth/must-change-password";
import PasswordChangeFields from "./PasswordChangeFields";
import SetPasswordForm from "./SetPasswordForm";

export const metadata: Metadata = {
  title: "Change your password — CS 4550 / CS 5610",
};

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.redirect_url) ? params.redirect_url[0] : params.redirect_url;
  const redirectTo = safeReturnPath(raw);

  if (!isClerkConfigured()) {
    return (
      <PasswordChangeFields
        footer={
          <Link href="/book" className="text-neutral-700 underline">
            Back to the course book
          </Link>
        }
      />
    );
  }

  return <SetPasswordForm redirectTo={redirectTo} />;
}
