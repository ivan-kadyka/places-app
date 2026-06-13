import { IPlaceRepository, ISearchRepositoryParams } from '../repositories/place.repository.interface';
import { PlaceEntity } from '../entities/place.entity';
import { PrismaClient } from 'prisma/generated/client';
import { IPlace } from 'src/weather/weather.types';

export class PrismaPlaceRepository implements IPlaceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<PlaceEntity | null> {
    return this.prisma.place.findUnique({
      where: { id },
    });
  }

  async findByOpenMeteoId(openMeteoId: string): Promise<PlaceEntity | null> {
    return this.prisma.place.findFirst({
      where: { openMeteoId : openMeteoId },
    });
  }

  async search({name}: ISearchRepositoryParams): Promise<PlaceEntity[]> {
    return this.prisma.place.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }

    async saveMany(places: IPlace[]): Promise<PlaceEntity[]> {

    const createdPlaces : PlaceEntity[] = []  
    for (const place of places) {
      const result = await this.prisma.place.create({data: {
        name: place.name,
         timezone: place.timezone,
         latitude: place.coordinate.latitude,
        longitude: place.coordinate.longitude,
        countryCode: place.countryCode.toUpperCase(),
        elevation: place.elevation ?? undefined,
        openMeteoId: place.openMeteoId ?? undefined,
      }});
      
      createdPlaces.push(result);
    }
    return createdPlaces;
    }
  }

