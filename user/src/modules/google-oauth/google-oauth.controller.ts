import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from './google-oauth.guard';
import { Request } from 'express';
import { AllowUnauthorizedRequest } from 'src/core/allow.unauthorized.decorator';
import { GoogleOauthService } from './google-oauth.service';
import { IGoogleUserInfo } from './interfaces/IGoogleUserInfo';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Google Oauth Login')
@Controller('google-oauth')
@UseGuards(GoogleOauthGuard)
export class GoogleOauthController {
  constructor(private readonly googleOauthService: GoogleOauthService) {}

  @ApiOperation({ summary: 'To get google login html page' })
  @AllowUnauthorizedRequest()
  @Get('')
  async googleLogin() {
    // auth guard will return google-login html page
  }

  @ApiOperation({
    summary: 'Callback API fired by google on successfull authentication',
  })
  @AllowUnauthorizedRequest()
  @Get('/redirect')
  async googleLoginCallback(@Req() req: Request) {
    return await this.googleOauthService.loginUser(req.user as IGoogleUserInfo);
  }
}
