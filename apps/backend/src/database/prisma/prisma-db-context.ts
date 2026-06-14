import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { IDBContext } from '../db-context.interface';
import { IPlaceRepository } from '../repositories/place.repository.interface';
import { IWeatherDaySnapshotRepository } from '../repositories/weather-day-snapshot.repository.interface';
import { PrismaPlaceRepository } from './prisma-place.repository';
import { PrismaWeatherDaySnapshotRepository } from './prisma-weather-day-snapshot.repository';
import { PrismaClient } from 'prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaDBContext extends IDBContext implements OnModuleInit, OnModuleDestroy {
  private readonly prisma: PrismaClient;
  private readonly pool: Pool;

  readonly places: IPlaceRepository;
  readonly weatherDaySnapshots: IWeatherDaySnapshotRepository;

  constructor() {
    super();
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(this.pool);
    this.prisma = new PrismaClient({ adapter });
    this.places = new PrismaPlaceRepository(this.prisma);
    this.weatherDaySnapshots = new PrismaWeatherDaySnapshotRepository(this.prisma);
  }

  async onModuleInit(): Promise<void> {
    await this.prisma.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.prisma.$disconnect();
    await this.pool.end();
  }

  async runInTransaction<T>(work: (context: IDBContext) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (txClient) => {
      const txContext = new PrismaTransactionDBContext(txClient as PrismaClient);
      return work(txContext);
    });
  }
}

class PrismaTransactionDBContext extends IDBContext {
  readonly places: IPlaceRepository;
  readonly weatherDaySnapshots: IWeatherDaySnapshotRepository;

  constructor(prisma: PrismaClient) {
    super();
    this.places = new PrismaPlaceRepository(prisma);
    this.weatherDaySnapshots = new PrismaWeatherDaySnapshotRepository(prisma);
  }

  async runInTransaction<T>(work: (context: IDBContext) => Promise<T>): Promise<T> {
    return work(this);
  }
}
