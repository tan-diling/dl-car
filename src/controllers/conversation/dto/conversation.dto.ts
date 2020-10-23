import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, MaxLength, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { GroupRole, MemberStatus, ActionStatus } from '@app/defines';

export class ConversationDto {
        
    @IsString()
    title: string;    

    @IsString()
    @IsOptional()
    image?: string;    


    @IsMongoId({each:true})
    users?: string[];    
}

export class UpdateConversationDto {
        
    @IsString()
    title: string;    

    @IsString()
    @IsOptional()
    image?: string;    


}


export class ConversationUserDto {
        
    @IsMongoId()
    user: string;    
}
