import { IsEmail, IsOptional, IsString, isString } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  destination: string;

  @IsString()
  @IsOptional()
  customCode?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
}
