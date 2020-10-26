import ServerIO = require("socket.io");
import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, MaxLength, IsBoolean, IsUrl } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';

import { EventEmitter } from 'events';
import { SchemaTypes, Types } from 'mongoose';
import { logger } from '@app/config';
import { ConversationService } from '../conversation.service';
import { Container } from 'typedi';
import { Type } from 'class-transformer';
import { MessageModel } from '@app/models';


const conversationService = Container.get(ConversationService)
/**
 * chat context
 */
export class ChatContext {

    constructor(
        public user: Types.ObjectId,
        public socket
    ) {
    }

    callback: (error: any, data: { event: string, message: any } | any) => any;
    [k: string]: any;

    async processMessageUnsent() {
        await conversationService.processUserMessageUnSent(this.user, async doc => {

            this.socket.emit(ChatMessageTopic.MESSAGE, doc);

        });
    }
}

export const chatContextArray: ChatContext[] = [];

interface ChatProcessFunction {
    (ctx: ChatContext, data): any
}

type ContextInterface = {
    user?: { name: string, id: string };
    timezone?: number;
    time: Date;
    version: number | string;
    requestId: string;
}

class MessageData {
    @IsMongoId()
    user: string;

    @IsMongoId()
    conversation: string;

    @IsMongoId()
    @IsOptional()
    message?: string;

    //type:text
    @IsString()
    @IsOptional()
    text?: string;

    //type:image

    @IsUrl()
    @IsOptional()
    url?: string;
    //type:action

    @IsString()
    @IsOptional()
    type?: string

    @IsDate()
    @IsOptional()
    time?: Date;
}


export const enum ChatMessageTopic {
    REQUEST = 'chat-request',
    REQUEST_ACK = 'chat-request-ack',
    RESPONSE = 'chat-response',
    MESSAGE = 'chat-message',
    NOTIFICATION = 'notification',
}

enum ChatMessageType {
    TEXT = "text",
    IMAGE = "image",
    ACTION = "action",
};


// const sendUserMessage = async (user: string | Types.ObjectId, message) => {
//     for (const ctx of chatContextArray) {
//         if (String(ctx.user) == String(user)) {
//             ctx.socket.emit(ChatMessageTopic.MESSAGE, message);

//             await conversationService.updateMessageSent(message._id,user);

//         }
//     }
// }



class ChatRequestDto {
    @IsOptional()
    context: ContextInterface;

    @IsEnum(ChatMessageType)
    type: ChatMessageType;

    // @IsOptional()
    @Type(() => MessageData)
    @ValidateNested()
    data: MessageData;
}


/**
 * register chat action process function
 * - event action can register a process function
 * - if not register ,processed default(no handle);
 * @param processMap 
 */
function configChatProcessMap(processMap: Map<string, ChatProcessFunction>) {

    /**text process */
    processMap.set(ChatMessageType.TEXT, async (ctx: ChatContext, msg: ChatRequestDto) => {
        // return null;
        const { conversation, text } = msg.data;
        const sender = ctx.user;
        const req = await conversationService.createTextMessage({ sender, conversation, text });

        return req;
    });

    /**image process */
    processMap.set(ChatMessageType.IMAGE, async (ctx: ChatContext, msg: ChatRequestDto) => {
        // return null;
        const { conversation, url } = msg.data;
        const sender = ctx.user;
        const req = await conversationService.createImageMessage({ sender, conversation, url });
        return req;
    });

    /**action process */
    processMap.set(ChatMessageType.ACTION, async (ctx: ChatContext, msg: ChatRequestDto) => {
        // return null;
        const { user, conversation, time, type } = msg.data;
        const sender = ctx.user;
        if (type == "read") {

            await conversationService.updateMessageAsRead({ conversation, user: sender, time });
            const req = await conversationService.createActionMessage({ sender, user, conversation, time, type });

            return req;
        }

        // if(type=="enter"){
        //     const req = await conversationService.createActionMessage({ sender, user, conversation, time, type });
        //     return req;
        // }

        // if(type=="leave"){
        //     const req = await conversationService.createActionMessage({ sender, user, conversation, time, type });
        //     return req;
        // }
    });

}

/**
 * chat process class
 */
export class ChatProcessor extends EventEmitter {
    /**
     *    
     */
    chatProcessorMap = new Map<string, ChatProcessFunction>();

    constructor() {
        super()
        configChatProcessMap(this.chatProcessorMap);


        MessageModel.on('created', async msg => {
            console.log(msg);
            for (const ctx of chatContextArray) {
                await ctx.processMessageUnsent();
            }
        });
    }

    getProcessorFunction(actions: Array<string>) {
        for (const key of actions) {
            const fun = this.chatProcessorMap.get(key);
            if (fun)
                return fun;

        }
        // return null ;

    }


    /**
     * 
     * @param ctx {@link ChatContext}
     * @param msg 
     */
    async process(ctx: ChatContext, msg: any) {
        try {
            const dto = await transformAndValidate(ChatRequestDto, msg,
                {
                    validator: { whitelist: true },
                },
            ) as ChatRequestDto;

            // ctx.callback
            //this.emit(ChatEvent.REQUEST_ACK, { user_data: dto.user_data });
            // if (ctx.callback) {
            //     ctx.callback(null, { event: ChatMessageTopic.REQUEST_ACK, message: { user_data: dto.user_data } })
            // }



            const actionType = `${dto.type}`;
            const func = this.getProcessorFunction([actionType]);
            if (func) {
                const ret = await func(ctx, msg);

                return ret;
            } else {
                const error = `unknown message type:${actionType}`;

                logger.info(error);

                return { error, ...msg };
            }

        }
        catch (err) {

            logger.error('chat-req error', err)
            if (err instanceof Error) {
                return { error: err.message };
            } else {
                return { error: err };
            }

        }
    }
}