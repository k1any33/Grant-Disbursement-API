import { ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import { MongoMemoryServer } from 'mongodb-memory-server-global-4.4'
import { HealthModule } from '../../src/modules/health/health.module'

let mongod: MongoMemoryServer

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      if (!mongod) {
        mongod = await MongoMemoryServer.create({
          binary: { version: '4.4.10' },
        })
      }
      const mongoUri = mongod.getUri()
      return {
        uri: mongoUri,
        ...options,
      }
    },
  })

export const closeMongoConnection = async () => {
  if (mongod) await mongod.stop()
}

async function createAppMock(): Promise<NestFastifyApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        // load: [testConfiguration],
        isGlobal: true,
        ignoreEnvFile: true,
      }),
      HealthModule,
      rootMongooseTestModule(),
      MongooseModule.forFeature([]),
    ],
    providers: [ConfigService],
  }).compile()
  const app = moduleRef.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  )
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app
    .init()
    .then((application) => application.getHttpAdapter().getInstance().ready())
  return app
}

export default createAppMock
