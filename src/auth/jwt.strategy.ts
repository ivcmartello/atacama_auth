/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.SECRET}`,
    });
  }

  validate(payload: any) {
    return { id: payload.sub, user: payload.user };
  }
}
