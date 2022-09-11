import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { HouseholdSchema } from '../../entities/household.entity'
import { HouseholdController } from './household.controller'
import { HouseholdService } from './household.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Household', schema: HouseholdSchema }])],
  controllers: [HouseholdController],
  providers: [HouseholdService],
})
export class HouseholdModule {}
