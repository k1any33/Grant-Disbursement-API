import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HouseholdService } from './household.service';

@ApiTags('Household')
@Controller('household')
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}
}
