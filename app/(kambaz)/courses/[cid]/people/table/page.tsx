"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import * as db from "../../../../database";
import * as client from "../../../client";
import PeopleTable from "../Table";

export default function PeopleTablePage() {
  const params = useParams<{ cid: string }>();
  const cid = params.cid ?? "RS101";
  const [users, setUsers] = useState(db.users.filter((usr) =>
    db.enrollments.some(
      (enrollment) => enrollment.user === usr._id && enrollment.course === cid,
    ),
  ));

  const fetchUsers = async () => {
    try {
      const remote = await client.findUsersForCourse(cid);
      if (Array.isArray(remote) && remote.length > 0) {
        setUsers(remote);
        return;
      }
    } catch {
      /* Express / Mongo optional — keep local JSON */
    }
    setUsers(
      db.users.filter((usr) =>
        db.enrollments.some(
          (enrollment) =>
            enrollment.user === usr._id && enrollment.course === cid,
        ),
      ),
    );
  };

  useEffect(() => {
    void fetchUsers();
  }, [cid]);

  return <PeopleTable users={users} fetchUsers={() => void fetchUsers()} />;
}
