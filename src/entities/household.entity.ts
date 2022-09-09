import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HouseholdType } from 'src/types/household.type'
import {
  HouseholdMember,
  HouseholdMemberSchema,
} from './household-member.entity'

export type HouseholdDocument = Household & Document

@Schema({
  collection: 'household',
  versionKey: false,
  _id: true,
  timestamps: true,
})
export class Household {
  @Prop({ unique: true, required: true, type: String })
  readonly householdId: string

  @Prop({ required: true, type: String })
  readonly householdType: HouseholdType

  @Prop({ required: false, type: HouseholdMemberSchema, default: [] })
  readonly householdMembers: HouseholdMember
}

export const HouseholdSchema = SchemaFactory.createForClass(Household)
