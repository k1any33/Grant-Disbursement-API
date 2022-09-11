import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { CreateHouseholdDto } from '../../src/modules/household/dto/create-household.dto'
import { CreateHouseholdResponseDto } from '../../src/modules/household/dto/create-household.response.dto'
import { UpdateHouseholdMembersDto } from '../../src/modules/household/dto/update-members.dto'
import { GenderType } from '../../src/types/gender.type'
import { HousingType } from '../../src/types/housing.type'
import { MaritalStatusType } from '../../src/types/marital-status.type'
import { OccupationType } from '../../src/types/occupation.type'
import createAppMock, { closeMongoConnection } from '../fixtures/app.mock'
import { GetHouseholdsResponseDto } from '../../src/dto/get-household.response.dto'
import { GrantController } from '../../src/modules/grant/grant.controller'

let app: NestFastifyApplication

describe('GrantController for Multigeneration Scheme', () => {
  beforeAll(async () => {
    jest.resetAllMocks()
    app = await createAppMock()
  })

  afterAll(async () => {
    jest.restoreAllMocks()
    jest.resetModules()
    closeMongoConnection()
    app.close()
  })

  it('should be defined', () => {
    expect(GrantController).toBeDefined()
  })

  describe('Get all households that are eligible through GET /grant/multigeneration-scheme', () => {
    const eligibleHouseholdMember: UpdateHouseholdMembersDto = {
      name: 'John Tan',
      gender: GenderType.Male,
      maritalStatus: MaritalStatusType.Single,
      occupationType: OccupationType.Student,
      annualIncome: 0,
      DOB: '2010-12-21',
    }

    const exceedAnnualIncomeHousehold: UpdateHouseholdMembersDto = {
      name: 'Sandy Lim',
      gender: GenderType.Female,
      maritalStatus: MaritalStatusType.Married,
      spouse: 'Mark Lim',
      occupationType: OccupationType.Employed,
      annualIncome: 150001,
      DOB: '1960-12-21',
    }

    const createHouseholdPayload: CreateHouseholdDto = {
      housingType: HousingType.Condominium,
    }

    // Negative Case
    it('should NOT be able to get household due to total income being over 150 000', async () => {
      const createHouseholdResponse = await app
        .inject()
        .post('/household')
        .body(createHouseholdPayload)
      expect(createHouseholdResponse.statusCode).toEqual(201)
      const householdDocument: CreateHouseholdResponseDto = createHouseholdResponse.json()
      const householdId = householdDocument.householdId

      expect(householdDocument.householdMembers).toEqual([])
      expect(householdDocument.totalAnnualIncome).toEqual(0)
      expect(householdDocument.housingType).toEqual(HousingType.Condominium)

      await app.inject().patch(`/household/${householdId}`).body(exceedAnnualIncomeHousehold)

      const response = await app.inject().get('/grant/multigeneration-scheme')
      const householdResponseObject: GetHouseholdsResponseDto = response.json()
      expect(householdResponseObject.count).toEqual(0)
      expect(householdResponseObject.items).toHaveLength(0)
    })

    // Positive Case
    it('should BE able to get all households eligible', async () => {
      const createHouseholdResponse = await app
        .inject()
        .post('/household')
        .body(createHouseholdPayload)
      expect(createHouseholdResponse.statusCode).toEqual(201)
      const householdDocument: CreateHouseholdResponseDto = createHouseholdResponse.json()
      const householdId = householdDocument.householdId

      expect(householdDocument.householdMembers).toEqual([])
      expect(householdDocument.totalAnnualIncome).toEqual(0)
      expect(householdDocument.housingType).toEqual(HousingType.Condominium)

      await app.inject().patch(`/household/${householdId}`).body(eligibleHouseholdMember)

      const response = await app.inject().get('/grant/multigeneration-scheme')
      const householdResponseObject: GetHouseholdsResponseDto = response.json()
      expect(householdResponseObject.count).toEqual(1)
      expect(householdResponseObject.items).toHaveLength(1)
      const household = householdResponseObject.items[0]
      expect(household.householdMembers).toHaveLength(1)
      expect(household.householdMembers).toEqual(
        expect.arrayContaining([expect.objectContaining(eligibleHouseholdMember)]),
      )
    })
  })
})
