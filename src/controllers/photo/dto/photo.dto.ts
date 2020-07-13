import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum } from 'class-validator';
export class PhotoDto {
    @IsString()
    @IsOptional()
    name?:string;

    @IsString()
    @IsOptional()
    album?:string;

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
