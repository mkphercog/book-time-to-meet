import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

type BookEventEmptyStateProps = {};

export const BookEventEmptyState = ({}: BookEventEmptyStateProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>No events to book</CardTitle>
        <CardDescription>
          {`For now, I don’t have any events available to book in my calendar. Please check this page again later.`}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
