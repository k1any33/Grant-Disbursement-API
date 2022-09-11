import { ApiProperty } from '@nestjs/swagger'
import { HouseholdMember } from '../../../entities/household-member.entity'
import { HousingType } from '../../../types/housing.type'
import { v4 } from 'uuid'

export class CreateHouseholdResponseDto {
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
    example: [],
  })
  readonly householdMembers: HouseholdMember

  @ApiProperty({ type: 'date', example: '2022-09-09T12:02:50.519Z' })
  readonly createdAt: Date

  @ApiProperty({ type: 'date', example: '2022-09-09T12:02:50.519Z' })
  readonly updatedAt: Date

  @ApiProperty({
    type: 'number',
    example: 0,
  })
  readonly totalAnnualIncome: number
}
