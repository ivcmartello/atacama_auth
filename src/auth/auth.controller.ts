/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Controller, Post, UseGuards, Logger } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { User } from '../user/user.decorator';

const logger = new Logger('Auth');

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  login(@User() user: any) {
    return this.authService.login(user);
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  loggedIn(data: any) {
    try {
      const res = this.authService.validateToken(data.jwt);

      return res;
    } catch (error) {
      logger.log(error);
      return false;
    }
  }
}
