"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useId, useMemo, useState } from "react";


import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../infra/ui/card";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../../infra/ui/command";
import { PlaceDetails, Place, searchPlaces, getPlaceDetails } from "../../lib/graphql";

function useDebouncedValue(value: string, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delayMs);

    return () => window.clearTimeout(timeout);
  }, [delayMs, value]);

  return debouncedValue;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatActivityType(value: string) {
  return value
    .replace(/[_-]/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function DetailsPanel({ details }: { details: PlaceDetails }) {
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

export function PlaceSearch() {
  const searchInputId = useId();
  const [searchText, setSearchText] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const debouncedSearchText = useDebouncedValue(searchText.trim(), 300);

  const placesQuery = useQuery({
    queryKey: ["places", debouncedSearchText],
    queryFn: () => searchPlaces(debouncedSearchText),
    enabled: debouncedSearchText.length >= 2,
  });

  const places = placesQuery.data ?? [];

  const detailsQuery = useQuery({
    queryKey: ["place-details", selectedPlace?.name],
    queryFn: () => getPlaceDetails(selectedPlace?.name ?? ""),
    enabled: Boolean(selectedPlace?.name),
  });

  const helperText = useMemo(() => {
    if (searchText.trim().length < 2) {
      return "";
    }

    if (placesQuery.isFetching) {
      return "Searching places...";
    }

    if (placesQuery.isError) {
      return placesQuery.error.message;
    }

    if (places.length === 0) {
      return "No matching places found.";
    }

    return `${places.length} result${places.length === 1 ? "" : "s"} found.`;
  }, [
    places.length,
    placesQuery.error,
    placesQuery.isError,
    placesQuery.isFetching,
    searchText,
  ]);

  useEffect(() => {
    setSelectedPlace(null);
  }, [debouncedSearchText]);

  return (
    <main className="min-h-svh bg-[linear-gradient(180deg,rgba(241,248,247,0.94),rgba(248,250,252,1))] px-3.5 py-8 text-foreground sm:px-5 sm:py-14">
      <section className="mx-auto grid w-full max-w-[840px] gap-[18px]">
        <div className="grid gap-2.5 px-0 pb-3 pt-2">
          <h1 className="max-w-[720px] text-[clamp(32px,5vw,56px)] font-bold leading-[1.04]">
            Find place activities
          </h1>
        </div>

        <Card>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Command>
                  <CommandInput
                    autoComplete="off"
                    id={searchInputId}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search a place..."
                    value={searchText}
                  />
                  <CommandList aria-label="Place results">
                    {places.length === 0 ? (
                      <CommandEmpty>{helperText}</CommandEmpty>
                    ) : null}
                    {places.length > 0 ? (
                      <CommandGroup heading="Results">
                        {places.map((place) => (
                          <CommandItem
                            aria-selected={selectedPlace?.id === place.id}
                            key={place.id}
                            onClick={() => setSelectedPlace(place)}
                          >
                            <span>{place.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {place.countryCode} ·{" "}
                              {formatNumber(place.coordinate.latitude)},{" "}
                              {formatNumber(place.coordinate.longitude)}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : null}
                  </CommandList>
                </Command>
              </div>
            </div>
          </CardContent>
        </Card>

        {detailsQuery.isFetching ? (
          <Card>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Loading place details...
              </p>
            </CardContent>
          </Card>
        ) : null}

        {detailsQuery.isError ? (
          <Card>
            <CardContent>
              <p className="text-sm leading-relaxed text-error">
                {detailsQuery.error.message}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {detailsQuery.data ? (
          <DetailsPanel details={detailsQuery.data} />
        ) : null}
      </section>
    </main>
  );
}
