import { Controller, Get, Logger } from '@nestjs/common';
import { RandomService } from './random.service';

@Controller('random')
export class RandomController {
  private readonly logger = new Logger(RandomController.name);

  constructor(private readonly randomService: RandomService) {}

  @Get()
  getRandom() {
    this.logger.log('🎲 Received request for a random number');
    const result = this.randomService.generateRandom();
    this.logger.log(`📊 Generated: ${result.random}`);
    return result;
  }

  @Get('range/:min/:max')
  getRandomInRange(min: string, max: string) {
    const minNum = parseInt(min, 10);
    const maxNum = parseInt(max, 10);
    
    this.logger.log(`🎯 Received request for a random number in range: ${minNum}-${maxNum}`);
    const result = this.randomService.generateRandomInRange(minNum, maxNum);
    this.logger.log(`📊 Generated in range: ${result.random}`);
    return result;
  }
} 
