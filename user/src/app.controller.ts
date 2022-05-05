import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Token } from './database/entities/token.entity';
import { CreateUserDto, ForgotPasswordDto, LoginDto } from './core/dtos';
import { IAuthPayload } from './core/interfaces';
import { CurrentUser } from './core/user.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IGetUserById } from './core/interfaces/IMessagePatterns';
import { AllowUnauthorizedRequest } from './core/allow.unauthorized.decorator';
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('get_user_by_id')
  public async getUserById(
    @Payload() data: { userId: number },
  ): Promise<IGetUserById> {
    return this.appService.getUserById(data.userId);
  }

  @MessagePattern('get_device_id')
  public async getDeviceById(
    @Payload() data: { userId: number },
  ): Promise<string> {
    return this.appService.getDeviceById(data.userId);
  }

  @AllowUnauthorizedRequest()
  @Post('/login')
  login(@Body() data: LoginDto): Promise<IAuthPayload> {
    return this.appService.login(data);
  }

  @AllowUnauthorizedRequest()
  @Post('/signup')
  signup(@Body() data: CreateUserDto): Promise<IAuthPayload> {
    return this.appService.signup(data);
  }

  @Get('/forgot-password')
  getForgotPassword(@CurrentUser() auth: number): Promise<Token> {
    return this.appService.getForgotPasswordToken(auth);
  }

  @Put('/change-password')
  changePassword(
    @Body() data: ForgotPasswordDto,
    @CurrentUser() auth: number,
  ): Promise<void> {
    return this.appService.changePassword(data, auth);
  }
}
