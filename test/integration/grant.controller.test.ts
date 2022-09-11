import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { CreateHouseholdDto } from '../../src/modules/household/dto/create-household.dto'
import { CreateHouseholdResponseDto } from '../../src/modules/household/dto/create-household.response.dto'
import { HouseholdResponseDto } from '../../src/dto/household.response.dto'
import { UpdateHouseholdMembersDto } from '../../src/modules/household/dto/update-members.dto'
import { HouseholdController } from '../../src/modules/household/household.controller'
import { GenderType } from '../../src/types/gender.type'
import { HousingType } from '../../src/types/housing.type'
import { MaritalStatusType } from '../../src/types/marital-status.type'
import { OccupationType } from '../../src/types/occupation.type'
import createAppMock, { closeMongoConnection } from '../fixtures/app.mock'
import { v4 } from 'uuid'
import { GetHouseholdsResponseDto } from '../../src/dto/get-household.response.dto'

let app: NestFastifyApplication

describe('HouseholdController', () => {
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
    expect(HouseholdController).toBeDefined()
  })

  describe('Create household through POST /household', () => {
    it('should able to create a household with valid housing type enum values', async () => {
      const payload: CreateHouseholdDto = {
        housingType: HousingType.Condominium,
      }
      const response = await app.inject().post('/household').body(payload)
      expect(response.statusCode).toEqual(201)

      const householdDocument: CreateHouseholdResponseDto = JSON.parse(response.body)
      expect(householdDocument.householdId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      )
      expect(householdDocument.housingType).toEqual(HousingType.Condominium)
      expect(householdDocument.householdMembers).toEqual([])
      expect(householdDocument.totalAnnualIncome).toEqual(0)
      expect(new Date(householdDocument.createdAt)).toBeInstanceOf(Date)
      expect(new Date(householdDocument.updatedAt)).toBeInstanceOf(Date)
    })

    it('should return 400 when creating a household with an invalid housing type enum value', async () => {
      const payload = {
        housingType: 'private',
      }
      const response = await app.inject().post('/household').body(payload)
      expect(response.statusCode).toEqual(400)
    })
  })

  describe('Update household members through PATCH /household/:householdId', () => {
    const payload: UpdateHouseholdMembersDto = {
      name: 'John Smith',
      gender: GenderType.Male,
      maritalStatus: MaritalStatusType.Married,
      spouse: 'Lena',
      occupationType: OccupationType.Employed,
      annualIncome: 50000,
      DOB: new Date('1998-12-21'),
    }
    it('should able to update a household with a valid housing member details', async () => {
      const createHouseholdResponse = await app
        .inject()
        .post('/household')
        .body({ housingType: HousingType.Condominium })
      const householdId = createHouseholdResponse.json().householdId
      const response = await app.inject().patch(`/household/${householdId}`).body(payload)
      expect(response.statusCode).toEqual(200)

      const householdDocument: HouseholdResponseDto = JSON.parse(response.body)
      expect(householdDocument.householdId).toEqual(householdId)
      expect(householdDocument.housingType).toEqual(HousingType.Condominium)
      expect(householdDocument.householdMembers).toHaveLength(1)
      expect(householdDocument.totalAnnualIncome).toEqual(50000)
      expect(new Date(householdDocument.createdAt)).toBeInstanceOf(Date)
      expect(new Date(householdDocument.updatedAt)).toBeInstanceOf(Date)
    })

    it('should return 400 when updating a household with a housingId that does not exist', async () => {
      const response = await app.inject().patch(`/household/${v4()}`).body(payload)
      expect(response.statusCode).toEqual(400)
    })

    it('should return 400 when updating a household with invalid payload', async () => {
      const createHouseholdResponse = await app
        .inject()
        .post('/household')
        .body({ housingType: HousingType.Condominium })
      const householdId = createHouseholdResponse.json().householdId

      const invalidPayload = {
        name: 1111,
        gender: 'invalid enum',
        maritalStatus: MaritalStatusType.Married,
        spouse: 32,
        occupationType: OccupationType.Employed,
        annualIncome: 50000,
        DOB: new Date('1998-12-21'),
      }
      const response = await app.inject().patch(`/household/${householdId}`).body(invalidPayload)
      expect(response.statusCode).toEqual(400)
    })
  })

  describe('Get all households through GET /household', () => {
    it('should able to get all household', async () => {
      const response = await app.inject().get('/household')
      expect(response.statusCode).toEqual(200)
      const result: GetHouseholdsResponseDto = response.json()
      expect(result.count).toEqual(3)
      expect(result.items).toBeInstanceOf(Array)
    })
  })

  describe("Get a household by it's id through GET /household", () => {
    it('should able to get a household with a valid householdId', async () => {
      const payload: CreateHouseholdDto = {
        housingType: HousingType.Condominium,
      }
      const createHouseholdResponse = await app.inject().post('/household').body(payload)
      const doc: CreateHouseholdResponseDto = createHouseholdResponse.json()
      const response = await app.inject().get(`/household/${doc.householdId}`)
      const householdDocument: CreateHouseholdResponseDto = JSON.parse(response.body)
      expect(householdDocument.householdId).toEqual(doc.householdId)
      expect(householdDocument.housingType).toEqual(HousingType.Condominium)
      expect(householdDocument.householdMembers).toBeInstanceOf(Array)
      expect(new Date(householdDocument.createdAt)).toBeInstanceOf(Date)
      expect(new Date(householdDocument.updatedAt)).toBeInstanceOf(Date)
    })

    it('should return 400 when getting a household that does not exist', async () => {
      const response = await app.inject().get(`/household/${v4()}`)
      expect(response.statusCode).toEqual(400)
    })
  })
})
