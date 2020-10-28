import ServerIO = require("socket.io");

import { UserService } from '../user.service';
import { logger } from '@app/config';
import { Container } from 'typedi';
import { ChatContext, ChatProcessor, ChatMessageTopic } from './message.socket.service';
import { ConversationService } from '../conversation.service';

const userService = Container.get(UserService);

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

    // ctx.callback = (error, data) => {
    //     if (!error) {
    //         const ev = data?.event || data?.topic;
    //         const msg = data?.message || data?.body;
    //         socket.emit(ev, msg);
    //     }
    // }

    await ctx.processMessageUnsent();

    await ctx.bindEvent();

    socket.on("disconnect", () => {
        console.log("socket disconnected %s", socket.id);

        ctx.remove();

    });
};

export const useChatBot = (io: ServerIO.Server) => {
    io
        .of('/api/notification')
        .on('connect', chatBot);

}
