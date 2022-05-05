import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from 'src/config/config.service';

const { clientID, clientSecret, callbackURL } = new ConfigService().get(
  'google',
);

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    // call super() to instantiate google authentication strategy
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  /**
   * Required for passport validation
   * @param _accessToken received google accesstoken
   * @param _refreshToken received google refreshtoken
   * @param profile user profile info received from google authentication
   * @returns reuired basic info
   */
  validate = async (
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) => {
    return profile;
  };
}
