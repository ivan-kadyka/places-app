"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../infra/ui/card";
import { PlaceDetails } from "../../lib/graphql";
import { formatActivityType, formatDate } from "./utils/format";

export default function PlaceDetailsPanel({
  details,
}: {
  details: PlaceDetails;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{details.name}</CardTitle>
        <CardDescription>
          Forecast window: {formatDate(details.dateRange.from)} to{" "}
          {formatDate(details.dateRange.to)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2.5">
          {details.activities.map((activity) => (
            <div
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-[#fbfefd] p-3.5"
              key={activity.type}
            >
              <div>
                <div className="text-[15px] font-semibold text-foreground">
                  {formatActivityType(activity.type)}
                </div>
                <div className="mt-[3px] text-[13px] text-muted-foreground">
                  {activity.score.level}
                </div>
              </div>
              <div className="whitespace-nowrap text-[22px] font-bold leading-none text-primary">
                {activity.score.percentage}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
