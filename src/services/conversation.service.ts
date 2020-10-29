import { DocumentType } from '@typegoose/typegoose';
import { ModelQueryService } from '@app/modules/query';
import { NotFoundError, NotAcceptableError, UnauthorizedError } from 'routing-controllers';
import * as randToken from 'rand-token';
import { UserModel, User } from '../models/user';
import { RepoOperation, SiteRole } from '@app/defines';
import { Types, CreateQuery } from 'mongoose';
import { Message, ConversationModel, MessageModel, ConversationMemberModel, ConversationMember, Conversation } from '@app/models';
import { compileFunction } from 'vm';
import { timingSafeEqual } from 'crypto';
import { DbService } from './db.service';
import { logger } from '@app/config';

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
            }).exec();
    }

    /**
     * get conversation by id 
     * 
     */
    async getById(id: string | Types.ObjectId) {
        return await ConversationModel.findById(id).populate('members').exec();
    }

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
    async updateConversation(id: string | Types.ObjectId, data: { title: string, image?: string }) {
        const conversation = await ConversationModel.findById(id).exec();
        if (conversation) {
            conversation.title = data.title;
            conversation.image = data.image;
            await conversation.save();
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

            if (user1 && user2) {
                return conversation;
            }
        }

        const conversation = await ConversationModel.create({ isGroup: false })

        await ConversationMemberModel.create({ user: user1, conversation: conversation._id });
        await ConversationMemberModel.create({ user: user2, conversation: conversation._id });

        return conversation;
    }

    private async createMessage(data: CreateQuery<DocumentType<Message>>) {
        const conversation = await ConversationModel.findById(data.conversation).populate('members').exec();
        if (conversation) {
            const userStatus = new Map();
            for (const member of conversation.members) {
                userStatus.set(String((member as ConversationMember).user), 0);
            }

            const message = await MessageModel.create({ ...data, userStatus });

            conversation.lastMessageTime = message.sendAt;
            conversation.lastMessageSeq = message.seq;



            await conversation.save();

            MessageModel.emit('created', message);

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


    async createActionMessage(dto: { conversation: string | Types.ObjectId, sender: string | Types.ObjectId, user: string | Types.ObjectId, time: Date, type: "enter" | "leave" | "read" | "typing" | string }) {
        const { conversation, sender, ...data } = dto;
        return await this.createMessage({ conversation, sender, type: 'action', data });
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
    async processUserMessageUnSent(user: string | Types.ObjectId, callback) {

        logger.info(`processUserMessageUnSent ${user}`);
        const idString = String(user);

        const messageList = await MessageModel.find().where('userStatus.' + idString, 0).sort('seq').exec();

        for (const message of messageList) {
            callback(message);

            await this.updateMessageSent(message._id, idString);
        }
    }

    async updateMessageSent(messageId: string | Types.ObjectId, user: string | Types.ObjectId) {

        const idString = String(user);

        const message = await MessageModel.findById(messageId).exec();

        if (message) {
            if (message.userStatus?.get(idString) == 0) {
                message.userStatus.set(idString, 1);
                await message.save();
            }
        }
    }


}