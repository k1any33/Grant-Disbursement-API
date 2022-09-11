import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { HouseholdSchema } from '../../entities/household.entity'
import { GrantController } from './grant.controller'
import { GrantService } from './grant.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Household', schema: HouseholdSchema }])],
  controllers: [GrantController],
  providers: [GrantService],
})
export class GrantModule {}
