import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { RootModule } from '@/root.module'

describe('Create question [e2e]', () => {
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

  test('[POST] /api/questions', async () => {
    await request(app.getHttpServer()).post('/api/accounts').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    })

    const { body } = await request(app.getHttpServer())
      .post('/api/sessions')
      .send({
        email: 'johndoe@mail.com',
        password: '123456',
      })

    const response = await request(app.getHttpServer())
      .post('/api/questions')
      .set('Authorization', `Bearer ${body.token}`)
      .send({
        title: 'e2e test title',
        content: 'e2e test content',
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ id: expect.any(String) })
  })
})
