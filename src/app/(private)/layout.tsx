import type { FC, PropsWithChildren } from "react";
import { NavLink } from "@/components/NavLink";
import { UserButton } from "@clerk/nextjs";
import { CalendarRange } from "lucide-react";
import { ROUTES } from "@/data/routes";

const PrivateLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header className="flex py-2 border-b bg-card">
        <nav className="font-medium flex items-center text-sm gap-6 container">
          <div className="flex items-center gap-2 font-semibold mr-auto">
            <CalendarRange className="size-6" />
            <span className="sr-only md:not-sr-only">Book time to meet!</span>
          </div>
          <NavLink href={ROUTES.events.home()}>Events</NavLink>
          <NavLink href={ROUTES.schedule.home()}>Schedule</NavLink>
          <div className="ml-auto size-10">
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: "size-full" } }}
            />
          </div>
        </nav>
      </header>
      <main className="container my-6 mx-auto">{children}</main>
    </>
  );
};

export default PrivateLayout;
