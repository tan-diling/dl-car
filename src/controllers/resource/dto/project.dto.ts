import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, IsAlphanumeric, IsUppercase, MinLength, MaxLength, IsNumber } from 'class-validator';
import { ProjectRole } from '@app/defines';
import { Type } from 'class-transformer';
import { ProjectStatus } from '@app/defines/projectStatus';
export class ProjectCreateDto {    
    @IsString()
    @IsAlphanumeric()
    @IsUppercase()
    @MinLength(2)
    @MaxLength(8)
    key:string;

    @IsString()
    title:string;

    @IsString()
    description:string;

    @IsString()
    @IsOptional()
    logo? :string;

}

export class ProjectMemberDto {
    @IsMongoId()
    userId: string;
  
    
    @IsEnum(ProjectRole)
    projectRole :string;
  }


export class ProjectMemberUpdateDto {
    
    @IsEnum(ProjectRole)
    projectRole :string;
}  


export class ProjectUpdateDto {    
    @IsString()
    @IsAlphanumeric()
    @IsUppercase()
    @MinLength(2)
    @MaxLength(8)
    @IsOptional()
    key?:string;

    @IsString()
    @IsOptional()
    title?:string;

    @IsString()
    @IsOptional()
    description?:string;

    @IsString()
    @IsOptional()
    logo? :string;

    @Min(0)
    @IsOptional()
    estimate? :number;
  
    @IsDate()
    @IsOptional()
    @Type(()=>Date)
    deadline? :Date;

    @ValidateNested()    
    @Type(()=>ProjectMemberDto)
    @IsOptional()
    member?: ProjectMemberDto[]
}

export class ProjectMemberConfirmDto {
    // @IsMongoId()    
    // userId: string;

    @IsString()
    @IsOptional()
    status?:string ;
}


export class StatusDto {   
    @IsEnum(ProjectStatus) 
    // @IsNumber()   
    status: ProjectStatus;
}

