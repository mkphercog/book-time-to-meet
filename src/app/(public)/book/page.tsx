import { redirect } from "next/navigation";
import { ROUTES } from "@/data/routes";
import { db } from "@/drizzle/db";

const HomeBookPage = async () => {
  const userData = await db.query.EventTable.findFirst({
    where: ({ isActive }, { eq }) => {
      return eq(isActive, true);
    },
  });

  return redirect(ROUTES.book.allUserEvents(userData?.clerkUserId || ""));
};

export default HomeBookPage;
