import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendTelegramMessageDto {
  @IsString()
  @MaxLength(100)
  full_name: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  company?: string;

  @IsString()
  @MaxLength(2000)
  message: string;
}
