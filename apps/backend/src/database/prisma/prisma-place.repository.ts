import { IPlaceRepository, ISearchRepositoryParams } from '../repositories/place.repository.interface';
import { PlaceEntity } from '../entities/place.entity';
import { WeatherSnapshotEntity } from '../entities/weather-snapshot.entity';
import { PrismaClient } from 'prisma/generated/client';

export class PrismaLocationRepository implements IPlaceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<PlaceEntity | null> {
    return this.prisma.place.findUnique({
      where: { id },
    });
  }

  async findByOpenMeteoId(openMeteoId: number): Promise<PlaceEntity | null> {
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

  async upsert(
    openMeteoId: number,
    createData: Omit<PlaceEntity, 'id' | 'createdAt' | 'updatedAt' | 'openMeteoId'>,
    updateData: Partial<Omit<PlaceEntity, 'id' | 'createdAt' | 'updatedAt' | 'openMeteoId'>>,
  ): Promise<PlaceEntity> {

   
    const existRecord = await this.findByOpenMeteoId(openMeteoId);

    if (existRecord) {
       return this.prisma.place.update({
         where: { id : existRecord.id, },
         data: updateData,
    });
    } else {
       return this.prisma.place.create({data: { openMeteoId,
        ...createData}});
    }
  }

  async findStaleLocations(now: Date): Promise<(PlaceEntity & { snapshots: WeatherSnapshotEntity[] })[]> {
    const stale = await this.prisma.place.findMany({
      where: {
        snapshots: {
          none: {
            expiresAt: { gt: now },
          },
        },
      },
      include: {
        snapshots: {
          orderBy: { fetchedAt: 'desc' },
          take: 1,
        },
      },
    });

    return stale.map((loc) => ({
      ...loc,
      snapshots: loc.snapshots.map((snap) => ({
        id: snap.id,
        placeId: snap.placeId,
        fetchedAt: snap.fetchedAt,
        expiresAt: snap.expiresAt,
        dailyData: snap.dailyData,
      })),
    }));
  }
}
