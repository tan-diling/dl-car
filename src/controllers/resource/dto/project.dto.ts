import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum } from 'class-validator';
export class ProjectDto {
    
    @IsString()
    @IsOptional()
    folder?:string;

    @IsString()
    @IsOptional()
    title?:string;

    @IsString()
    @IsOptional()
    description?:string;

    @IsString()
    @IsOptional()
    type?:string;


}
