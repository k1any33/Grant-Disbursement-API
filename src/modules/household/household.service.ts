import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { v4 } from 'uuid'
import { Household, HouseholdDocument } from '../../entities/household.entity'
import { CreateHouseholdDto } from './dto/create-household.dto'
import { UpdateHouseholdMembersDto } from './dto/update-members.dto'
import { HouseholdResultFailure, HouseholdResultSuccess } from './types'

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

  async updateHouseholdMembers(
    householdId: string,
    updateHouseholdMembersDto: UpdateHouseholdMembersDto,
  ): Promise<HouseholdResultSuccess | HouseholdResultFailure> {
    const householdDocument = await this.courseModel
      .findOne({ householdId })
      .exec()
    console.log('test', householdDocument)
    if (!householdDocument) {
      return {
        success: false,
        statusCode: 400,
        message: `Household of this id: ${householdId} does not exist`,
      }
    }
    const updatedHouseholdDocument = this.courseModel.findOneAndUpdate(
      { householdId },
      { $push: { householdMembers: updateHouseholdMembersDto } },
      { new: true },
    )
    return { success: true, data: updatedHouseholdDocument }
  }
}
