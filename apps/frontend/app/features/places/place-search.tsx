"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  getPlaceDetails,
  searchPlaces,
  type Place,
  type PlaceDetails,
} from "../../lib/graphql";
import styles from "./place-search.module.css";

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
        <div className={styles.activityGrid}>
          {details.activities.map((activity) => (
            <div className={styles.activity} key={activity.type}>
              <div>
                <div className={styles.activityName}>
                  {formatActivityType(activity.type)}
                </div>
                <div className={styles.activityLevel}>
                  {activity.score.level}
                </div>
              </div>
              <div className={styles.score}>{activity.score.percentage}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PlaceSearch() {
  const [searchText, setSearchText] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const debouncedSearchText = useDebouncedValue(searchText.trim(), 300);

  const placesQuery = useQuery({
    queryKey: ["places", debouncedSearchText],
    queryFn: () => searchPlaces(debouncedSearchText),
    enabled: debouncedSearchText.length >= 2,
  });

  const places = placesQuery.data ?? [];
  const selectedValue = selectedPlace?.id ?? "";

  const detailsQuery = useQuery({
    queryKey: ["place-details", selectedPlace?.name],
    queryFn: () => getPlaceDetails(selectedPlace?.name ?? ""),
    enabled: Boolean(selectedPlace?.name),
  });

  const helperText = useMemo(() => {
    if (searchText.trim().length < 2) {
      return "Type at least 2 characters to search.";
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
  }, [places.length, placesQuery.error, placesQuery.isError, placesQuery.isFetching, searchText]);

  useEffect(() => {
    setSelectedPlace(null);
  }, [debouncedSearchText]);

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Place search</p>
          <h1>Find a place and review its activity forecast.</h1>
        </div>

        <Card>
          <CardContent>
            <div className={styles.form}>
              <label className={styles.field}>
                <span>Search</span>
                <Input
                  autoComplete="off"
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Warsaw, Berlin, Tokyo..."
                  value={searchText}
                />
              </label>

              <label className={styles.field}>
                <span>Result</span>
                <Select
                  disabled={places.length === 0 || placesQuery.isFetching}
                  onValueChange={(value) => {
                    setSelectedPlace(
                      places.find((place) => place.id === value) ?? null,
                    );
                  }}
                  value={selectedValue}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a place" />
                  </SelectTrigger>
                  <SelectContent>
                    {places.map((place) => (
                      <SelectItem
                        key={place.id}
                        meta={`${place.countryCode} · ${formatNumber(
                          place.coordinate.latitude,
                        )}, ${formatNumber(place.coordinate.longitude)}`}
                        value={place.id}
                      >
                        {place.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <div className={styles.formFooter}>
                <p className={styles.helper}>{helperText}</p>
                <Button
                  disabled={!selectedPlace || detailsQuery.isFetching}
                  onClick={() => void detailsQuery.refetch()}
                  type="button"
                >
                  Refresh details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {detailsQuery.isFetching ? (
          <Card>
            <CardContent>
              <p className={styles.helper}>Loading place details...</p>
            </CardContent>
          </Card>
        ) : null}

        {detailsQuery.isError ? (
          <Card>
            <CardContent>
              <p className={styles.error}>{detailsQuery.error.message}</p>
            </CardContent>
          </Card>
        ) : null}

        {detailsQuery.data ? <DetailsPanel details={detailsQuery.data} /> : null}
      </section>
    </main>
  );
}
