import { redirect } from "next/navigation";
import { ROUTES } from "@/data/routes";
import { db } from "@/drizzle/db";

const HomeBookPage = async () => {
  const userData = await db.query.ScheduleTable.findFirst({
    where: ({ timezone }, { isNotNull }) => {
      return isNotNull(timezone);
    },
  });

  return redirect(ROUTES.book.allUserEvents(userData?.clerkUserId || ""));
};

export default HomeBookPage;
