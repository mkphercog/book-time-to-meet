import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { ROUTES } from "@/data/routes";

export default async function NotFound() {
  const userData = await db.query.EventTable.findFirst({
    where: ({ isActive }, { eq }) => {
      return eq(isActive, true);
    },
  });

  return (
    <main className="h-screen flex justify-center items-center">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="mb-4">Are you lost?</CardTitle>
          <CardDescription>{`404 - Sorry, but this page doesn't exist. Check out my events by clicking the button below.`}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center mt-3">
          <Button asChild>
            <Link href={ROUTES.book.allUserEvents(userData?.clerkUserId || "")}>
              Go to my events!
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
