import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

/** user name rule: <first> [middle] <last> */
const RULE_USER_NAME_REGEX = /^([a-zA-Z0-9]+\s{1}[a-zA-Z0-9]{1,}|[a-zA-Z0-9]+\s{1}[a-zA-Z0-9]{3,}\s{1}[a-zA-Z0-9]{1,})$/ ;

/** phone rule  */
const RULE_PHONE_REGEX = /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/ ;

/** password rule , min length 8 ,valid chars [a-zA-Z0-9:;!@#$%^&*()-=+_~.]  */
const RULE_PASSWORD_REGEX =  /^([a-zA-Z0-9:;!@#$%^&*()-=+_~.]{6,})$/ ; 


enum UserCreateRole {
    // admin='admin',
    client = 'client',
    staff = 'staff',
    visitor = 'visitor',
}


export class VisitorUserCreateDto {
    @IsString()
    @Matches(RULE_USER_NAME_REGEX)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @Matches(RULE_PASSWORD_REGEX)
    password: string;

}

export class ChangePasswordDto {
    @IsEmail()
    email: string;

    @IsString()
    @Matches(RULE_PASSWORD_REGEX)
    oldPassword: string;


    @IsString()
    @Matches(RULE_PASSWORD_REGEX)
    newPassword: string;
}

export class UserCreateDto extends VisitorUserCreateDto {
    // @IsString()
    // @Matches(RULE_USER_NAME_REGEX)
    // name: string;

    // @IsEmail()
    // email: string;

    // @IsString()
    // @Matches(RULE_PASSWORD_REGEX)
    // password: string;

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
    @Matches(RULE_USER_NAME_REGEX)
    @IsOptional()
    name?: string;

    @IsEnum(UserCreateRole)
    @IsOptional()
    role?: string;

    @IsString()
    @IsOptional()
    logo?: string;

    @IsString()
    @IsOptional()
    company?: string;

    @IsString()
    @IsOptional()
    job?: string;

    @IsString()
    @IsOptional()
    @Matches(RULE_PHONE_REGEX)
    phone?: string;

    @IsString()
    @IsOptional()
    department?: string;
}