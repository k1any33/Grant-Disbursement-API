import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { v4 } from 'uuid'
import { HouseholdMember } from '../../entities/household-member.entity'
import { Household, HouseholdDocument } from '../../entities/household.entity'
import { GrantResultSuccess, GrantResultFailure } from './types'

@Injectable()
export class GrantService {
  constructor(@InjectModel(Household.name) private houseModel: Model<HouseholdDocument>) {}

  async getStudentBonus(): Promise<GrantResultSuccess> {
    const householdDocuments = await this.houseModel.find().exec()
    if (householdDocuments.length === 0) {
      return { success: true, data: { items: [], count: 0 } }
    }
    const currentDate = new Date()
    const eligibleHouseholds: Household[] = []
    householdDocuments.forEach((household: Household) => {
      if (household.totalAnnualIncome < 200000) {
        const eligibleMembers: HouseholdMember[] = []
        household.householdMembers?.forEach((householdMember: HouseholdMember) => {
          const age = currentDate.getFullYear() - householdMember.DOB.getFullYear()
          if (age < 16) {
            eligibleMembers.push(householdMember)
          }
        })
        if (eligibleMembers.length !== 0) {
          eligibleHouseholds.push(household)
        }
      }
    })

    return {
      success: true,
      data: { items: eligibleHouseholds, count: eligibleHouseholds.length },
    }
  }
}
