import { StatusAccount } from '@app/core/constants/status-account';
import { UserEntity } from '@app/core/entities/user.entity';
import { AppUnAuthorizedException, ErrorCode } from '@app/core/exceptions';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private accountRepo: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.accountRepo.findOne({
      where: { id: payload.id },
    });

    if (!user) {
      throw new AppUnAuthorizedException(ErrorCode.UNAUTHORIZED);
    }

    return user;
  }
}
