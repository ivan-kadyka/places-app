import { IDateRange } from 'src/types/date-range';
import { WeatherDaySnapshotEntity } from '../entities/weather-day-snapshot.entity';

type CreateWeatherDaySnapshot = Omit<WeatherDaySnapshotEntity, 'id' | 'createdAt' | 'updatedAt'>;

export abstract class IWeatherDaySnapshotRepository {
  abstract search(placeId: string, dateRange: IDateRange): Promise<WeatherDaySnapshotEntity[]>;
  abstract createMany(data: Array<CreateWeatherDaySnapshot>): Promise<WeatherDaySnapshotEntity[]>;
  abstract delete(placeId: string, dateRange: IDateRange): Promise<void>;
}
