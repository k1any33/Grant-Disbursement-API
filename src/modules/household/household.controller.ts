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
import { HouseholdResponseDto } from './dto/household.response.dto'
import { UpdateHouseholdMembersDto } from './dto/update-members.dto'
import { HouseholdService } from './household.service'
import { v4 } from 'uuid'

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
    summary: 'Add a family member to household',
    description:
      'Gender can be one of the following: (Male, Female).\n Marital Status can be either one of the following (Single, Married, Widowed, Separated, Divorced).\n Occupation Type can be either one of the following (Unemployed, Student, Employed)',
  })
  @ApiResponse({ status: HttpStatus.OK, type: HouseholdResponseDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: `Household of this example id: ${v4()} does not exist`,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error updating household members',
  })
  async updateHouseholdMembers(
    @Param('householdId', new ParseUUIDPipe({ version: '4' }))
    householdId: string,
    @Body() updateHouseholdMembersDto: UpdateHouseholdMembersDto,
  ): Promise<HouseholdResponseDto | HttpException> {
    const result = await this.householdService
      .updateHouseholdMembers(householdId, updateHouseholdMembersDto)
      .catch(({ message }) => {
        // TODO: Replace with logger
        console.log(message)
        throw new InternalServerErrorException(
          'Error updating household members',
        )
      })
    if (!result.success) {
      throw new HttpException(result.message, result.statusCode)
    }

    return result.data
  }
}
