import { User } from 'src/database/entities/user.entity';

export interface IAuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}
