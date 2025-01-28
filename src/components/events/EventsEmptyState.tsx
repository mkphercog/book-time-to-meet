import { CalendarPlus, CalendarRange } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ROUTES } from "@/data/routes";

export const EventsEmptyState = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <CalendarRange className="size-16 mx-auto" />
      You do not have any events yet. Create your first event to get started!
      <Button size="lg" className="text-lg" asChild>
        <Link href={ROUTES.events.new()}>
          <CalendarPlus className="mr-4 size-6" /> New Event
        </Link>
      </Button>
    </div>
  );
};
