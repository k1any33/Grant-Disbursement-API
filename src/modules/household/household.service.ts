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
  constructor(@InjectModel(Household.name) private houseModel: Model<HouseholdDocument>) {}

  async create(createHouseholdDto: CreateHouseholdDto): Promise<HouseholdResultSuccess> {
    const householdEntity: Household = {
      ...createHouseholdDto,
      householdId: v4(),
      totalAnnualIncome: 0,
    }
    const householdDocument = await this.houseModel.create(householdEntity)

    return { success: true, data: householdDocument }
  }

  async updateHouseholdMembers(
    householdId: string,
    updateHouseholdMembersDto: UpdateHouseholdMembersDto,
  ): Promise<HouseholdResultSuccess | HouseholdResultFailure> {
    const householdDocument = await this.houseModel.findOne({ householdId }).exec()
    if (!householdDocument) {
      return {
        success: false,
        statusCode: 400,
        message: `Household of this id: ${householdId} does not exist`,
      }
    }
    const totalAnnualIncome =
      householdDocument.totalAnnualIncome + updateHouseholdMembersDto.annualIncome

    const updatedHouseholdDocument = this.houseModel.findOneAndUpdate(
      { householdId },
      {
        $push: {
          householdMembers: updateHouseholdMembersDto,
        },
        $set: { totalAnnualIncome },
      },
      { new: true },
    )
    return { success: true, data: updatedHouseholdDocument }
  }

  async getAll(): Promise<HouseholdResultSuccess> {
    const householdDocuments = await this.houseModel.find().exec()
    const count = await this.houseModel.countDocuments()

    return { success: true, data: { items: householdDocuments, count } }
  }

  async getOne(householdId: string): Promise<HouseholdResultSuccess | HouseholdResultFailure> {
    const householdDocument = await this.houseModel.findOne({ householdId }).exec()

    if (!householdDocument) {
      return {
        success: false,
        statusCode: 400,
        message: `Household of this id: ${householdId} does not exist`,
      }
    }

    return { success: true, data: householdDocument }
  }
}
