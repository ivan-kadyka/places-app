import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesRankingService } from './activities-ranking.service';
import { IWeatherService } from '../weather/weather.service.interface';
import { IActivityScoreService } from './weather-scoring.service.interface';
import { WeatherScoringService } from './weather-scoring.service';
import {
  ActivityType,
  DailyWeatherPoint,
  RecommendationLevel,
} from '../weather/weather.types';

describe('WeatherScoringService', () => {
  let scoringService: WeatherScoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherScoringService],
    }).compile();

    scoringService = module.get<WeatherScoringService>(WeatherScoringService);
  });

  it('should score activities and map to RecommendationLevel', () => {
    const dummyWeather: DailyWeatherPoint = {
      date: '2026-06-15',
      temperatureMax: 22,
      temperatureMin: 14,
      precipitationSum: 0,
      rainSum: 0,
      snowfallSum: 0,
      weatherCode: 0,
      windSpeedMax: 10,
      windGustsMax: 15,
      sunshineDuration: 8 * 3600,
      precipitationProbabilityMax: 0,
    };

    const location = {
      latitude: 40.7128,
      longitude: -74.006,
      timezone: 'America/New_York',
    };
    const scores = scoringService.scoreActivities(location, dummyWeather);

    expect(scores).toHaveLength(4);

    const outdoor = scores.find(
      (s) => s.type === ActivityType.OUTDOOR_SIGHTSEEING,
    );
    expect(outdoor).toBeDefined();
    expect(outdoor!.score.percentage).toBeGreaterThan(50);
    expect(outdoor!.score.type).toBeGreaterThanOrEqual(
      RecommendationLevel.Average,
    );
  });
});

describe('ActivitiesRankingService', () => {
  let rankingService: ActivitiesRankingService;
  let mockWeatherService: jest.Mocked<IWeatherService>;
  let mockScoringService: jest.Mocked<IActivityScoreService>;

  beforeEach(async () => {
    mockWeatherService = {
      getWeatherByPlace: jest.fn(),
    };

    mockScoringService = {
      scoreActivities: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesRankingService,
        {
          provide: IWeatherService,
          useValue: mockWeatherService,
        },
        {
          provide: IActivityScoreService,
          useValue: mockScoringService,
        },
      ],
    }).compile();

    rankingService = module.get<ActivitiesRankingService>(
      ActivitiesRankingService,
    );
  });

  it('should get rankings for city, score and rank them', async () => {
    const mockLocation = {
      id: 'loc-1',
      name: 'Paris',
      country: 'France',
      countryCode: 'FR',
      admin1: 'IDF',
      latitude: 48.8566,
      longitude: 2.3522,
      timezone: 'Europe/Paris',
    };

    const mockDaily: DailyWeatherPoint[] = [
      {
        date: '2026-06-15',
        temperatureMax: 20,
        temperatureMin: 10,
        precipitationSum: 0,
        rainSum: 0,
        snowfallSum: 0,
        weatherCode: 0,
        windSpeedMax: 10,
        windGustsMax: 15,
        sunshineDuration: 8 * 3600,
        precipitationProbabilityMax: 0,
      },
      {
        date: '2026-06-16',
        temperatureMax: 15,
        temperatureMin: 8,
        precipitationSum: 5,
        rainSum: 5,
        snowfallSum: 0,
        weatherCode: 61,
        windSpeedMax: 15,
        windGustsMax: 20,
        sunshineDuration: 2 * 3600,
        precipitationProbabilityMax: 60,
      },
    ];

    mockWeatherService.getWeatherByPlace.mockResolvedValue({
      location: mockLocation,
      fetchedAt: new Date('2026-06-13T12:00:00Z'),
      expiresAt: new Date('2026-06-13T18:00:00Z'),
      cacheHit: false,
      daily: mockDaily,
    });

    mockScoringService.scoreActivities.mockImplementation((location, day) => {
      if (day.date === '2026-06-15') {
        return [
          {
            type: ActivityType.OUTDOOR_SIGHTSEEING,
            score: { type: RecommendationLevel.Ideal, percentage: 90 },
          },
          {
            type: ActivityType.SKIING,
            score: { type: RecommendationLevel.Unsuitable, percentage: 10 },
          },
          {
            type: ActivityType.SURFING,
            score: { type: RecommendationLevel.Poor, percentage: 30 },
          },
          {
            type: ActivityType.INDOOR_SIGHTSEEING,
            score: { type: RecommendationLevel.Average, percentage: 50 },
          },
        ];
      } else {
        return [
          {
            type: ActivityType.OUTDOOR_SIGHTSEEING,
            score: { type: RecommendationLevel.Poor, percentage: 30 },
          },
          {
            type: ActivityType.SKIING,
            score: { type: RecommendationLevel.Unsuitable, percentage: 5 },
          },
          {
            type: ActivityType.SURFING,
            score: { type: RecommendationLevel.Unsuitable, percentage: 15 },
          },
          {
            type: ActivityType.INDOOR_SIGHTSEEING,
            score: { type: RecommendationLevel.Good, percentage: 70 },
          },
        ];
      }
    });

    const response = await rankingService.getRankingsForCity('Paris');

    expect(response.location.name).toBe('Paris');
    expect(response.rankings).toHaveLength(4);

    const outdoorRanking = response.rankings.find(
      (r) => r.type === ActivityType.OUTDOOR_SIGHTSEEING,
    );
    expect(outdoorRanking).toBeDefined();

    const day1 = outdoorRanking!.days.find((d) => d.date === '2026-06-15');
    const day2 = outdoorRanking!.days.find((d) => d.date === '2026-06-16');

    expect(day1!.rank).toBe(1);
    expect(day1!.score).toBe(90);
    expect(day1!.recommendationLevel).toBe(RecommendationLevel.Ideal);

    expect(day2!.rank).toBe(2);
    expect(day2!.score).toBe(30);
    expect(day2!.recommendationLevel).toBe(RecommendationLevel.Poor);
  });
});
