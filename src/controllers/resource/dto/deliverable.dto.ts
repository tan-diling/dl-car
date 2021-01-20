import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, IsAlphanumeric, IsUppercase, MinLength, MaxLength, IsNumber, Max } from 'class-validator';
import { ProjectRole } from '@app/defines';
import { Type } from 'class-transformer';
import { types } from '@typegoose/typegoose';
import { BaseCreateDto, BaseUpdateDto } from './base.dto';
import { ProjectStatus } from '@app/defines/projectStatus';

export class DeliverableCreateDto extends BaseCreateDto {        

    @IsNumber()
    @Max(10)
    @Min(0)
    @IsOptional()
    severity? :number;
  
    @IsNumber()
    @Max(10)
    @Min(0)
    @IsOptional()
    priority? :number;  
  
    @IsString({each:true})
    @IsOptional()
    tags? :string[]; 
}

export class DeliverableUpdateDto extends BaseUpdateDto {    

    @IsNumber()
    @Max(10)
    @Min(0)
    @IsOptional()
    severity? :number;
  
    @IsNumber()
    @Max(10)
    @Min(0)
    @IsOptional()
    priority? :number;  
  
    @IsString({each:true})
    @IsOptional()
    tags? :string[]; 
}
