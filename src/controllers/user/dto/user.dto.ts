import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

enum UserCreateRole {
    // admin='admin',
    client = 'client',
    staff = 'staff',
}

export class UserCreateDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum(UserCreateRole)
    @IsOptional()
    role?: string;
}


export class EmailExistDto {
    
    @IsEmail()
    email: string;
}

export class UserUpdateDto {
    @IsString()
    name?: string;

    @IsEnum(UserCreateRole)
    role?: string;

    @IsString()
    logo?: string;

    @IsString()
    company?: string;

    @IsString()
    job?: string;

    @IsString()
    phone?: string;

    @IsString()
    department?: string;
}