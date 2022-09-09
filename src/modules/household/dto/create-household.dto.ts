import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEnum } from 'class-validator'
import { HousingType } from '../../../types/housing.type'

export class CreateHouseholdDto {
  @IsNotEmpty()
  @IsEnum(HousingType)
  @ApiProperty({
    description: 'Can be the following three types: HDB, Condominium, Landed)',
    enum: HousingType,
    example: 'Condominium',
  })
  readonly housingType: HousingType
}
