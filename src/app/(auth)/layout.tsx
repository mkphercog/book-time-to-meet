import type { FC, PropsWithChildren } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/data/routes";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const { userId } = auth();

  if (userId != null) redirect(ROUTES.home());

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
