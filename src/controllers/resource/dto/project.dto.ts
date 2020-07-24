import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum } from 'class-validator';
export class ProjectCreateDto {    
    @IsString()
    title:string;

    @IsString()
    description:string;

    @IsString()
    @IsOptional()
    logo? :string;

}


export class ProjectUpdateDto {    
    @IsString()
    title:string;

    @IsString()
    description:string;

    @IsString()
    @IsOptional()
    logo? :string;

    @Min(0)
    @IsOptional()
    estimate? :number;
  
    @IsDate()
    @IsOptional()
    deadline? :Date;

}
