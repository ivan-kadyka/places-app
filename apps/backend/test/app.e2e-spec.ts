import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { IPlaceService } from '../src/domains/place/place.service.interface';
import { IPlace } from '../src/domains/place/models/place';
import { IPlaceDetails } from '../src/domains/place/models/place-details';
import { ActivityType } from '../src/domains/activities/models/activity-type';
import { RecommendationLevel } from '../src/domains/activities/models/recommendation-level';
import { IDBContext } from '../src/database/db-context.interface';

type GraphQLResponse<TData> = {
  data: TData;
  errors?: unknown[];
};

const berlinPlace: IPlace = {
  id: 'berlin-1',
  name: 'Berlin',
  coordinate: { latitude: 52.52, longitude: 13.41 },
  timezone: 'Europe/Berlin',
  countryCode: 'DE',
  elevation: 34,
};

const berlinDetails: IPlaceDetails = {
  id: berlinPlace.id,
  name: berlinPlace.name,
  dateRange: {
    from: new Date('2026-06-15T00:00:00.000Z'),
    to: new Date('2026-06-16T00:00:00.000Z'),
  },
  activities: [
    {
      type: ActivityType.OUTDOOR_SIGHTSEEING,
      score: {
        percentage: 76,
        level: RecommendationLevel.Good,
      },
    },
  ],
};

describe('App e2e', () => {
  let app: INestApplication;
  let httpServer: App;
  let searchPlacesMock: jest.MockedFunction<IPlaceService['search']>;
  let getDetailsMock: jest.MockedFunction<IPlaceService['getDetails']>;

  beforeEach(async () => {
    searchPlacesMock = jest.fn().mockResolvedValue([berlinPlace]);
    getDetailsMock = jest.fn().mockResolvedValue(berlinDetails);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IPlaceService)
      .useValue({
        search: searchPlacesMock,
        getDetails: getDetailsMock,
      })
      .overrideProvider(IDBContext)
      .useValue({
        places: {
          findById: jest.fn(),
          search: jest.fn(),
          save: jest.fn(),
        },
        weatherDaySnapshots: {
          search: jest.fn(),
          createMany: jest.fn(),
          delete: jest.fn(),
        },
        runInTransaction: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    await app.init();
    httpServer = app.getHttpServer() as App;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/place/search (GET) should search places through the REST API', async () => {
    const response = await request(httpServer).get('/place/search').query({ name: 'Berlin', count: 2 }).expect(200);

    expect(response.body).toEqual([berlinPlace]);
    expect(searchPlacesMock).toHaveBeenCalledWith({ name: 'Berlin', limit: 2 });
  });

  it('/place/details (GET) should return place details through the REST API', async () => {
    const response = await request(httpServer).get('/place/details').query({ place: 'Berlin' }).expect(200);

    expect(response.body).toEqual({
      ...berlinDetails,
      dateRange: {
        from: '2026-06-15T00:00:00.000Z',
        to: '2026-06-16T00:00:00.000Z',
      },
    });
    expect(getDetailsMock).toHaveBeenCalledWith({ name: 'Berlin' });
  });

  it('/graphql should search places', async () => {
    const response = await request(httpServer)
      .post('/graphql')
      .send({
        query: `
          query SearchPlaces($name: String!, $count: Int) {
            searchPlaces(name: $name, count: $count) {
              id
              name
              timezone
              countryCode
              elevation
              coordinate {
                latitude
                longitude
              }
            }
          }
        `,
        variables: { name: 'Berlin', count: 1 },
      })
      .expect(200);

    const body = response.body as GraphQLResponse<{ searchPlaces: IPlace[] }>;

    expect(body.errors).toBeUndefined();
    expect(body.data.searchPlaces).toEqual([berlinPlace]);
    expect(searchPlacesMock).toHaveBeenCalledWith({ name: 'Berlin', limit: 1 });
  });

  it('/graphql should return place details', async () => {
    const response = await request(httpServer)
      .post('/graphql')
      .send({
        query: `
          query PlaceDetails($name: String!) {
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
                  percentage
                  level
                }
              }
            }
          }
        `,
        variables: { name: 'Berlin' },
      })
      .expect(200);

    const body = response.body as GraphQLResponse<{ getPlaceDetails: IPlaceDetails }>;

    expect(body.errors).toBeUndefined();
    expect(body.data.getPlaceDetails).toEqual({
      ...berlinDetails,
      dateRange: {
        from: '2026-06-15T00:00:00.000Z',
        to: '2026-06-16T00:00:00.000Z',
      },
      activities: [
        {
          type: ActivityType.OUTDOOR_SIGHTSEEING,
          score: {
            percentage: 76,
            level: 'Good',
          },
        },
      ],
    });
    expect(getDetailsMock).toHaveBeenCalledWith({ name: 'Berlin' });
  });

  it('/graphql should return backend exception details when place details are not found', async () => {
    getDetailsMock.mockRejectedValueOnce(new NotFoundException('Place Atlantis not found'));

    const response = await request(httpServer)
      .post('/graphql')
      .send({
        query: `
          query PlaceDetails($name: String!) {
            getPlaceDetails(name: $name) {
              id
              name
            }
          }
        `,
        variables: { name: 'Atlantis' },
      })
      .expect(200);

    const body = response.body as GraphQLResponse<{ getPlaceDetails: null }>;

    expect(body.data).toBeNull();
    expect(body.errors).toHaveLength(1);
    expect(body.errors?.[0]).toMatchObject({
      message: 'Place Atlantis not found',
      extensions: {
        code: 'NOT_FOUND',
        statusCode: 404,
        response: {
          message: 'Place Atlantis not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    });
    expect(body.errors?.[0]).not.toMatchObject({
      extensions: {
        stacktrace: expect.any(Array),
      },
    });
    expect(getDetailsMock).toHaveBeenCalledWith({ name: 'Atlantis' });
  });
});
