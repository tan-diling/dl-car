import ServerIO = require("socket.io");

import { UserService } from '../user.service';
import { logger } from '@app/config';
import { Container } from 'typedi';
import { ChatContext, ChatProcessor } from './socket.service';

const userService = Container.get(UserService) ;

export const enum ChatEvent {    
    REQUEST = 'chat-request',
    REQUEST_ACK = 'chat-request-ack',
    RESPONSE = 'chat-response',
    NOTIFICATION = 'notification',
}


const chatProcessor = new ChatProcessor();

const chatContextArray :ChatContext[] =[] ;

export const chatBot = async (socket: ServerIO.Socket) => {
    console.log("Connected socket.id %s.", socket.id);

    const id = socket.handshake.query['token'];
    const user = await userService.getById(id);
    if (user == null) {
        logger.error("chat connect error NOTFOUND", id);
        socket.error("token error");
        return;
    }

    const ctx = new ChatContext(user._id);
    chatContextArray.push(ctx) ;
    ctx.callback = (error, data) => {
        if (!error) {
            const ev = data?.event || data?.topic;
            const msg = data?.message || data?.body;
            socket.emit(ev, msg);
        }
    }



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


    socket.on(ChatEvent.REQUEST, async (m) => {
        console.log("[server](message): %s --", socket.id, JSON.stringify(m));

        await logChatMessage(ChatEvent.REQUEST, m);

        const ret = await chatProcessor.process(ctx, m);
        if ( ret ) {
            socket.emit(ChatEvent.RESPONSE, ret);
            await logChatMessage(ChatEvent.RESPONSE, ret);
        }
    });

    socket.on("disconnect", () => {
        console.log("socket.id disconnected %s", socket.id);

        const i = chatContextArray.indexOf(ctx) ;
        if(i>=0){
            delete chatContextArray[i] ;
        }
    });
};

export const useChatBot = (io: ServerIO.Server) => {
    io
        .of('/api/notification')
        .on('connect', chatBot);

        // Visitor.on('updated',visitor=>{
        //     console.log(visitor) ;
        //     chatContextArray.forEach(x => {
        //         if(String(x.visitor)== String(visitor._id)) {
        //             x.client = visitor.user ;
        //             console.log("visitor.updated");
        //         }    
        //     });
            
        // })
}
