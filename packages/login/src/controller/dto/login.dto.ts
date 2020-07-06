import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class LoginDto{
    @IsString()
    device: string;    

    @IsEmail()
    email: string;    

    @IsString()
    password: string;    
}

export class RefreshTokenDto {
    @IsString()
    refresh_token: string;    

}