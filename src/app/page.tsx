import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId != null) redirect("/events");

  return (
    <main className="text-center container my-4 mx-auto">
      <h1 className="text-3xl mb-4">Book time to meet!</h1>
      <p>{`This part of app is just for owner of the web, you can't sign in or sign up :)`}</p>
      <div className="flex gap-2 justify-center">
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
