import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { GrantService } from './grant.service'
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

  @Get('multigeneration-scheme')
  @ApiOperation({
    summary: 'Multigeneration Scheme',
    description: 'Get all available households that are eligible for Multigeneration Scheme',
  })
  @ApiResponse({ status: HttpStatus.OK, type: GetHouseholdsResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error fetching all households that are eligible for Multigeneration Scheme',
  })
  async getMultigenerationScheme(): Promise<GetHouseholdsResponseDto | HttpException> {
    const result = await this.grantService.getMultigenerationScheme().catch(({ message }) => {
      // TODO: Replace with logger
      console.log(message)
      throw new InternalServerErrorException(
        'Error fetching all households that are eligible for Multigeneration Scheme',
      )
    })
    return result.data
  }

  @Get('elder-bonus')
  @ApiOperation({
    summary: 'Elder Bonus',
    description: 'Get all available households that are eligible for Elder Bonus',
  })
  @ApiResponse({ status: HttpStatus.OK, type: GetHouseholdsResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error fetching all households that are eligible for Elder Bonus',
  })
  async getElderBonus(): Promise<GetHouseholdsResponseDto | HttpException> {
    const result = await this.grantService.getElderBonus().catch(({ message }) => {
      // TODO: Replace with logger
      console.log(message)
      throw new InternalServerErrorException(
        'Error fetching all households that are eligible for Elder Bonus',
      )
    })
    return result.data
  }

  @Get('baby-sunshine-grant')
  @ApiOperation({
    summary: 'Baby Sunshine Grant',
    description: 'Get all available households that are eligible for Baby Sunshine Grant',
  })
  @ApiResponse({ status: HttpStatus.OK, type: GetHouseholdsResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error fetching all households that are eligible for Baby Sunshine Grant',
  })
  async getBabySunshineGrant(): Promise<GetHouseholdsResponseDto | HttpException> {
    const result = await this.grantService.getBabySunshineGrant().catch(({ message }) => {
      // TODO: Replace with logger
      console.log(message)
      throw new InternalServerErrorException(
        'Error fetching all households that are eligible for Baby Sunshine Grant',
      )
    })
    return result.data
  }

  @Get('yolo-gst-grant')
  @ApiOperation({
    summary: 'YOLO GST Grant',
    description: 'Get all available households that are eligible for YOLO GST Grant',
  })
  @ApiResponse({ status: HttpStatus.OK, type: GetHouseholdsResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error fetching all households that are eligible for YOLO GST Grant',
  })
  async getYoloGstGrant(): Promise<GetHouseholdsResponseDto | HttpException> {
    const result = await this.grantService.getYoloGstGrant().catch(({ message }) => {
      // TODO: Replace with logger
      console.log(message)
      throw new InternalServerErrorException(
        'Error fetching all households that are eligible for YOLO GST Grant',
      )
    })
    return result.data
  }
}
