import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HouseholdController } from './household.controller';
import { HouseholdService } from './household.service';

@Module({
  imports: [MongooseModule.forFeature([])],
  controllers: [HouseholdController],
  providers: [HouseholdService],
})
export class HouseholdModule {}
