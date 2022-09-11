import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { GrantService } from './grant.service'
import { v4 } from 'uuid'
import { GetHouseholdsResponseDto } from '../../dto/get-household.response.dto'

@ApiTags('Grant')
@Controller('grant')
export class GrantController {
  constructor(private readonly grantService: GrantService) {}

  @Get('student-encouragement-bonus')
  @ApiOperation({
    summary: 'Student Encouragement Bonus',
    description: 'Get all available households that are eligible for Student Encouragement Bonus',
  })
  @ApiResponse({ status: HttpStatus.OK, type: GetHouseholdsResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error fetching all households that are eligible for Student Encouragement Bonus',
  })
  async getStudentBonus(): Promise<GetHouseholdsResponseDto | HttpException> {
    const result = await this.grantService.getStudentBonus().catch(({ message }) => {
      // TODO: Replace with logger
      console.log(message)
      throw new InternalServerErrorException(
        'Error fetching all households that are eligible for Student Encouragement Bonus',
      )
    })
    return result.data
  }
}
