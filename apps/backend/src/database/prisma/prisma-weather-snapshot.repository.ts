import { IWeatherSnapshotRepository } from '../repositories/weather-snapshot.repository.interface';
import { WeatherSnapshotEntity } from '../entities/weather-snapshot.entity';
import { PrismaClient, Prisma } from 'prisma/generated/client';
import { IMetaData } from 'src/types/meta-data';

export class PrismaWeatherSnapshotRepository implements IWeatherSnapshotRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findLatestActive(placeId: string, now: Date): Promise<WeatherSnapshotEntity | null> {
    const result = await this.prisma.weatherSnapshot.findFirst({
      where: {
        placeId: placeId,
        expiresAt: { gt: now },
      },
      orderBy: { fetchedAt: 'desc' },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      placeId: result.placeId,
      fetchedAt: result.fetchedAt,
      expiresAt: result.expiresAt,
      dailyData: result.dailyData as IMetaData,
    }
  }

  async create(data: Omit<WeatherSnapshotEntity, 'id' | 'fetchedAt'> & { fetchedAt?: Date }): Promise<WeatherSnapshotEntity> {
    const result = await this.prisma.weatherSnapshot.create({
      data: {
        placeId: data.placeId,
        fetchedAt: data.fetchedAt,
        expiresAt: data.expiresAt,
        dailyData: data.dailyData as Prisma.InputJsonValue,
      },
    });

    return {
      id: result.id,
      placeId: result.placeId,
      fetchedAt: result.fetchedAt,
      expiresAt: result.expiresAt,
      dailyData: result.dailyData as IMetaData,
    };
  }
}
