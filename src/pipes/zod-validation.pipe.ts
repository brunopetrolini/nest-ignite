import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  public transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.flatten().fieldErrors
        throw new BadRequestException({
          message: errorMessage,
          error: 'Bad Request',
          statusCode: 400,
        })
      }

      throw new BadRequestException('Validation failed')
    }
  }
}
