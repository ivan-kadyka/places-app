import { Module } from '@nestjs/common'
import { ActivityScoringService } from 'src/domains/activities/activity-scoring.service'
import { IActivityScoreService } from 'src/domains/activities/activity-scoring.service.interface'

@Module({
  providers: [
     {
        provide: IActivityScoreService,
        useClass: ActivityScoringService,
      },
  ],
  exports: [
    IActivityScoreService,
  ]
})
export class ActivitiesModule {}
