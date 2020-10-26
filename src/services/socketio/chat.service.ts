import ServerIO = require("socket.io");

import { UserService } from '../user.service';
import { logger } from '@app/config';
import { Container } from 'typedi';
import { ChatContext, ChatProcessor, ChatMessageTopic, chatContextArray } from './message.socket.service';
import { ConversationService } from '../conversation.service';
import { MessageModel } from '@app/models';

const userService = Container.get(UserService);
const conversationService = Container.get(ConversationService)

const chatProcessor = new ChatProcessor();

export const chatBot = async (socket: ServerIO.Socket) => {
    console.log("socket connected  %s.", socket.id);

    const id = socket.handshake.query['token'];
    const user = await userService.getByToken(id);
    if (user == null) {
        logger.error("chat connect error NOTFOUND", id);
        socket.error("token error");
        return;
    }

    const ctx = new ChatContext(user._id, socket);
    chatContextArray.push(ctx);
    ctx.callback = (error, data) => {
        if (!error) {
            const ev = data?.event || data?.topic;
            const msg = data?.message || data?.body;
            socket.emit(ev, msg);
        }
    }

    await ctx.processMessageUnsent();

    const logChatMessage = async (topic: string, body: any) => {
        const socket_id = socket.id;
        const user = ctx.user;

        // await MeetingService.appendChatLog({
        //     socket_id,
        //     session: session,
        //     topic,
        //     body,
        //     client: user,
        // });
    };

    socket.on(ChatMessageTopic.REQUEST, async (m) => {
        console.log("[server](message): %s --", socket.id, JSON.stringify(m));

        await logChatMessage(ChatMessageTopic.REQUEST, m);

        const ret = await chatProcessor.process(ctx, m);
        if (ret) {
            // if(ret.error==null){
            //     chatContextArray.forEach(x => {
            //         if(String( x.user ) == String(ret.._id)) {
            //             x.client = visitor.user ;
            //             console.log("visitor.updated");
            //         }    
            //     });
            // }else{            
            socket.emit(ChatMessageTopic.RESPONSE, ret);
            await logChatMessage(ChatMessageTopic.RESPONSE, ret);
        }
    });

    socket.on("disconnect", () => {
        console.log("socket disconnected %s", socket.id);

        const i = chatContextArray.indexOf(ctx);
        if (i >= 0) {
            delete chatContextArray[i];
        }
    });
};

export const useChatBot = (io: ServerIO.Server) => {
    io
        .of('/api/notification')
        .on('connect', chatBot);

}
