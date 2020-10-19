import { prop, Ref, plugin, getModelForClass, getDiscriminatorModelForClass, modelOptions } from '@typegoose/typegoose';

import { User } from './user';
import { Types } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';


@modelOptions({ options: { allowMixed:0}})
export class Conversation {  
    @prop({ref:()=>User,type:[Types.ObjectId]})
    users: Ref<User>[] ;

    @prop({})
    title: string;

    @prop({ default: false })
    isGroup?: boolean;

    @prop()
    createdAt?: Date;

    @prop()
    updatedAt?: Date;
 
}

export class ConversationMember {  
    @prop({ref:()=>Conversation, type:Types.ObjectId})
    Conversation: Ref<Conversation> ;

    @prop({ref:()=>User})
    user: Ref<User> ;

    @prop({ default: false })
    isDeleted?: boolean;

    @prop({default:Date.now})
    readAt?: Date;

    @prop({default:Date.now})
    joinAt?: Date;

    @prop()
    removeAt?: Date; 
}


export class Message {  
    @prop({ref:()=>Conversation, type:Types.ObjectId})
    Conversation: Ref<Conversation> ;

    @prop({ref:()=>User,type:Types.ObjectId})
    sender: Ref<User> ;

    @prop({})
    type: string;

    @prop({default:Date.now})
    sendAt?: Date;

    @prop()
    createdAt?: Date;

    @prop()
    updatedAt?: Date; 
}

export class TextMessage extends Message {  
    @prop({})
    text: string;    
}

export class ImageMessage extends Message {  
    @prop({})
    image: string;    
}

export const ConversationModel = getModelForClass(Conversation,{schemaOptions:{timestamps:true}});

export const MessageModel = getModelForClass(Message,{schemaOptions:{timestamps:true}});
