import { IPlaceRepository, ISearchRepositoryParams } from '../repositories/place.repository.interface';
import { PrismaClient } from 'prisma/generated/client';
import { IPlace } from "src/domains/place/models/place";
import { placeEntityToIPlace } from 'src/database/entities/utils/placeEntityToIPlace';

export class PrismaPlaceRepository implements IPlaceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<IPlace | null> {
    const dbPlace = await this.prisma.place.findUnique({
      where: { id },
    });

    if (!dbPlace) {
      return null;
    }

    return placeEntityToIPlace(dbPlace);
  }

  async search({name}: ISearchRepositoryParams): Promise<IPlace[]> {
    const dbPlaces = await this.prisma.place.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

   return dbPlaces.map(placeEntityToIPlace);

  }

    async save(places: IPlace[]): Promise<IPlace[]> {

    const createdPlaces : IPlace[] = []  
    for (const place of places) {
      const result = await this.prisma.place.create({data: {
        name: place.name,
         timezone: place.timezone,
         latitude: place.coordinate.latitude,
        longitude: place.coordinate.longitude,
        countryCode: place.countryCode.toUpperCase(),
        elevation: place.elevation ?? undefined
      }});
      
      createdPlaces.push(placeEntityToIPlace(result));
    }
    return createdPlaces;
    }
  }

