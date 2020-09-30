import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, MaxLength, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { GroupRole, MemberStatus, ActionStatus } from '@app/defines';


export class ContactInvitationDto {
    @IsEmail()
    email: string;
}