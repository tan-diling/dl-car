import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, MaxLength, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { GroupRole, MemberStatus } from '@app/defines';


export class InvitationDto {
    @IsEmail()
    email: string;

    @IsMongoId()
    @IsOptional()
    inviter?: string;

}

export class ContactInvitationDto extends InvitationDto {
    
}

export class GroupInvitationDto extends InvitationDto {
    @IsMongoId()
    groupId:string ;

    @IsString()
    groupRole:string ;
}

export class ProjectInvitationDto extends InvitationDto {
    @IsMongoId()
    projectId:string ;

    @IsString()
    projectRole:string ;
}