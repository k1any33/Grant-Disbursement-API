import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Schema as MongooseSchema } from 'mongoose'
import { HousingType } from '../types/housing.type'
import { HouseholdMember } from './household-member.entity'

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
  readonly housingType: HousingType

  @Prop({ required: false, type: MongooseSchema.Types.Array, _id: false })
  readonly householdMembers?: HouseholdMember[]
}

export const HouseholdSchema = SchemaFactory.createForClass(Household)
