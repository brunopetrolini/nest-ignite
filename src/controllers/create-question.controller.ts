import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'

import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { TokenPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

const payloadValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/api')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('/questions')
  @HttpCode(201)
  public async handle(
    @Body(payloadValidationPipe) payload: CreateQuestionBody,
    @CurrentUser() user: TokenPayload,
  ) {
    const { title, content } = payload
    const userId = user.sub

    const slug = this.convertToSlug(title)

    const { id } = await this.prismaService.question.create({
      data: {
        title,
        content,
        authorId: userId,
        slug,
      },
    })

    return { id }
  }

  private convertToSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '') // Remove non-alpha-numeric characters except hyphens
      .replace(/\s+/g, '-') // Replace white-spaces with hyphens
  }
}
