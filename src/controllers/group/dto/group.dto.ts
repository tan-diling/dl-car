import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, MaxLength, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { GroupRole, MemberStatus } from '@app/defines';


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


export class CreateGroupMemberDto {
    @IsEmail()    
    email: string;

    @IsEnum(GroupRole)
    groupRole: string;
}

export class DeleteGroupMemberDto {
    @IsEmail()    
    email: string;

}

export class GroupMemberInvitedResponseDto {
    // @IsMongoId()
    // id?: string;

    @IsEmail()    
    email: string;

    @IsString()
    @IsOptional()
    status?:string ;
}


export class GroupUpdateDto {
    @MaxLength(24)
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    // @ValidateNested()    
    // @Type(()=>GroupMemberDto)
    // @IsOptional()
    // members?: GroupMemberDto[]
   
}