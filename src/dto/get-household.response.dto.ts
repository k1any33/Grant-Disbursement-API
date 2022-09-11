import { ApiProperty } from '@nestjs/swagger'
import { HouseholdResponseDto } from './household.response.dto'

export class GetHouseholdsResponseDto {
  @ApiProperty({ type: 'array', example: [] })
  items: HouseholdResponseDto[]

  @ApiProperty({ type: 'number', example: 1 })
  count: number
}
