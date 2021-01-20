import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, MaxLength, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { GroupRole, MemberStatus, ActionStatus } from '@app/defines';

export class ActionStatusDto {
    
    @IsEnum(ActionStatus)
    status: ActionStatus;    
}


// export class InvitationDto {
//     @IsEmail()
//     email: string;



// }

// export class ContactInvitationDto extends InvitationDto {
    
// }

// export class GroupInvitationDto extends InvitationDto {
//     @IsMongoId()
//     groupId:string ;

//     @IsString()
//     groupRole:string ;
// }

// export class ProjectInvitationDto extends InvitationDto {
//     @IsMongoId()
//     projectId:string ;

//     @IsString()
//     projectRole:string ;
// }