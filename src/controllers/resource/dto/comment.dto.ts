import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, IsAlphanumeric, IsUppercase, MinLength, MaxLength, IsNumber, Max } from 'class-validator';
import { ProjectRole } from '@app/defines';
import { Type } from 'class-transformer';
import { types } from '@typegoose/typegoose';
import { BaseCreateDto, BaseUpdateDto } from './base.dto';
import { ProjectStatus } from '@app/defines/projectStatus';

export class CommentCreateDto {

    @IsString()
    title: string;
    
    @IsString()
    @IsOptional()
    description?:string;
}

export class CommentUpdateDto extends CommentCreateDto {


}
