import { formatEventDescription } from "@/lib/formatters";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { ROUTES } from "@/data/routes";

type EventToBookCardProps = {
  id: string;
  name: string;
  description: string | null;
  durationInMinutes: number;
  clerkUserId: string;
};

export const EventToBookCard = ({
  id,
  name,
  description,
  durationInMinutes,
  clerkUserId,
}: EventToBookCardProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {formatEventDescription(durationInMinutes)}
        </CardDescription>
      </CardHeader>
      {description != null && <CardContent>{description}</CardContent>}
      <CardFooter className="flex justify-end gap-2 mt-auto">
        <Button asChild>
          <Link href={ROUTES.book.eventDetails(clerkUserId, id)}>Select</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
