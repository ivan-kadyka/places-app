import { Test, TestingModule } from '@nestjs/testing';
import { ActivityScoringService } from './activity-scoring.service';
import { IActivityScoreService } from './activity-scoring.service.interface';
import { ActivityType, ACTIVITIES } from './models/activity-type';
import { RecommendationLevel } from './models/recommendation-level';
import { IPlace } from 'src/domains/place/models/place';
import { IWeatherForecast } from 'src/domains/weather/models/weather-forecast';
import { IDayWeatherSnapshot } from 'src/domains/weather/models/weather-snapshot';

const mountainPlace: IPlace = {
  id: 'mountain-place',
  name: 'Zakopane',
  coordinate: { latitude: 49.2992, longitude: 19.9496 },
  timezone: 'Europe/Warsaw',
  countryCode: 'PL',
  elevation: 900,
};

const coastalPlace: IPlace = {
  id: 'coastal-place',
  name: 'Peniche',
  coordinate: { latitude: 39.3558, longitude: -9.3811 },
  timezone: 'Europe/Lisbon',
  countryCode: 'PT',
  elevation: 20,
};

function createForecast(days: IDayWeatherSnapshot[]): IWeatherForecast {
  return {
    placeId: mountainPlace.id,
    fetchedAt: new Date('2026-06-15T08:00:00.000Z'),
    expiresAt: new Date('2026-06-15T14:00:00.000Z'),
    days,
  };
}

function createDay(overrides: Partial<IDayWeatherSnapshot> = {}): IDayWeatherSnapshot {
  return {
    date: new Date('2026-06-15T00:00:00.000Z'),
    temperatureMax: 1,
    temperatureMin: -1,
    precipitationSum: 0,
    rainSum: 0,
    snowfallSum: 12,
    windSpeedMax: 10,
    windGustsMax: 15,
    sunshineDuration: 6 * 60 * 60,
    weatherCode: 0,
    precipitationProbabilityMax: 0,
    ...overrides,
  };
}

describe('ActivityScoringService', () => {
  let service: IActivityScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IActivityScoreService,
          useClass: ActivityScoringService,
        },
      ],
    }).compile();

    service = module.get<IActivityScoreService>(IActivityScoreService);
  });

  it('should return a score for every supported activity in the configured order', async () => {
    const activities = await service.getActivities(mountainPlace, createForecast([createDay()]));

    expect(activities.map((activity) => activity.type)).toEqual(ACTIVITIES);
    expect(activities).toHaveLength(4);
  });

  it('should recommend skiing in snowy mountain weather and reject surfing at altitude', async () => {
    const activities = await service.getActivities(mountainPlace, createForecast([createDay()]));

    expect(activities).toEqual(
      expect.arrayContaining([
        {
          type: ActivityType.SKIING,
          score: {
            percentage: 70,
            level: RecommendationLevel.Good,
          },
        },
        {
          type: ActivityType.SURFING,
          score: {
            percentage: 0,
            level: RecommendationLevel.Unsuitable,
          },
        },
      ]),
    );
  });

  it('should favor surfing for warm windy low-elevation weather', async () => {
    const forecast = createForecast([
      createDay({
        temperatureMax: 24,
        temperatureMin: 16,
        precipitationSum: 0,
        rainSum: 0,
        snowfallSum: 0,
        windSpeedMax: 20,
      }),
    ]);

    const activities = await service.getActivities(coastalPlace, forecast);

    expect(activities).toEqual(
      expect.arrayContaining([
        {
          type: ActivityType.SKIING,
          score: {
            percentage: 0,
            level: RecommendationLevel.Unsuitable,
          },
        },
        {
          type: ActivityType.SURFING,
          score: {
            percentage: 85,
            level: RecommendationLevel.Ideal,
          },
        },
      ]),
    );
  });

  it('should aggregate multiple forecast days before scoring activities', async () => {
    const forecast = createForecast([
      createDay({
        temperatureMax: 18,
        temperatureMin: 12,
        precipitationSum: 0,
        rainSum: 0,
        snowfallSum: 0,
        windSpeedMax: 15,
        sunshineDuration: 4 * 60 * 60,
      }),
      createDay({
        date: new Date('2026-06-16T00:00:00.000Z'),
        temperatureMax: 26,
        temperatureMin: 20,
        precipitationSum: 2,
        rainSum: 2,
        snowfallSum: 0,
        windSpeedMax: 25,
        sunshineDuration: 8 * 60 * 60,
      }),
    ]);

    const activities = await service.getActivities(coastalPlace, forecast);

    expect(activities.find((activity) => activity.type === ActivityType.OUTDOOR_SIGHTSEEING)).toEqual({
      type: ActivityType.OUTDOOR_SIGHTSEEING,
      score: {
        percentage: 100,
        level: RecommendationLevel.Ideal,
      },
    });
  });

  it('should prefer indoor sightseeing during stormy extreme weather', async () => {
    const forecast = createForecast([
      createDay({
        temperatureMax: 42,
        temperatureMin: 38,
        precipitationSum: 30,
        rainSum: 30,
        snowfallSum: 0,
        windSpeedMax: 70,
        sunshineDuration: 0,
        weatherCode: 95,
      }),
    ]);

    const activities = await service.getActivities(mountainPlace, forecast);

    expect(activities).toEqual(
      expect.arrayContaining([
        {
          type: ActivityType.OUTDOOR_SIGHTSEEING,
          score: {
            percentage: 0,
            level: RecommendationLevel.Unsuitable,
          },
        },
        {
          type: ActivityType.INDOOR_SIGHTSEEING,
          score: {
            percentage: 100,
            level: RecommendationLevel.Ideal,
          },
        },
      ]),
    );
  });
});
