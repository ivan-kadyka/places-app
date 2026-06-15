import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { PlaceModule } from './domains/place/place.module'
import { GraphQLModule } from '@nestjs/graphql'
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      debug: false,
      includeStacktraceInErrorResponses: false,
      playground: true,
    }),
    PlaceModule,
    ],

})
export class AppModule {}
