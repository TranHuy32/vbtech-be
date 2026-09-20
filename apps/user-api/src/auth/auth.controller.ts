import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TransformResponseInterceptor } from '@app/core/interceptors/transform-response.interceptor';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/response-login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Public } from '@app/core/decorators';
import { JwtAuthGuard } from './guard/jwt.guard';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
@UseInterceptors(TransformResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Patch('update-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Req() req: any, @Body() dto: UpdatePasswordDto) {
    return await this.authService.updatePassword(req.user.id, dto);
  }
}
