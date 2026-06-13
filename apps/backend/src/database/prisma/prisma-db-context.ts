import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { IDBContext } from '../db-context.interface';
import { ILocationRepository } from '../repositories/location.repository.interface';
import { IWeatherSnapshotRepository } from '../repositories/weather-snapshot.repository.interface';
import { PrismaLocationRepository } from './prisma-location.repository';
import { PrismaWeatherSnapshotRepository } from './prisma-weather-snapshot.repository';
import { PrismaClient } from 'prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaDBContext extends IDBContext implements OnModuleInit, OnModuleDestroy {
  private readonly prisma: PrismaClient;
  private readonly pool: Pool;

  readonly locations: ILocationRepository;
  readonly weatherSnapshots: IWeatherSnapshotRepository;

  constructor() {
    super();
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(this.pool);
    this.prisma = new PrismaClient({ adapter });
    this.locations = new PrismaLocationRepository(this.prisma);
    this.weatherSnapshots = new PrismaWeatherSnapshotRepository(this.prisma);
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
  readonly locations: ILocationRepository;
  readonly weatherSnapshots: IWeatherSnapshotRepository;

  constructor(prisma: PrismaClient) {
    super();
    this.locations = new PrismaLocationRepository(prisma);
    this.weatherSnapshots = new PrismaWeatherSnapshotRepository(prisma);
  }

  async runInTransaction<T>(work: (context: IDBContext) => Promise<T>): Promise<T> {
    return work(this);
  }
}
