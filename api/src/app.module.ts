import { Module } from '@nestjs/common';
import { RandomModule } from './random/random.module';

@Module({
  imports: [RandomModule],
})
export class AppModule {} 