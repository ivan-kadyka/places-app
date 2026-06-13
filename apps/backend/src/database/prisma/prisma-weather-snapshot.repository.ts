import { IWeatherSnapshotRepository } from '../repositories/weather-snapshot.repository.interface';
import { WeatherSnapshotEntity } from '../entities/weather-snapshot.entity';
import { PrismaClient, Prisma } from 'prisma/generated/client';

export class PrismaWeatherSnapshotRepository implements IWeatherSnapshotRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findLatestActive(locationId: string, now: Date): Promise<WeatherSnapshotEntity | null> {
    const result = await this.prisma.weatherSnapshot.findFirst({
      where: {
        locationId,
        expiresAt: { gt: now },
      },
      orderBy: { fetchedAt: 'desc' },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      locationId: result.locationId,
      fetchedAt: result.fetchedAt,
      expiresAt: result.expiresAt,
      dailyData: result.dailyData,
    };
  }

  async create(data: Omit<WeatherSnapshotEntity, 'id' | 'fetchedAt'> & { fetchedAt?: Date }): Promise<WeatherSnapshotEntity> {
    const result = await this.prisma.weatherSnapshot.create({
      data: {
        locationId: data.locationId,
        fetchedAt: data.fetchedAt,
        expiresAt: data.expiresAt,
        dailyData: data.dailyData as Prisma.InputJsonValue,
      },
    });

    return {
      id: result.id,
      locationId: result.locationId,
      fetchedAt: result.fetchedAt,
      expiresAt: result.expiresAt,
      dailyData: result.dailyData,
    };
  }
}
