export type CanvasRosterEntry = {
  email: string;
  canvasUserId?: string;
  sisUserId?: string;
  sisLoginId?: string;
  loginId?: string;
  /** Extra mailboxes stored on the roster document, besides the primary email. */
  emails?: string[];
  name?: string;
  section?: string;
  source?: "mongo" | "env" | "csv" | "json" | "impersonation" | "demo";
  importedAt?: Date;
};

export type ClerkEmailLike = {
  id?: string;
  emailAddress?: string;
  email_address?: string;
  verification?: { status?: string | null } | null;
};

export type ClerkExternalAccountLike = {
  emailAddress?: string;
  email_address?: string;
};

export type ClerkUserLike = {
  id?: string;
  email?: string | null;
  primaryEmailAddressId?: string | null;
  primaryEmailAddress?: ClerkEmailLike | string | null;
  primary_email_address?: ClerkEmailLike | string | null;
  emailAddresses?: ClerkEmailLike[] | { data?: ClerkEmailLike[] };
  email_addresses?: ClerkEmailLike[] | { data?: ClerkEmailLike[] };
  externalAccounts?: ClerkExternalAccountLike[];
  external_accounts?: ClerkExternalAccountLike[];
  username?: string | null;
  publicMetadata?: Record<string, unknown> | null;
  raw?: {
    email_addresses?: ClerkEmailLike[] | { data?: ClerkEmailLike[] };
    email?: string | null;
  } | null;
};

export type RosterLookupStatus =
  | "not_configured"
  | "empty"
  | "matched"
  | "not_on_roster";

export type RosterLookupResult =
  | { status: "not_configured" }
  | { status: "empty" }
  | { status: "matched"; entry: CanvasRosterEntry }
  | { status: "not_on_roster" };
