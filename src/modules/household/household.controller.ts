import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateHouseholdDto } from './dto/create-household.dto'
import { CreateHouseholdResponseDto } from './dto/create-household.response.dto'
import { UpdateHouseholdMembersDto } from './dto/update-members.dto'
import { HouseholdService } from './household.service'

@ApiTags('Household')
@Controller('household')
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a household',
    description:
      'Housing Type must be one of the following: HDB, Condominium, Landed',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateHouseholdResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error creating household',
  })
  async create(
    @Body() createHouseholdDto: CreateHouseholdDto,
  ): Promise<CreateHouseholdResponseDto | HttpException> {
    const result = await this.householdService
      .create(createHouseholdDto)
      .catch(({ message }) => {
        // TODO: Replace with logger
        console.log(message)
        throw new InternalServerErrorException('Error creating household')
      })
    return result.data
  }

  @Patch(':householdId')
  @ApiOperation({
    summary: 'Create a household',
    description:
      'Housing Type must be one of the following: HDB, Condominium, Landed',
  })
  @ApiResponse({ status: HttpStatus.OK, type: '' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error updating household members',
  })
  async updateHouseholdMembers(
    @Param('householdId', new ParseUUIDPipe({ version: '4' }))
    householdId: string,
    @Body() updateHouseholdMembersDto: UpdateHouseholdMembersDto,
  ): Promise<HttpException> {
    const result = await this.householdService
      .updateHouseholdMembers(householdId, updateHouseholdMembersDto)
      .catch(({ message }) => {
        // TODO: Replace with logger
        console.log(message)
        throw new InternalServerErrorException(
          'Error updating household members',
        )
      })
    if (!result.success)
      throw new HttpException(result.message, result.statusCode)

    return result.data
  }
}
