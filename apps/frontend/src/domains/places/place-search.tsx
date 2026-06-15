"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useId, useMemo, useState } from "react";
import { Card, CardContent } from "../../infra/ui/card";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../../infra/ui/command";
import { Place, searchPlaces, getPlaceDetails } from "../../lib/graphql";
import PlaceDetailsPanel from "./place-details-panel";
import { useDebouncedValue } from "../../infra/hooks/useDebouncedValue";
import { formatNumber } from "./utils/format";

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
    <div className="min-h-svh px-3.5 py-8 text-foreground sm:px-5 sm:py-14">
      <section className="mx-auto grid w-full max-w-210 gap-4.5">
        <div className="grid gap-2.5 px-0 pb-3 pt-2">
          <h1 className="font-bold text-3xl text-center">
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
          <PlaceDetailsPanel details={detailsQuery.data} />
        ) : null}
      </section>
    </div>
  );
}
