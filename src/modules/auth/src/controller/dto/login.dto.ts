import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class LoginDto {
    @IsString()
    device: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LogoutDto {
    @IsString()
    device: string;
}

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    refresh_token: string;

}