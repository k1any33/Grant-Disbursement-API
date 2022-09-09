import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { GenderType } from 'src/types/gender.type'
import { MaritalStatusType } from 'src/types/marital-status.type'
import { OccupationType } from 'src/types/occupation.type'

@Schema({
  versionKey: false,
  _id: true,
  timestamps: true,
})
export class HouseholdMember {
  @Prop({ unique: true, required: true, type: String })
  readonly memberId: string

  @Prop({ required: true, type: String })
  readonly name: string

  @Prop({ required: true, type: String })
  readonly gender: GenderType

  @Prop({ required: true, type: String })
  readonly maritalStatus: MaritalStatusType

  @Prop({ required: false, type: String })
  readonly spouse: string

  @Prop({ required: true, type: String })
  readonly occupationType: OccupationType

  @Prop({ required: true, type: Number })
  readonly annualIncome: number

  @Prop({ required: true, type: String })
  readonly DOB: string
}

export const HouseholdMemberSchema =
  SchemaFactory.createForClass(HouseholdMember)