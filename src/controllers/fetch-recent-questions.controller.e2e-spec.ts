import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { RootModule } from '@/root.module'

describe('Fetch recent questions [e2e]', () => {
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

    const questionsPromises = []
    for (let counter = 0; counter < 4; counter++) {
      const questionPromise = request(app.getHttpServer())
        .post('/api/questions')
        .set('Authorization', `Bearer ${body.token}`)
        .send({
          title: `e2e test title ${counter}`,
          content: `e2e test content ${counter}`,
        })
      questionsPromises.push(questionPromise)
    }
    await Promise.all(questionsPromises)

    const response = await request(app.getHttpServer())
      .get('/api/questions')
      .set('Authorization', `Bearer ${body.token}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({ title: 'e2e test title 0' }),
        expect.objectContaining({ title: 'e2e test title 1' }),
        expect.objectContaining({ title: 'e2e test title 2' }),
        expect.objectContaining({ title: 'e2e test title 3' }),
      ]),
    })
  })
})
