import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { GetPresignUrlDto } from './core/interfaces/GetPresignUrlDto';
import { CurrentUser } from './core/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/presign')
  getUserProfilePresign(
    @CurrentUser() auth: number,
    @Query() params: GetPresignUrlDto,
  ): Promise<{ url: string }> {
    return this.appService.getPresgin(params, auth);
  }
}
