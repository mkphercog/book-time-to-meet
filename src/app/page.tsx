import { AppName } from "@/components/AppName";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/data/routes";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId != null) redirect(ROUTES.events.home());

  return (
    <main className="flex flex-col h-screen text-center ">
      <AppName className={"py-4"} />
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
