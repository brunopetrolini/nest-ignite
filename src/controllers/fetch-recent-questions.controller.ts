import { Controller, Get, Query, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/api')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('/questions')
  public async handle(@Query('page', queryValidationPipe) page: number) {
    const perPage = 1
    const questions = await this.prismaService.question.findMany({
      take: perPage,
      skip: (page - 1) * 1,
      orderBy: { createdAt: 'desc' },
    })
    return { questions }
  }
}
