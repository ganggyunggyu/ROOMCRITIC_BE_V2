import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class AddContentWishDTO {
  @ApiProperty({ example: '6629e63db60f7e47ff09ccab' })
  userId: Types.ObjectId;
  @ApiProperty({ example: '65dbf74e13f52a0d8acd89a7' })
  contentId: Types.ObjectId;
}
