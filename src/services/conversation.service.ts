import { DocumentType } from '@typegoose/typegoose';
import { ModelQueryService } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import { UserModel, User } from '../models/user';
import { Types, CreateQuery } from 'mongoose';
import { Message, ConversationModel, MessageModel, ConversationMemberModel, ConversationMember, Conversation, PendingMessageModel, PendingMessage } from '@app/models';
import { DbService } from './db.service';
import { logger } from '@app/config';
import moment = require('moment');
import { ChatMessageTopic } from './socketio/message.socket.service';

/**
 * user service
 */
export class ConversationService {

    private queryService = new ModelQueryService();
    constructor() {
    }

    /**
     * get conversation list 
     * @param userId user id
     */
    async listByUser(user: Types.ObjectId) {
        const cms = await ConversationMemberModel.find({ user, isDeleted: false }).exec();
        return ConversationModel.find().where("_id").in(cms.map(x => x.conversation))
            .populate({
                path: 'members',
                populate: {
                    select: 'email name image',
                    path: 'user',
                }
            })
            .populate({
                path: "lastMessage"
            })
            .exec();
    }

    /**
     * get conversation by id 
     * 
     */
    async getById(id: string | Types.ObjectId) {
        return await ConversationModel
            .findById(id)
            .populate({
                path: 'members',
                populate: {
                    select: 'email name image',
                    path: 'user',
                }
            })
            .populate({
                path: "lastMessage"
            })
            .exec();
    }

    // async listConversationStatisticsByUser2(user: string | Types.ObjectId) {
    //     const ret = await ConversationMemberModel.find(
    //         {
    //             user,
    //             isDeleted: false
    //         }
    //     )
    //         .populate('unread')
    //         .exec();

    //     return ret.map(x => {
    //         return {
    //             conversation: x.conversation,
    //             unread: x.unread,
    //         }
    //     });

    // }

    async listConversationStatisticsByUser(user: string | Types.ObjectId) {
        const userId = new Types.ObjectId(user);
        const aggr =
            [{
                $match: {
                    user: userId,
                }
            }, {
                $lookup: {
                    from: 'messages',
                    localField: 'conversation',
                    foreignField: 'conversation',
                    as: 'messages'
                }
            }, {
                $unwind: {
                    path: "$messages"
                }
            }, {
                $project: {
                    conversation: 1,
                    read: {
                        $gte: ["$readAt", "$messages.sendAt"]
                    }
                }
            }, {
                $group: {
                    _id: "$conversation",
                    total: {
                        $sum: 1
                    },
                    unread: {
                        $sum: {
                            $cond: ["$read", 0, 1]
                        }
                    }
                }
            }];

        return ConversationMemberModel.aggregate(aggr).exec();
    }


    async listMessage(query) {
        return await DbService.list(MessageModel, query);
    }

    /**
     * create an new group conversation
     * @param dto 
     */
    async createGroupConversation(data: { title: string, image?: string }) {
        const conversation = await ConversationModel.create({ ...data, isGroup: true });
        return conversation;
    }

    /**
     * update conversation info
     * @param id 
     * @param data 
     */
    async updateConversation(
        id: string | Types.ObjectId,
        data: { title: string, image?: string },
        sender: string
    ) {
        const conversation = await ConversationModel.findById(id).exec();
        if (conversation) {
            conversation.title = data.title;
            conversation.image = data.image;
            await conversation.save();
            await this.createActionMessage({ conversation: id, type: 'updated', sender, user: sender, ...data }, false);
            return conversation;
        }
    }

    /**
     * append conversation member
     * @param id conversation id
     * @param users 
     */
    async appendMember(id: string | Types.ObjectId, users: string[], sender: string) {
        const conversation = await ConversationModel.findById(id).exec();
        if (conversation) {
            if (!conversation.isGroup) {
                throw new NotAcceptableError('not group conversation error');
            }

            for (const user of users) {
                let member = await ConversationMemberModel.findOne({ user: user, conversation: conversation._id }).exec();
                if (member == null) {
                    const userModel = await UserModel.findById(user).exec();
                    if (userModel == null) {
                        continue;
                    }
                    member = await ConversationMemberModel.create({ user: user, conversation: conversation._id });

                } else {
                    if (member.isDeleted) {
                        member.enterAt = new Date();
                        member.isDeleted = false;
                        await member.save();
                    }
                }

                await this.createActionMessage({ conversation: id, type: 'enter', time: member.enterAt, sender, user });
            }

            return conversation;
        }
    }

    /**
     * remove conversation member
     * @param id conversation id
     * @param users 
     */
    async removeMember(id: string | Types.ObjectId, users: string[], sender: string) {
        const conversation = await ConversationModel.findById(id).exec();
        if (conversation) {
            if (!conversation.isGroup) {
                throw new NotAcceptableError('not group conversation error');
            }

            for (const user of users) {
                const member = await ConversationMemberModel.findOne({ user: user, conversation: conversation._id }).exec();
                if (member) {
                    member.leaveAt = new Date();
                    member.isDeleted = true;
                    await member.save();
                    await this.createActionMessage({ conversation: id, type: 'leave', time: member.leaveAt, sender, user });
                }
            }

            return conversation;
        }
    }

    /**
     * get one to one conversation by user,if not exists ,create it 
     * @param user1 user id
     * @param user2 user id
     */
    async getUserConversation(user1: string | Types.ObjectId, user2: string | Types.ObjectId) {
        const conversationList = await ConversationModel.find({ isGroup: false }).populate('members').exec();
        for (const conversation of conversationList) {
            const members = conversation.members as Array<ConversationMember>;
            const user1Member = members.find(x => String(x.user) == String(user1));
            const user2Member = members.find(x => String(x.user) == String(user2));

            if (user1Member != null && user2Member != null) {
                return conversation;
            }
        }

        const conversation = await ConversationModel.create({ isGroup: false })

        await ConversationMemberModel.create({ user: user1, conversation: conversation._id });
        await ConversationMemberModel.create({ user: user2, conversation: conversation._id });

        return conversation;
    }

    private async createMessage(data: CreateQuery<DocumentType<Message>>, save: boolean = true) {
        const conversation = await ConversationModel.findById(data.conversation).populate('members').exec();
        if (conversation) {

            const message = new MessageModel({ ...data });

            if (save == true) {
                await message.save();

                conversation.lastMessageTime = message.sendAt;
                conversation.lastMessageSeq = message.seq;

                await conversation.save();
                MessageModel.emit('created', message);

            }

            const pendingMessages = (conversation.members as Array<ConversationMember>)
                .filter(x => x.isDeleted != true)
                .map(x => {
                    return {
                        receiver: x.user,
                        topic: ChatMessageTopic.MESSAGE,
                        message,
                    };
                });

            const pendingMessageArray = await PendingMessageModel.create(pendingMessages);
            PendingMessageModel.emit('created', pendingMessageArray);

            return message;


        }
    }

    async createTextMessage(dto: { conversation: string | Types.ObjectId, text: string, sender: string | Types.ObjectId }) {
        const { conversation, sender, ...data } = dto;
        return await this.createMessage({ conversation, sender, type: 'text', data });

    }


    async createImageMessage(dto: { conversation: string | Types.ObjectId, url: string, sender: string | Types.ObjectId }) {
        const { conversation, sender, ...data } = dto;
        return await this.createMessage({ conversation, sender, type: 'image', data });
    }


    async createActionMessage(
        dto: {
            conversation: string | Types.ObjectId,
            sender: string | Types.ObjectId,
            user?: string | Types.ObjectId,
            time?: Date,
            title?: string,
            image?: string,
            type: "enter" | "leave" | "read" | "typing" | "updated" | string
        },
        save = true
    ) {
        let { conversation, sender, ...data } = dto;
        // const save = data.type == 'enter' || 'leave' == data.type;
        if ('enter' == data.type) {
            const user = await UserModel.findById(data.user).exec();

            return await this.createMessage({ conversation, sender, type: 'action', data: { ...data, enterUser: user?.getBaseInfo() } }, save);

        } else {
            return await this.createMessage({ conversation, sender, type: 'action', data }, save);
        }
    }


    //
    async updateMessageAsRead(dto: { conversation: string | Types.ObjectId, user: string | Types.ObjectId, time: Date }) {
        const { conversation, user, time } = dto;
        await ConversationMemberModel.findOneAndUpdate({ conversation, user }, { readAt: time }).exec();
        // await ConversationMemberModel.findOneAndUpdate({conversation,user},{readAt:time}).exec() ;
        // return await this.createMessage({ conversation, sender, type: 'action', data });
    }

    /**
     * query user unsent messages;
     * @param user user id
     */
    async processPendingMessage(user: string | Types.ObjectId, callback: (doc: DocumentType<PendingMessage>) => Promise<boolean>) {


        const idString = String(user);

        const messageList = await PendingMessageModel
            .find({
                receiver: user,
                sendCount: { $lt: 1 },
                sendAt: { $lt: new Date() },
            })
            .sort('-_id')
            .exec();

        if (messageList.length > 0) {
            logger.info(`processPendingMessage ${user} count:${messageList.length}`);
            for (const message of messageList) {

                const ret = await callback(message);

                if (ret) {

                    message.sendCount = message.sendCount + 1;

                    message.sendAt = moment().add(10, 'second').toDate();

                    await message.save();
                }

            }
        }
    }

    async updateMessageSent(messageId: string | Types.ObjectId, user: string | Types.ObjectId) {

        const idString = String(user);

        const message = await MessageModel.findById(messageId).exec();

        if (message) {
            await ConversationMemberModel.findOneAndUpdate(
                {
                    user: user,
                    conversation: message.conversation,
                    deliverAt: { $lt: message.createdAt },
                },
                {
                    deliverAt: message.createdAt
                },
            ).exec();


        }
    }


}