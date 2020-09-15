import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, IsAlphanumeric, IsUppercase, MinLength, MaxLength } from 'class-validator';
import { ProjectRole } from '@app/defines';
import { Type } from 'class-transformer';
import { types } from '@typegoose/typegoose';

export class BaseCreateDto {    
    
    @IsString()
    @IsOptional()
    title:string;

    @IsString()
    @IsOptional()
    description?:string;
    
    @Min(0)
    @IsOptional()
    estimate? :number;
  
    @IsDate()
    @IsOptional()
    @Type(()=>Date)
    deadline? :Date;    

}

export class BaseUpdateDto extends BaseCreateDto {    

    @IsMongoId({each:true})
    @IsOptional()
    assignee?: string[]
}