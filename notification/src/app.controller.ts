import { Controller, Get, Query } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { GetNotificationDto } from './core/dtos';
import { INotificationPayload } from './core/interfaces/INotificationPayload';
import { CurrentUser } from './core/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('send_notification')
  public sendNotification(@Payload() payload: INotificationPayload): void {
    this.appService.manageNotifications(payload);
  }

  @Get('/notifications')
  getNotifications(
    @CurrentUser() authUserId: number,
    @Query() data: GetNotificationDto,
  ) {
    const { skip, limit } = data;
    this.appService.getUserNotifications(authUserId, skip, limit);
  }
}
