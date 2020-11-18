import ServerIO = require("socket.io");

import { UserService } from '../user.service';
import { logger } from '@app/config';
import { Container } from 'typedi';
import { ChatContext, ChatProcessor, ChatMessageTopic } from './message.socket.service';
import { ConversationService } from '../conversation.service';

const userService = Container.get(UserService);

export const chatBot = async (socket: ServerIO.Socket) => {
    const nsp = socket.nsp;
    console.log("socket connected  %s. size: %s", socket.id, Object.keys(nsp.sockets).length);


    const id = socket.handshake.query['token'];
    const user = await userService.getByToken(id);
    if (user == null) {
        logger.error("chat connect error NOTFOUND", id);
        socket.error("token error");
        socket.disconnect();
        return;
    }

    const ctx = new ChatContext(user._id, socket);

    socket.on("disconnect", () => {
        console.log("socket disconnected %s. size: %s", socket.id, Object.keys(nsp.sockets).length);

        ctx.remove();

    });

    // await ChatContext.processUnsentMessage();

    await ctx.bindEvent();
};

export const useChatBot = (io: ServerIO.Server) => {
    io
        .of('/api/chatbot')
        .on('connect', chatBot);

    ChatContext.startMessageProcess();

}
