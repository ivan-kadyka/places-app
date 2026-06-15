import { Test, TestingModule } from '@nestjs/testing';
import { WeatherForecastService } from './weather-forecast.service';
import { IDBContext } from 'src/database/db-context.interface';
import { OpenMeteoService } from './open-meteo/open-meteo.service';
import { ConfigService } from '@nestjs/config';
import { IPlace } from '../place/models/place';
import { WeatherDaySnapshotEntity } from 'src/database/entities/weather-day-snapshot.entity';

const mockPlace: IPlace = {
  id: '1',
  name: 'Berlin',
  coordinate: { latitude: 52.52, longitude: 13.41 },
  timezone: 'Europe/Berlin',
  countryCode: 'DE',
};

const now = new Date();
const snapshotDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const mockSnapshot: WeatherDaySnapshotEntity = {
  id: '1',
  providerType: 'open-meteo',
  date: snapshotDate,
  snapshot: {
    temperatureMax: 20,
    temperatureMin: 10,
    precipitationSum: 0,
    rainSum: 0,
    snowfallSum: 0,
    windSpeedMax: 5,
    windGustsMax: 10,
    sunshineDuration: 3600,
    weatherCode: 0,
    precipitationProbabilityMax: 0,
  },
  createdAt: now,
  updatedAt: now,
  placeId: '1',
};

describe('WeatherForecastService', () => {
  let service: WeatherForecastService;
  let dbContext: jest.Mocked<IDBContext>;
  let openMeteoService: jest.Mocked<OpenMeteoService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherForecastService,
        {
          provide: IDBContext,
          useValue: {
            weatherDaySnapshots: { search: jest.fn(), delete: jest.fn(), createMany: jest.fn() },
          },
        },
        {
          provide: OpenMeteoService,
          useValue: { fetchForecast: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn(() => '6') },
        },
      ],
    }).compile();

    service = module.get<WeatherForecastService>(WeatherForecastService);
    dbContext = module.get(IDBContext);
    openMeteoService = module.get(OpenMeteoService);
    configService = module.get(ConfigService);
  });

  describe('getWeatherByPlace', () => {
    it('should return cached weather when valid snapshots exist', async () => {
      const dateRange = { 
        from: snapshotDate, 
        to: new Date(snapshotDate.getTime() + 24 * 60 * 60 * 1000) 
      };
      dbContext.weatherDaySnapshots.search.mockResolvedValue([mockSnapshot]);

      const result = await service.getWeatherByPlace(mockPlace, dateRange);

      expect(result.placeId).toBe(mockPlace.id);
      expect(result.days).toHaveLength(1);
    });

    it('should refresh weather when no valid cached snapshots exist', async () => {
      const dateRange = { 
        from: snapshotDate, 
        to: new Date(snapshotDate.getTime() + 24 * 60 * 60 * 1000) 
      };
      dbContext.weatherDaySnapshots.search.mockResolvedValue([]);
      openMeteoService.fetchForecast.mockResolvedValue({
        latitude: 52.52,
        longitude: 13.41,
        elevation: 34,
        timezone: 'Europe/Berlin',
        daily: {
          time: [snapshotDate.toISOString().split('T')[0]],
          temperature_2m_max: [20],
          temperature_2m_min: [10],
          precipitation_sum: [0],
          rain_sum: [0],
          snowfall_sum: [0],
          weather_code: [0],
          wind_speed_10m_max: [5],
          wind_gusts_10m_max: [10],
          sunshine_duration: [3600],
          precipitation_probability_max: [0],
        },
      });

      const result = await service.getWeatherByPlace(mockPlace, dateRange);

      expect(result.placeId).toBe(mockPlace.id);
      expect(openMeteoService.fetchForecast).toHaveBeenCalled();
    });
  });
});
