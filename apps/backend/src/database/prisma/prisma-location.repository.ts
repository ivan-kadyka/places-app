import { ILocationRepository } from '../repositories/location.repository.interface';
import { LocationEntity } from '../entities/location.entity';
import { WeatherSnapshotEntity } from '../entities/weather-snapshot.entity';
import { PrismaClient } from 'prisma/generated/client';

export class PrismaLocationRepository implements ILocationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<LocationEntity | null> {
    return this.prisma.location.findUnique({
      where: { id },
    });
  }

  async findByOpenMeteoId(openMeteoId: number): Promise<LocationEntity | null> {
    return this.prisma.location.findUnique({
      where: { openMeteoId },
    });
  }

  async upsert(
    openMeteoId: number,
    createData: Omit<LocationEntity, 'id' | 'createdAt' | 'updatedAt' | 'openMeteoId'>,
    updateData: Partial<Omit<LocationEntity, 'id' | 'createdAt' | 'updatedAt' | 'openMeteoId'>>,
  ): Promise<LocationEntity> {
    return this.prisma.location.upsert({
      where: { openMeteoId },
      create: {
        openMeteoId,
        ...createData,
      },
      update: updateData,
    });
  }

  async findStaleLocations(now: Date): Promise<(LocationEntity & { snapshots: WeatherSnapshotEntity[] })[]> {
    const stale = await this.prisma.location.findMany({
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
        locationId: snap.locationId,
        fetchedAt: snap.fetchedAt,
        expiresAt: snap.expiresAt,
        dailyData: snap.dailyData,
      })),
    }));
  }
}
