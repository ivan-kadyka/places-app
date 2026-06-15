export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Place = {
  id: string;
  name: string;
  coordinate: Coordinates;
  timezone: string;
  countryCode: string;
  elevation?: number | null;
  openMeteoId?: string | null;
};

export type Activity = {
  type: string;
  score: {
    level: string;
    percentage: number;
  };
};

export type PlaceDetails = {
  id: string;
  name: string;
  dateRange: {
    from: string;
    to: string;
  };
  activities: Activity[];
};

type GraphqlResponse<TData> = {
  data?: TData;
  errors?: Array<{ message: string }>;
};

async function graphqlRequest<TData>(
  query: string,
  variables: Record<string, unknown>,
): Promise<TData> {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed with ${response.status}`);
  }

  const payload = (await response.json()) as GraphqlResponse<TData>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(", "));
  }

  if (!payload.data) {
    throw new Error("GraphQL response did not include data.");
  }

  return payload.data;
}

export async function searchPlaces(name: string, count = 8): Promise<Place[]> {
  const data = await graphqlRequest<{ searchPlaces: Place[] }>(
    `
      query SearchPlaces($name: String!, $count: Int) {
        searchPlaces(name: $name, count: $count) {
          id
          name
          timezone
          countryCode
          elevation
          openMeteoId
          coordinate {
            latitude
            longitude
          }
        }
      }
    `,
    { name, count },
  );

  return data.searchPlaces;
}

export async function getPlaceDetails(name: string): Promise<PlaceDetails> {
  const data = await graphqlRequest<{ getPlaceDetails: PlaceDetails }>(
    `
      query GetPlaceDetails($name: String!) {
        getPlaceDetails(name: $name) {
          id
          name
          dateRange {
            from
            to
          }
          activities {
            type
            score {
              level
              percentage
            }
          }
        }
      }
    `,
    { name },
  );

  return data.getPlaceDetails;
}
