import type { FC, PropsWithChildren } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/data/routes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AppName } from "@/components/AppName";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const { userId } = auth();

  if (userId != null) redirect(ROUTES.home());

  return (
    <div className="min-h-screen flex flex-col justify-start items-center gap-10">
      <AppName className={"py-4"} />
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
