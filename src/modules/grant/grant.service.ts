import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { HouseholdMember } from '../../entities/household-member.entity'
import { Household, HouseholdDocument } from '../../entities/household.entity'
import { OccupationType } from '../../types/occupation.type'
import { GrantResultSuccess } from './types'

@Injectable()
export class GrantService {
  constructor(@InjectModel(Household.name) private houseModel: Model<HouseholdDocument>) {}

  async getStudentBonus(): Promise<GrantResultSuccess> {
    const householdDocuments = await this.houseModel.find().lean().exec()
    if (householdDocuments.length === 0) {
      return { success: true, data: { items: [], count: 0 } }
    }
    const currentDate = new Date()
    const eligibleHouseholds: Household[] = []
    householdDocuments.forEach((household: Household) => {
      if (household.totalAnnualIncome < 200000) {
        const eligibleMembers: HouseholdMember[] = []
        household.householdMembers?.forEach((householdMember: HouseholdMember) => {
          console.log(householdMember)
          const age = currentDate.getFullYear() - new Date(householdMember.DOB).getFullYear()
          console.log(currentDate.getFullYear())
          console.log(new Date(householdMember.DOB).getFullYear())
          console.log(age)
          if (age < 16 && age > 0 && householdMember.occupationType === OccupationType.Student) {
            eligibleMembers.push(householdMember)
          }
        })
        if (eligibleMembers.length !== 0) {
          eligibleHouseholds.push({ ...household, householdMembers: eligibleMembers })
        }
      }
    })

    return {
      success: true,
      data: { items: eligibleHouseholds, count: eligibleHouseholds.length },
    }
  }
}
