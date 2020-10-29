import ServerIO = require("socket.io");
import { IsInt, IsMongoId, Min, ValidateNested, IsString, IsOptional, IsIn, IsEmail, IsCreditCard, Matches, IsDateString, IsObject, IsDate, IsEnum, MaxLength, IsBoolean, IsUrl } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';

import { EventEmitter } from 'events';
import { SchemaTypes, Types } from 'mongoose';
import { logger } from '@app/config';
import { ConversationService } from '../conversation.service';
import { Container } from 'typedi';
import { Type } from 'class-transformer';


const conversationService = Container.get(ConversationService)
/**
 * chat context
 */
export class ChatContext {
    static chatContextArray: ChatContext[] = [];

    static remove(ctx: ChatContext) {
        // const a = ChatContext.chatContextArray
        ChatContext.chatContextArray = ChatContext.chatContextArray.filter(x => x != ctx);
        // const i = a.indexOf(ctx);
        // if (i >= 0) {
        //     a. a[i];
        // }

        logger.info(`remove clients count ${ChatContext.chatContextArray.length} `);

    }
    static append(ctx: ChatContext) {
        const i = ChatContext.chatContextArray.indexOf(ctx);
        if (i < 0) {
            ChatContext.chatContextArray.push(ctx);
        };

        logger.info(`append clients count ${ChatContext.chatContextArray.length} `);
    }

    static sendUserMessage = async (user: string | Types.ObjectId, data: { event: string, message }) => {
        for (const ctx of ChatContext.chatContextArray) {
            if (String(ctx.user) == String(user)) {
                ctx.socket.emit(data.event, data.message);
            }
        }
    }

    static processUnsentMessage = async () => {
        const userList = ChatContext.chatContextArray.map(x => x.user);
        for (const user of userList) {
            await conversationService.processUserMessageUnSent(user, async doc => {
                await ChatContext.sendUserMessage(user, { event: ChatMessageTopic.MESSAGE, message: doc });
            });
        }
    }

    static async startMessageProcess() {
        const sleep = function (ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        console.log('startMessageProcess...');
        while (true) {
            try {
                await ChatContext.processUnsentMessage();
                await sleep(1000);
            } catch (err) {
                console.error(err);
            }
        }

    }

    constructor(
        public user: Types.ObjectId,
        public socket: ServerIO.Socket,
    ) {
        ChatContext.append(this);
    }

    remove() {
        ChatContext.remove(this);
    }

    callback: (error: any, data: { event: string, message: any } | any) => any;
    [k: string]: any;


    async bindEvent() {

        const socket = this.socket;
        const ctx = this;


        const chatProcessor = Container.get(ChatProcessor);
        // const logChatMessage = async (topic: string, body: any) => {
        //     const socket_id = socket.id;
        //     const user = ctx.user;

        //     // await MeetingService.appendChatLog({
        //     //     socket_id,
        //     //     session: session,
        //     //     topic,
        //     //     body,
        //     //     client: user,
        //     // });
        // };

        socket.on(ChatMessageTopic.REQUEST, async (m) => {

            console.log("[server](message): %s --", socket.id, JSON.stringify(m));

            // await logChatMessage(ChatMessageTopic.REQUEST, m);

            const ret = await chatProcessor.process(ctx, m);
            if (ret) {

                socket.emit(ChatMessageTopic.RESPONSE, ret);
                // await logChatMessage(ChatMessageTopic.RESPONSE, ret);
            }
        });
    }
}


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
    @Type(() => Date)
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

        return { ...req.toJSON(), context: msg.context };
    });

    /**image process */
    processMap.set(ChatMessageType.IMAGE, async (ctx: ChatContext, msg: ChatRequestDto) => {
        // return null;
        const { conversation, url } = msg.data;
        const sender = ctx.user;
        const req = await conversationService.createImageMessage({ sender, conversation, url });
        return { ...req.toJSON(), context: msg.context };
    });

    /**action process */
    processMap.set(ChatMessageType.ACTION, async (ctx: ChatContext, msg: ChatRequestDto) => {
        // return null;
        const { user, conversation, time, type } = msg.data;
        const sender = ctx.user;
        if (type == "read") {

            await conversationService.updateMessageAsRead({ conversation, user: sender, time });
            const req = await conversationService.createActionMessage({ sender, user, conversation, time, type });

            return { ...req.toJSON(), context: msg.context };
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


        // MessageModel.on('created', async msg => {
        //     console.log(msg);
        //     for (const ctx of chatContextArray) {
        //         await ctx.processMessageUnsent();
        //     }
        // });
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