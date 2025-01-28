import { cn } from "@/lib/utils";
import { CalendarRange } from "lucide-react";

export const AppName = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex gap-3 justify-center items-center pt-1 mb-4",
        className
      )}
    >
      <CalendarRange className="h-12 md:h-14 w-12 md:w-14" />
      <h1 className="text-2xl md:text-3xl">Book time to meet!</h1>
    </div>
  );
};
