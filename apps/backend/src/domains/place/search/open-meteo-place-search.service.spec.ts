import { Test, TestingModule } from '@nestjs/testing';
import { OpenMeteoPlaceSearchService } from './open-meteo-place-search.service';

describe('OpenMeteoPlaceSearchService', () => {
  let service: OpenMeteoPlaceSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenMeteoPlaceSearchService],
    }).compile();

    service = module.get<OpenMeteoPlaceSearchService>(OpenMeteoPlaceSearchService);
  });

  describe('search', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should return empty array when no results are found', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ results: [] }),
        } as Response)
      );

      const result = await service.search({ name: 'NonExistentPlace' });

      expect(result).toEqual([]);
    });

    it('should map API response to IPlace objects', async () => {
      const mockApiResponse = {
        results: [
          {
            id: 1,
            name: 'Berlin',
            latitude: 52.52,
            longitude: 13.41,
            elevation: 34,
            timezone: 'Europe/Berlin',
            country_code: 'DE',
          },
        ],
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockApiResponse),
        } as Response)
      );

      const result = await service.search({ name: 'Berlin' });

      expect(result).toEqual([
        {
          id: '1',
          name: 'Berlin',
          coordinate: { latitude: 52.52, longitude: 13.41 },
          elevation: 34,
          timezone: 'Europe/Berlin',
          countryCode: 'DE',
          openMeteoId: '1',
        },
      ]);
    });

    it('should throw error when API call fails', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        } as Response)
      );

      await expect(service.search({ name: 'Berlin' })).rejects.toThrow('Place search failed with status 500');
    });
  });
});
