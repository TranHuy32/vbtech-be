import {
  AppBadRequestException,
  AppUnAuthorizedException,
  ErrorCode,
} from '@app/core';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/response-login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from '@app/core/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  private generateTokens(user: UserEntity) {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password_hash')
      .where('user.username = :username', { username: loginDto.username })
      .andWhere('user.deleted_at IS NULL')
      .getOne();

    if (!user) {
      throw new AppUnAuthorizedException(ErrorCode.ACCOUNT_NOT_FOUND);
    }

    if (loginDto.password !== user.password_hash) {
      throw new AppUnAuthorizedException(ErrorCode.PASSWORD_INCORRECT);
    }

    const tokens = this.generateTokens(user);
    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    try {
      console.log(userId);

      const user = await this.usersRepository
        .createQueryBuilder('user')
        .addSelect('user.password_hash')
        .where('user.id = :userId', { userId })
        .getOne();
      if (!user) throw new AppBadRequestException(ErrorCode.ACCOUNT_NOT_FOUND);

      if (dto.oldPassword !== user.password_hash) {
        throw new AppBadRequestException(ErrorCode.PASSWORD_INCORRECT);
      }

      user.password_hash = dto.newPassword;
      await this.usersRepository.save(user);
      return { success: true };
    } catch (error) {
      if (
        error instanceof AppBadRequestException ||
        error instanceof AppUnAuthorizedException
      )
        throw error;
      throw new AppBadRequestException(ErrorCode.UPDATE_PASSWORD_FAILED);
    }
  }
}
