import { ApiProperty } from '@nestjs/swagger'
import { HousingType } from '../types/housing.type'
import { v4 } from 'uuid'
import { HouseholdMember } from '../entities/household-member.entity'

export class HouseholdResponseDto {
  @ApiProperty({
    type: 'string',
    example: '631b2b6a1fbdd8cabfd32f02',
  })
  readonly _id: string

  @ApiProperty({
    type: 'string',
    example: v4(),
  })
  readonly householdId: string

  @ApiProperty({
    type: 'string',
    example: 'Condominium',
  })
  readonly housingType: HousingType

  @ApiProperty({
    type: 'array',
    example: `
      [{
        "name": "John Smith",
        "gender": "Male",
        "maritalStatus": "Married",
        "spouse": "Lena",
        "occupationType": "Employed",
        "annualIncome": 50000,
        "DOB": "1998-12-21"
      }]
    `,
  })
  readonly householdMembers: HouseholdMember

  @ApiProperty({
    type: 'number',
    example: 50000,
  })
  readonly totalAnnualIncome: number

  @ApiProperty({ type: 'date', example: '2022-09-09T12:02:50.519Z' })
  readonly createdAt: Date

  @ApiProperty({ type: 'date', example: '2022-09-09T12:02:50.519Z' })
  readonly updatedAt: Date
}
