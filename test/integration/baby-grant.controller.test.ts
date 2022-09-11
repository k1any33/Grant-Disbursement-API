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

describe('GrantController for Baby Sunshine Grant', () => {
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

  describe('Get all households that are eligible through GET /grant/baby-sunshine-grant', () => {
    const eligibleHouseholdMember: UpdateHouseholdMembersDto = {
      name: 'John Tan',
      gender: GenderType.Male,
      maritalStatus: MaritalStatusType.Single,
      occupationType: OccupationType.Unemployed,
      annualIncome: 0,
      DOB: '2022-04-21',
    }

    const uneligibleHouseholdMember: UpdateHouseholdMembersDto = {
      name: 'Andy Tan',
      gender: GenderType.Male,
      maritalStatus: MaritalStatusType.Single,
      occupationType: OccupationType.Unemployed,
      annualIncome: 0,
      DOB: '2022-01-10',
    }

    const createHouseholdPayload: CreateHouseholdDto = {
      housingType: HousingType.HDB,
    }

    // Negative Case
    it('should NOT be able to get household due to no household members meeting the criteria', async () => {
      const createHouseholdResponse = await app
        .inject()
        .post('/household')
        .body({ housingType: HousingType.Condominium })
      expect(createHouseholdResponse.statusCode).toEqual(201)
      const householdDocument: CreateHouseholdResponseDto = createHouseholdResponse.json()
      const householdId = householdDocument.householdId

      expect(householdDocument.householdMembers).toEqual([])
      expect(householdDocument.totalAnnualIncome).toEqual(0)
      expect(householdDocument.housingType).toEqual(HousingType.Condominium)

      await app.inject().patch(`/household/${householdId}`).body(uneligibleHouseholdMember)

      const response = await app.inject().get('/grant/baby-sunshine-grant')

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
      expect(householdDocument.housingType).toEqual(HousingType.HDB)

      await app.inject().patch(`/household/${householdId}`).body(uneligibleHouseholdMember)
      await app.inject().patch(`/household/${householdId}`).body(eligibleHouseholdMember)

      const response = await app.inject().get('/grant/baby-sunshine-grant')
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
