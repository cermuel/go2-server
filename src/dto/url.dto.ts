import { IsString, Length, Contains } from 'class-validator';

export class ShortenURLDTO {
  @IsString({ message: 'URL must be a string' })
  @Length(10, 100)
  @Contains('https://', { message: 'Invalid URL string' })
  destination: string;
}
