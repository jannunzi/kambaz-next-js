const NOTE_UNSET = "DATABASE_CONNECTION_STRING is not set.";
const NOTE_SET =
  "Connection string is set. Express DAOs use Mongoose when mongod/Atlas is reachable.";

/**
 * `mongo` is whether Mongoose is connected.
 * `database` is whether a connection string is configured.
 */
export function lab6Status({ connectionString, connected }) {
  const uri = connectionString || "";
  return {
    mongo: Boolean(connected),
    database: uri ? "configured" : "not configured",
    note: uri ? NOTE_SET : NOTE_UNSET,
  };
}
