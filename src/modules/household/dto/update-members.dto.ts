import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxDate,
  Min,
} from 'class-validator'
import { GenderType } from '../../../types/gender.type'
import { MaritalStatusType } from '../../../types/marital-status.type'
import { OccupationType } from '../../../types/occupation.type'

export class UpdateHouseholdMembersDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: 'string',
    example: 'John Smith',
  })
  readonly name: string

  @IsNotEmpty()
  @IsEnum(GenderType)
  @ApiProperty({
    required: true,
    description: 'Can be either "Male" or "Female"',
    enum: GenderType,
    example: 'Male',
  })
  readonly gender: GenderType

  @IsNotEmpty()
  @IsEnum(MaritalStatusType)
  @ApiProperty({
    required: true,
    description:
      'Can be either one of the following (Single, Married, Widowed, Separated, Divorced)',
    enum: MaritalStatusType,
    example: 'Married',
  })
  readonly maritalStatus: MaritalStatusType

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Name of the spouse',
    example: 'Lena',
  })
  readonly spouse?: string

  @IsNotEmpty()
  @IsEnum(OccupationType)
  @ApiProperty({
    required: true,
    description: 'Can be either one of the following (Unemployed, Student, Employed)',
    enum: OccupationType,
    example: 'Employed',
  })
  readonly occupationType: OccupationType

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    required: true,
    description: 'Annual Income of the family member in SGD',
    example: 50000,
  })
  readonly annualIncome: number

  @IsNotEmpty()
  @IsDateString('yyyy-mm-dd')
  @ApiProperty({
    required: true,
    description: 'Date of birth',
    example: '1998-12-21',
  })
  readonly DOB: string
}
