import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { v4 } from 'uuid'
import { Household, HouseholdDocument } from '../../entities/household.entity'
import { CreateHouseholdDto } from './dto/create-household.dto'
import { HouseholdResultSuccess } from './types'

@Injectable()
export class HouseholdService {
  constructor(
    @InjectModel(Household.name) private courseModel: Model<HouseholdDocument>,
  ) {}

  async create(
    createHouseholdDto: CreateHouseholdDto,
  ): Promise<HouseholdResultSuccess> {
    const householdEntity: Household = {
      ...createHouseholdDto,
      householdId: v4(),
    }
    const householdDocument = await this.courseModel.create(householdEntity)

    return { success: true, data: householdDocument }
  }
}
