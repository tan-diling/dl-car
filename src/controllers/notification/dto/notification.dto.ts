import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, MaxLength, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationStatus } from '@app/defines';

export class NotificationStatusDto {
    @IsMongoId({each:true})
    ids:string[] ;
    
    @IsEnum(NotificationStatus)
    status: string;    
}

