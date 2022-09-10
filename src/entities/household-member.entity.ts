import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { GenderType } from '../types/gender.type'
import { MaritalStatusType } from '../types/marital-status.type'
import { OccupationType } from '../types/occupation.type'

@Schema({
  versionKey: false,
  timestamps: true,
})
export class HouseholdMember {
  @Prop({ required: true, type: String })
  readonly memberId: string

  @Prop({ required: true, type: String })
  readonly name: string

  @Prop({ required: true, type: String })
  readonly gender: GenderType

  @Prop({ required: true, type: String })
  readonly maritalStatus: MaritalStatusType

  @Prop({ required: false, type: String })
  readonly spouse?: string

  @Prop({ required: true, type: String })
  readonly occupationType: OccupationType

  @Prop({ required: true, type: Number })
  readonly annualIncome: number

  @Prop({ required: true, type: Date })
  readonly DOB: Date
}

export const HouseholdMemberSchema =
  SchemaFactory.createForClass(HouseholdMember)
