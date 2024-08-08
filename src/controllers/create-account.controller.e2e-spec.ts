import { RootModule } from '@/root.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create account [e2e]', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [RootModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /api/accounts', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/accounts')
      .send({
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: '123456',
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ accountId: expect.any(String) })
  })
})
