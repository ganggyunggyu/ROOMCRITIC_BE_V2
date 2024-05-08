import { SetMetadata } from '@nestjs/common';
export const Public = () => SetMetadata(process.env.PUBLIC_KEY, true);
