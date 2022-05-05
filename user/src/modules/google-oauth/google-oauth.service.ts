import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Role } from 'src/database/entities/role.entity';
import { User } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/database/repository/user.repository';
import { IGoogleUserInfo } from './interfaces/IGoogleUserInfo';

@Injectable()
export class GoogleOauthService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject('TOKEN_SERVICE') private tokenClient: ClientProxy,
  ) {
    tokenClient.connect();
  }

  /**
   * Login user with google account
   * @param userInfo Contains user-info obtained from google
   * @returns
   */
  async loginUser(userInfo: IGoogleUserInfo) {
    const userEmail = userInfo?.emails[0]?.value;
    const checkUser = await this.userRepository.findOne({ email: userEmail });
    if (checkUser) {
      throw new HttpException('USER_EXISTS', HttpStatus.CONFLICT);
    }
    const newUser = new User();
    newUser.email = userEmail;
    newUser.firstName = userInfo.name.givenName;
    newUser.lastName = userInfo.name.familyName;
    newUser.role = Role.USER;
    const user = await this.userRepository.save(newUser);
    const createTokenResponse = await firstValueFrom(
      this.tokenClient.send('token_create', JSON.stringify(user)),
    );
    delete user.password;
    return {
      ...createTokenResponse,
      user,
    };
  }
}
