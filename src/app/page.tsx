import { Button } from "@/components/ui/button";
import { ROUTES } from "@/data/routes";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CalendarRange } from "lucide-react";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId != null) redirect(ROUTES.events.home());

  return (
    <main className="text-center container mx-auto">
      <div className="flex gap-3 justify-center items-center pt-10 mb-4">
        <CalendarRange className="h-14 w-14" />
        <h1 className="text-3xl">Book time to meet!</h1>
      </div>
      <p>{`This part of app is just for owner of the web, you can't sign in or sign up :)`}</p>
      <div className="flex gap-2 justify-center mt-10">
        <Button asChild>
          <SignInButton />
        </Button>
        <Button asChild>
          <SignUpButton />
        </Button>
        <UserButton />
      </div>
    </main>
  );
}
