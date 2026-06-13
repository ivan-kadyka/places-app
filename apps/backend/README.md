# Weather Rankings API

NestJS backend that ranks the next 7 days for outdoor activities based on [Open-Meteo](https://open-meteo.com/) forecasts. Weather data is persisted in PostgreSQL and refreshed on a TTL schedule instead of calling the API on every request.

## Activities

| Activity | Scoring highlights |
| --- | --- |
| **Skiing** | Cold temps, snowfall, snow weather codes |
| **Surfing** | Moderate wind (proxy for swell), mild temps, dry conditions |
| **Outdoor sightseeing** | Clear skies, mild temps, low precipitation, sunshine |
| **Indoor sightseeing** | Rain, storms, extreme temps (inverse of ideal outdoor days) |

Each activity returns all 7 forecast days sorted by date, with a **rank** (1 = best day) and **score** (0–100).

## Setup

```bash
# From apps/backend
cp .env.example .env
docker compose up -d
pnpm db:generate
pnpm db:migrate
pnpm dev
```

The API listens on `http://localhost:8000`.

## API

### `GET /rankings?city={name}&country={code}`

Returns activity rankings for the next 7 days.

**Query parameters**

| Param | Required | Description |
| --- | --- | --- |
| `city` | yes | City or town name (min 2 chars) |
| `country` | no | ISO 3166-1 alpha-2 country code to disambiguate (e.g. `US`, `FR`) |

**Example**

```bash
curl "http://localhost:8000/rankings?city=Chamonix&country=FR"
curl "http://localhost:8000/rankings?city=Biarritz&country=FR"
curl "http://localhost:8000/rankings?city=Paris&country=FR"
```

**Sample response**

```json
{
  "location": {
    "name": "Paris",
    "country": "France",
    "countryCode": "FR",
    "latitude": 48.85341,
    "longitude": 2.3488,
    "timezone": "Europe/Paris"
  },
  "forecastFetchedAt": "2026-06-13T10:00:00.000Z",
  "forecastExpiresAt": "2026-06-13T16:00:00.000Z",
  "cacheHit": false,
  "rankings": [
    {
      "activity": "skiing",
      "days": [
        { "date": "2026-06-13", "rank": 3, "score": 12.5, "weatherCode": 3, "temperatureMax": 22, "temperatureMin": 14, "precipitationSum": 0 }
      ]
    }
  ]
}
```

## Data model & caching

```
Location ──< WeatherSnapshot
```

- **Location** — geocoded city/town from Open-Meteo Geocoding API (upserted on first request).
- **WeatherSnapshot** — 7-day daily forecast JSON with `fetchedAt` and `expiresAt`.

**Refresh strategy**

1. **On read** — if a valid (non-expired) snapshot exists, serve from DB (`cacheHit: true`). Otherwise fetch from Open-Meteo and store a new snapshot.
2. **Background cron** — every 6 hours, refresh locations whose cache has expired.

Configure TTL via `WEATHER_CACHE_TTL_HOURS` (default: 6).

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start in watch mode |
| `pnpm build` | Compile |
| `pnpm test` | Unit tests |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run migrations |
