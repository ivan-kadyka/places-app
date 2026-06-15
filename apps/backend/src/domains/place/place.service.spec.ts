import { Test, TestingModule } from '@nestjs/testing';
import { PlaceService } from './place.service';
import { IWeatherForecastService } from 'src/domains/weather/weather-forecast.service.interface';
import { IActivityScoreService } from 'src/domains/activities/activity-scoring.service.interface';
import { IDBContext } from 'src/database/db-context.interface';
import { IPlaceSearchService } from 'src/domains/place/search/place-search.service.interface';
import { NotFoundException } from '@nestjs/common';
import { IPlace } from './models/place';
import { IPlaceRepository } from 'src/database/repositories/place.repository.interface';
import { IDateRange } from 'src/types/date-range';

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
  let placeRepository: jest.Mocked<IPlaceRepository>;
  let repositorySearchMock: jest.MockedFunction<IPlaceRepository['search']>;
  let repositorySaveMock: jest.MockedFunction<IPlaceRepository['save']>;
  let placeSearchMock: jest.MockedFunction<IPlaceSearchService['search']>;
  let getWeatherByPlaceMock: jest.MockedFunction<IWeatherForecastService['getWeatherByPlace']>;
  let getActivitiesMock: jest.MockedFunction<IActivityScoreService['getActivities']>;

  beforeEach(async () => {
    repositorySearchMock = jest.fn();
    repositorySaveMock = jest.fn();
    placeSearchMock = jest.fn();
    getWeatherByPlaceMock = jest.fn();
    getActivitiesMock = jest.fn();

    placeRepository = {
      findById: jest.fn(),
      search: repositorySearchMock,
      save: repositorySaveMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaceService,
        {
          provide: IWeatherForecastService,
          useValue: { getWeatherByPlace: getWeatherByPlaceMock },
        },
        {
          provide: IActivityScoreService,
          useValue: { getActivities: getActivitiesMock },
        },
        {
          provide: IDBContext,
          useValue: {
            places: placeRepository,
            runInTransaction: jest.fn(),
          },
        },
        {
          provide: IPlaceSearchService,
          useValue: { search: placeSearchMock },
        },
      ],
    }).compile();

    service = module.get<PlaceService>(PlaceService);
  });

  describe('search', () => {
    it('should return places from database when available', async () => {
      const mockPlaces = [mockPlace];
      repositorySearchMock.mockResolvedValue(mockPlaces);

      const result = await service.search({ name: 'Berlin' });

      expect(result).toEqual(mockPlaces);
      expect(repositorySearchMock).toHaveBeenCalledWith({ name: 'Berlin', limit: undefined });
      expect(placeSearchMock).not.toHaveBeenCalled();
    });

    it('should search via placeSearchService and save to database when no results in DB', async () => {
      const mockPlaces = [mockPlace];
      repositorySearchMock.mockResolvedValue([]);
      placeSearchMock.mockResolvedValue(mockPlaces);
      repositorySaveMock.mockResolvedValue(mockPlaces);

      const result = await service.search({ name: 'Berlin', limit: 5 });

      expect(result).toEqual(mockPlaces);
      expect(placeSearchMock).toHaveBeenCalledWith({ name: 'Berlin', limit: 5 });
      expect(repositorySaveMock).toHaveBeenCalledWith(mockPlaces);
    });

    it('should return empty array when no places found anywhere', async () => {
      repositorySearchMock.mockResolvedValue([]);
      placeSearchMock.mockResolvedValue([]);

      const result = await service.search({ name: 'NonExistentPlace' });

      expect(result).toEqual([]);
      expect(repositorySaveMock).not.toHaveBeenCalled();
    });
  });

  describe('getDetails', () => {
    it('should throw NotFoundException when place not found', async () => {
      repositorySearchMock.mockResolvedValue([]);
      placeSearchMock.mockResolvedValue([]);

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

      const dateRange: IDateRange = {
        from: new Date('2026-06-15T00:00:00.000Z'),
        to: new Date('2026-06-16T00:00:00.000Z'),
      };

      repositorySearchMock.mockResolvedValue([mockPlace]);
      getWeatherByPlaceMock.mockResolvedValue(mockForecast);
      getActivitiesMock.mockResolvedValue(mockActivities);

      const result = await service.getDetails({ name: 'Berlin', dateRange });

      expect(result.id).toBe(mockPlace.id);
      expect(result.name).toBe(mockPlace.name);
      expect(result.dateRange).toBe(dateRange);
      expect(result.activities).toEqual(mockActivities);
      expect(getWeatherByPlaceMock).toHaveBeenCalledWith(mockPlace, dateRange);
      expect(getActivitiesMock).toHaveBeenCalledWith(mockPlace, mockForecast);
    });
  });
});
