import { Global, Module } from '@nestjs/common';
import { IDBContext } from './db-context.interface';
import { PrismaDBContext } from './prisma/prisma-db-context';

@Global()
@Module({
  providers: [
    {
      provide: IDBContext,
      useClass: PrismaDBContext,
    },
  ],
  exports: [IDBContext],
})
export class DatabaseModule {}
