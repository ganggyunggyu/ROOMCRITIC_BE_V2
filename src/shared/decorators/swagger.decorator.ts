import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

export const ApiSwaggerTags = (name: string) => ApiTags(name);

export const ApiSwaggerOperation = (summary: string, description?: string) =>
  ApiOperation({ summary, description });

export const ApiSwaggerApiResponse = (
  status: number,
  description: string,
  type?: any,
) => ApiResponse({ status, description, type });

export const ApiSwaggerApiBody = (type: any) => ApiBody({ type });

export const ApiSwaggerBearerAuth = () => ApiBearerAuth();

export const ApiSwaggerApiParam = (name: string, example: string) =>
  ApiParam({ name: name, example: example });
