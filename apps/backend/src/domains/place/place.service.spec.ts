import { Test, TestingModule } from '@nestjs/testing';
import { PlaceService } from './place.service';
import { IWeatherForecastService } from 'src/domains/weather/weather-forecast.service.interface';
import { IActivityScoreService } from 'src/domains/activities/activity-scoring.service.interface';
import { IDBContext } from 'src/database/db-context.interface';
import { IPlaceSearchService } from 'src/domains/place/search/place-search.service.interface';
import { NotFoundException } from '@nestjs/common';
import { IPlace } from './models/place';

const mockPlace: IPlace = {
  id: '1',
  name: 'Berlin',
  coordinate: { latitude: 52.52, longitude: 13.41 },
  timezone: 'Europe/Berlin',
  countryCode: 'DE',
  elevation: 34,
};

describe('PlaceService', () => {
  let service: PlaceService;
  let weatherService: jest.Mocked<IWeatherForecastService>;
  let activityScoringService: jest.Mocked<IActivityScoreService>;
  let dbContext: jest.Mocked<IDBContext>;
  let placeSearchService: jest.Mocked<IPlaceSearchService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaceService,
        {
          provide: IWeatherForecastService,
          useValue: { getWeatherByPlace: jest.fn() },
        },
        {
          provide: IActivityScoreService,
          useValue: { getActivities: jest.fn() },
        },
        {
          provide: IDBContext,
          useValue: {
            places: { search: jest.fn(), save: jest.fn() },
          },
        },
        {
          provide: IPlaceSearchService,
          useValue: { search: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<PlaceService>(PlaceService);
    weatherService = module.get(IWeatherForecastService);
    activityScoringService = module.get(IActivityScoreService);
    dbContext = module.get(IDBContext);
    placeSearchService = module.get(IPlaceSearchService);
  });

  describe('search', () => {
    it('should return places from database when available', async () => {
      const mockPlaces = [mockPlace];
      dbContext.places.search.mockResolvedValue(mockPlaces);

      const result = await service.search({ name: 'Berlin' });

      expect(result).toEqual(mockPlaces);
      expect(dbContext.places.search).toHaveBeenCalledWith({ name: 'Berlin', limit: undefined });
      expect(placeSearchService.search).not.toHaveBeenCalled();
    });

    it('should search via placeSearchService and save to database when no results in DB', async () => {
      const mockPlaces = [mockPlace];
      dbContext.places.search.mockResolvedValue([]);
      placeSearchService.search.mockResolvedValue(mockPlaces);
      dbContext.places.save.mockResolvedValue(mockPlaces);

      const result = await service.search({ name: 'Berlin', limit: 5 });

      expect(result).toEqual(mockPlaces);
      expect(placeSearchService.search).toHaveBeenCalledWith({ name: 'Berlin', limit: 5 });
      expect(dbContext.places.save).toHaveBeenCalledWith(mockPlaces);
    });

    it('should return empty array when no places found anywhere', async () => {
      dbContext.places.search.mockResolvedValue([]);
      placeSearchService.search.mockResolvedValue([]);

      const result = await service.search({ name: 'NonExistentPlace' });

      expect(result).toEqual([]);
    });
  });

  describe('getDetails', () => {
    it('should throw NotFoundException when place not found', async () => {
      dbContext.places.search.mockResolvedValue([]);
      placeSearchService.search.mockResolvedValue([]);

      await expect(service.getDetails({ name: 'NonExistentPlace' })).rejects.toThrow(NotFoundException);
    });

    it('should return place details when place is found', async () => {
      const mockForecast = {
        placeId: '1',
        fetchedAt: new Date(),
        expiresAt: new Date(),
        days: [],
      };
      const mockActivities = [];

      dbContext.places.search.mockResolvedValue([mockPlace]);
      weatherService.getWeatherByPlace.mockResolvedValue(mockForecast);
      activityScoringService.getActivities.mockResolvedValue(mockActivities);

      const result = await service.getDetails({ name: 'Berlin' });

      expect(result.id).toBe(mockPlace.id);
      expect(result.name).toBe(mockPlace.name);
      expect(result.activities).toEqual(mockActivities);
    });
  });
});
