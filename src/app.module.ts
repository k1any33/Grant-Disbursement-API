import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import configuration from './config/configuration'
import { GrantModule } from './modules/grant/grant.module'
import { HealthModule } from './modules/health/health.module'
import { HouseholdModule } from './modules/household/household.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('mongouri'),
      }),
    }),
    HealthModule,
    HouseholdModule,
    GrantModule,
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
