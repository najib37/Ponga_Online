import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
  IsEmpty,
  IsOptional,
  Equals,
  IsAlphanumeric,
} from 'class-validator'

export class CreateUserDto {

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  @IsAlphanumeric()
  username: string;


  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  avatar: string;
}
