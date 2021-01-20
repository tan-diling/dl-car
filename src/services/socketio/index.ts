import { useChatBot } from "./chat.service"

import * as http from 'http';
import ServerIO = require("socket.io");

export function initChatSocket( server: http.Server){
    const io = ServerIO(server,{
        // path:'/intakebot',
    });

    useChatBot(io);
}


 