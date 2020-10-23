import { prop, Ref, plugin, getModelForClass, getDiscriminatorModelForClass, modelOptions } from '@typegoose/typegoose';

import { User } from './user';
import { Types } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { text } from 'body-parser';

@modelOptions({ options: { allowMixed:0}})
export class Conversation {  
    @prop({})
    image?: string ;

    @prop({})
    title?: string;

    @prop({ default: false })
    isGroup?: boolean;

    @prop()
    createdAt?: Date;

    @prop()
    updatedAt?: Date;

    @prop({ 
      ref:'ConversationMember',
      localField:"_id",
      foreignField:"conversation",    
    })
    members?: Ref<ConversationMember>[];
   
}

export class ConversationMember {  
    @prop({ref:()=>Conversation, type:Types.ObjectId})
    conversation: Ref<Conversation> ;

    @prop({ref:()=>User})
    user: Ref<User> ;
    
    @prop({default:Date.now})
    readAt?: Date;

    @prop({default:Date.now})
    enterAt?: Date;

    @prop()
    leaveAt?: Date; 

    @prop({ default: false })
    isDeleted?: boolean;

    @prop()
    createdAt?: Date;

    @prop()
    updatedAt?: Date; 
}


const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
@plugin(AutoIncrement, {id: 'conversation_seq', inc_field: 'seq', reference_fields: ['conversation'] })
export class Message {  
    @prop({ref:()=>Conversation, type:Types.ObjectId})
    conversation: Ref<Conversation> ;

    @prop()
    seq?: number ;

    @prop({ref:()=>User,type:Types.ObjectId})
    sender: Ref<User> ;

    @prop({})
    type: string;

    @prop({})
    data: any;

    @prop({default:Date.now})
    sendAt?: Date;

    @prop()
    createdAt?: Date;

    @prop()
    updatedAt?: Date; 

   
}

// export class TextMessage extends Message {  
//     @prop({})
//     text: string;    
// }

// export class ImageMessage extends Message {  
//     @prop({})
//     image: string;    
// }

export const ConversationModel = getModelForClass(Conversation,{schemaOptions:{timestamps:true}});

export const ConversationMemberModel = getModelForClass(ConversationMember,{schemaOptions:{timestamps:true}});

export const MessageModel = getModelForClass(Message,{schemaOptions:{timestamps:true}});
