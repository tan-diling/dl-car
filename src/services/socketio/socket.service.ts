import ServerIO = require("socket.io");
import { transformAndValidate } from 'class-transformer-validator';

import { EventEmitter } from 'events';
import { SchemaTypes, Types } from 'mongoose';
import { logger } from '@app/config';

/**
 * chat context
 * - __visitor__ chat visitor id 
 * - __client__ chat client id ,if a visitor fill a form 
 */
export class ChatContext {

    constructor(
        public user: Types.ObjectId
    ) {
    }

    callback: (error: any, data: { event: string, message: any } | any) => any;
    [k: string]: any;
}

interface ChatProcessFunction {
    (ctx: ChatContext, data): any
}

interface ContextInterface {
    user: { name: string, id: string };
    time: Date;
    timezone: Number;
    conversation: string;
    version: number;
    requestId: string;
}


interface TextChatMessage extends ChatMessageInterface {
    text: string;
}

interface ImageChatMessage extends ChatMessageInterface {
    url: string;
}

interface ReadChatMessage extends ChatMessageInterface {
    time: Date;
}

enum ChatMessageType {
    TEXT = "text",
    IMAGE = "image",
    TYPING = "typing",
    READ = "read"
};
interface ChatMessageInterface {
    context: ContextInterface;
    type: ChatMessageType;
    data: TextChatMessage | ImageChatMessage | ReadChatMessage
}


/**
 * register chat action process function
 * - event action can register a process function
 * - if not register ,processed default(no handle);
 * @param processMap 
 */
function configChatProcessMap(processMap: Map<string, ChatProcessFunction>) {

    /**tracking process */
    processMap.set(ChatMessageType.TEXT, async (ctx: ChatContext, msg: ChatMessageInterface) => {
        return null;
        // const req = await AIService.makeAiRequest(msg) ;
        // return await AIService.postAiRequest(req) ;
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
     * process chat bot client request with AI ,
     * 1. check client message 
     * 1. validate message
     * 1. convert message to ai request format
     * 1. request to AI  ,
     * 1. process AI response
     *   1.1 process error
     *   1.1 log AI Request Log (system_log)
     * 1. pass through response to client
     * 
     * @param ctx {@link ChatContext}
     * @param msg 
     */
    async process(ctx: ChatContext, msg: any) {
        return null ;
        // try {
        //     const dto = await transformAndValidate(ChatRequestDto, msg,
        //         {
        //             validator: { whitelist: true },
        //         },
        //     ) as ChatRequestDto;

        //     // ctx.callback
        //     //this.emit(ChatEvent.REQUEST_ACK, { user_data: dto.user_data });
        //     if (ctx.callback) {
        //         ctx.callback(null, { event: ChatEvent.REQUEST_ACK, message: { user_data: dto.user_data } })
        //     }



        //     const func = this.getProcessorFunction([`_id.${dto.action_id}`, dto.origin_action?.type]);
        //     if (func) {
        //         const ret = await func(ctx, msg);
        //         if (ret === undefined) {
        //             const client = ctx.client;

        //             const ai_req = await AIService.makeAiRequest(msg, client);

        //             console.log('AIUser :' + JSON.stringify(ai_req.user));

        //             const ai_res = await AIService.postAiRequest(ai_req);

        //             // this.ctx.set('ai_request', { ai_req, ai_res });

        //             logger.info(`ai_request ${ai_req} ${ai_res}`);

        //             return ai_res;
        //         }
        //         return ret;
        //     } else {
        //         const error = `chat unknown action type:${dto.origin_action?.type}`;

        //         logger.info(error);

        //         return { error, ...msg };
        //     }

        // }
        // catch (err) {

        //     logger.error('chat-req error', err)
        //     if (err instanceof Error) {
        //         return { error: err.message };
        //     } else {
        //         return { error: err };
        //     }

        // }
    }
}