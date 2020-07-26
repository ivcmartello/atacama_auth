/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {
  Injectable,
  Inject,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

const logger = new Logger('Auth');

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_CLIENT')
    private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.client
        .send({ role: 'user', cmd: 'get' }, { username })
        .pipe(
          timeout(5000),
          catchError(error => {
            if (error instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(error);
          }),
        )
        .toPromise();

      if (user && compareSync(password, user?.password)) {
        return user;
      }

      return null;
    } catch (error) {
      logger.log(error);
      throw error;
    }
  }

  login(user: any) {
    const payload = { user, sub: user.id };

    return {
      userId: user.id,
      accessToken: this.jwtService.sign(payload),
    };
  }

  validateToken(jwt: string) {
    const verified_token = this.jwtService.verify(jwt);
    const user = this.jwtService.decode(jwt)['user'];

    delete user.password;

    return { user, validation: verified_token };
  }
}
