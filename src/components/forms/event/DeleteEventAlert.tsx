import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/server/actions/events";
import { FC, TransitionStartFunction } from "react";

type DeleteEventAlertProps = {
  isDeletePending: boolean;
  isSubmitting: boolean;
  startDeleteTransition: TransitionStartFunction;
  eventId: string;
  setError: (type: "saving" | "deleting") => void;
};

export const DeleteEventAlert: FC<DeleteEventAlertProps> = ({
  isDeletePending,
  isSubmitting,
  startDeleteTransition,
  eventId,
  setError,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructiveGhost"
          disabled={isDeletePending || isSubmitting}
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            event.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              disabled={isDeletePending || isSubmitting}
              onClick={() => {
                startDeleteTransition(async () => {
                  const data = await deleteEvent(eventId);

                  if (data?.error) {
                    setError("deleting");
                  }
                });
              }}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
