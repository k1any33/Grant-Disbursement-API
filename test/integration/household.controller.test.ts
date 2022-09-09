import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { CreateHouseholdDto } from '../../src/modules/household/dto/create-household.dto'
import { CreateHouseholdResponseDto } from '../../src/modules/household/dto/create-household.response.dto'
import { HouseholdController } from '../../src/modules/household/household.controller'
import { HousingType } from '../../src/types/housing.type'
import createAppMock, { closeMongoConnection } from '../fixtures/app.mock'

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

      const householdDocument: CreateHouseholdResponseDto = JSON.parse(
        response.body,
      )
      expect(householdDocument.householdId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      )
      expect(householdDocument.housingType).toEqual(HousingType.Condominium)
      expect(householdDocument.householdMembers).toEqual([])
      expect(new Date(householdDocument.createdAt)).toBeInstanceOf(Date)
      expect(new Date(householdDocument.updatedAt)).toBeInstanceOf(Date)
    })
  })

  it('should return 400 when creating a household with an invalid housing type enum value', async () => {
    const payload = {
      housingType: 'private',
    }
    const response = await app.inject().post('/household').body(payload)
    expect(response.statusCode).toEqual(400)
  })
})
