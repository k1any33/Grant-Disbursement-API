import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Household, HouseholdDocument } from 'src/entities/household.entity'

@Injectable()
export class HouseholdService {
  constructor(
    @InjectModel(Household.name) private courseModel: Model<HouseholdDocument>,
  ) {}
}
