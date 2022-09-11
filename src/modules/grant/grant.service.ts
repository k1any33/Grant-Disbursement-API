import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { HouseholdMember } from '../../entities/household-member.entity'
import { Household, HouseholdDocument } from '../../entities/household.entity'
import { HousingType } from '../../types/housing.type'
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
          const age = currentDate.getFullYear() - new Date(householdMember.DOB).getFullYear()
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

  async getMultigenerationScheme(): Promise<GrantResultSuccess> {
    const householdDocuments = await this.houseModel.find().lean().exec()
    if (householdDocuments.length === 0) {
      return { success: true, data: { items: [], count: 0 } }
    }
    const currentDate = new Date()
    const eligibleHouseholds: Household[] = []
    householdDocuments.forEach((household: Household) => {
      if (household.totalAnnualIncome < 150000) {
        let eligible = false
        // breaking out of for loop early won't be significant as I dont expect the householdMembers array to be large
        household.householdMembers?.forEach((householdMember: HouseholdMember) => {
          const age = currentDate.getFullYear() - new Date(householdMember.DOB).getFullYear()
          if (age > 0 && (age < 18 || age > 55)) {
            eligible = true
          }
        })
        if (eligible) {
          eligibleHouseholds.push(household)
        }
      }
    })

    return {
      success: true,
      data: { items: eligibleHouseholds, count: eligibleHouseholds.length },
    }
  }

  async getElderBonus(): Promise<GrantResultSuccess> {
    const householdDocuments = await this.houseModel.find().lean().exec()
    if (householdDocuments.length === 0) {
      return { success: true, data: { items: [], count: 0 } }
    }
    const currentDate = new Date()
    const eligibleHouseholds: Household[] = []
    householdDocuments.forEach((household: Household) => {
      if (household.housingType === HousingType.HDB) {
        const eligibleMembers: HouseholdMember[] = []
        household.householdMembers?.forEach((householdMember: HouseholdMember) => {
          const age = currentDate.getFullYear() - new Date(householdMember.DOB).getFullYear()
          if (age >= 55) {
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

  async getBabySunshineGrant(): Promise<GrantResultSuccess> {
    const householdDocuments = await this.houseModel.find().lean().exec()
    if (householdDocuments.length === 0) {
      return { success: true, data: { items: [], count: 0 } }
    }
    const currentDate = new Date()
    const eligibleHouseholds: Household[] = []
    householdDocuments.forEach((household: Household) => {
      const eligibleMembers: HouseholdMember[] = []
      household.householdMembers?.forEach((householdMember: HouseholdMember) => {
        const dob = new Date(householdMember.DOB)
        const diffYear = currentDate.getFullYear() - dob.getFullYear()
        let eligible = false
        if (diffYear <= 1) {
          const diffMonths =
            diffYear === 1
              ? 12 - dob.getMonth() + currentDate.getMonth()
              : currentDate.getMonth() - dob.getMonth()
          if (diffMonths < 8) eligible = true
          else if (diffMonths === 8) eligible = true && currentDate.getDate() < dob.getDate()

          if (eligible) eligibleMembers.push(householdMember)
        }
      })
      if (eligibleMembers.length !== 0) {
        eligibleHouseholds.push({ ...household, householdMembers: eligibleMembers })
      }
    })

    return {
      success: true,
      data: { items: eligibleHouseholds, count: eligibleHouseholds.length },
    }
  }
}
