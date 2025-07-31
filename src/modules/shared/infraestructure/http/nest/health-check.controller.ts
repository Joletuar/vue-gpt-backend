import { Controller, Get } from '@nestjs/common';

@Controller('ping')
export class HealthCheckController {
  @Get('/')
  ping() {
    return 'pon';
  }
}
