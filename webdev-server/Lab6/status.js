const NOTE_UNSET = "DATABASE_CONNECTION_STRING is not set.";

/**
 * `mongo` is whether Mongoose is connected.
 * `database` is whether a connection string is configured.
 * `note` is present only when the string is missing.
 */
export function lab6Status({ connectionString, connected }) {
  const uri = connectionString || "";
  const status = {
    mongo: Boolean(connected),
    database: uri ? "configured" : "not configured",
  };
  if (!uri) return { ...status, note: NOTE_UNSET };
  return status;
}
