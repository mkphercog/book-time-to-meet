import type { FC, PropsWithChildren } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/data/routes";
import { CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const { userId } = auth();

  if (userId != null) redirect(ROUTES.home());

  return (
    <div className="min-h-screen flex flex-col justify-start items-center gap-10">
      <div className="flex gap-3 justify-center items-center pt-10 mb-4">
        <CalendarRange className="h-14 w-14" />
        <h1 className="text-3xl">Book time to meet!</h1>
      </div>
      <div className="flex flex-col justify-center items-center">
        {children}
      </div>
      <Button asChild>
        <Link href={ROUTES.home()}>Back</Link>
      </Button>
    </div>
  );
};

export default AuthLayout;
