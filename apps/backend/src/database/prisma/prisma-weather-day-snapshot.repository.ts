import { IWeatherDaySnapshotRepository } from '../repositories/weather-day-snapshot.repository.interface';
import { WeatherDaySnapshotEntity } from '../entities/weather-day-snapshot.entity';
import { PrismaClient, Prisma } from 'prisma/generated/client';
import { IMetaData } from 'src/types/meta-data';
import { PlaceId } from 'src/domains/place/models/place';
import { IDateRange } from 'src/types/date-range';

export class PrismaWeatherDaySnapshotRepository implements IWeatherDaySnapshotRepository {
  constructor(private readonly prisma: PrismaClient) {}

   async search(placeId: PlaceId, dateRange: IDateRange): Promise<WeatherDaySnapshotEntity[]> {

    const dbWeatherDaySnapshots = await this.prisma.weatherDaySnapshot.findMany({
      where: {
        placeId,
        date: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
      },
      orderBy: { date: 'asc' }
    })

    return dbWeatherDaySnapshots.map((result): WeatherDaySnapshotEntity => ({
      id: result.id,
      providerType: result.providerType,
      date: result.date,
      snapshot: result.snapshot as IMetaData,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      placeId: result.placeId,
    }))
  }

  async createMany(data: Array<Omit<WeatherDaySnapshotEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<WeatherDaySnapshotEntity[]> {
    const results = await Promise.all(
      data.map(item =>
        this.prisma.weatherDaySnapshot.create({
          data: {
            providerType: item.providerType,
            date: item.date,
            snapshot: item.snapshot as Prisma.InputJsonValue,
            placeId: item.placeId
          },
        })
      )
    );

    return results.map(result => ({
      id: result.id,
      providerType: result.providerType,
      date: result.date,
      snapshot: result.snapshot as IMetaData,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      placeId: result.placeId,
    }));
  }

  async delete(placeId: string, dateRange: IDateRange): Promise<void> {
    await this.prisma.weatherDaySnapshot.deleteMany({
      where: {
        placeId,
        date: {
          gte: dateRange.from,
          lte: dateRange.to,
        }
      }
    })
  }
}
