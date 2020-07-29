import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, MaxLength, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { GroupRole } from '../../constant';


export class GroupCreateDto {
    @IsString()
    @MaxLength(24)
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsMongoId()
    @IsOptional()
    owner?: string;

}


export class GroupMemberDto {
    @IsEmail()    
    email: string;

    @IsEnum(GroupRole)
    groupRole: string;
}


export class GroupUpdateDto {
    @MaxLength(24)
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description: string;

    @ValidateNested()    
    @Type(()=>GroupMemberDto)
    @IsOptional()
    members?: GroupMemberDto[]
   
}