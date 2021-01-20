import { ModelQueryService } from '@app/modules/query';
import { DocumentType } from '@typegoose/typegoose';
import { NotFoundError, NotAcceptableError, UnauthorizedError, MethodNotAllowedError } from 'routing-controllers';
import { GroupModel, Group, GroupMemberModel, GroupMember, InvitationGroupModel } from '../models';
import { GroupRole, GroupMemberStatus, RequestContext, RequestOperation, SiteRole, RepoOperation, MemberStatus, ActionStatus, NotificationTopic, NotificationAction } from '@app/defines';
import { model, Types, UpdateQuery } from 'mongoose';
import { UserModel } from '../models';
import { Container } from 'typedi';
import { NotificationService } from './notification';
import { ActionService } from './action.service';
/**
 * group service
 */
export class GroupService {

    childModels = [
        {
            name: "members",
            ref: "GroupMember",
            localField: "_id",
            foreignField: "groupId",
            populate: {
                path: "userId",
                options: {
                    sort: "name",
                    // perDocumentLimit:5,
                },
            },
        },
    ];

    private queryService = new ModelQueryService();
    private actionService = Container.get(ActionService);
    constructor() {

    }


    async checkPermission(ctx: RequestContext) {
        if (ctx.user?.role == SiteRole.Admin)
            return;


        switch (ctx.method) {
            case RequestOperation.CREATE:
                if (ctx.resourceId) {
                    if (! await this.checkGroupMemberPermission(ctx.resourceId, ctx.user.id, GroupRole.Admin)) {
                        throw new MethodNotAllowedError('permission check: member');
                    }

                }
                break;
            case RequestOperation.RETRIEVE:
                if (ctx.resourceId) {
                    if (! await this.checkGroupMemberPermission(ctx.resourceId, ctx.user.id)) {
                        throw new MethodNotAllowedError('permission check: member');
                    }

                } else if (ctx.user?.id != ctx.filter?.memberUserId) {
                    throw new MethodNotAllowedError('permission check: member');
                }

                break;
            case RequestOperation.UPDATE:

                // // other site_user can update his/her self information
                // if (ctx.user?.id != ctx.filter?.owner)
                //     throw new MethodNotAllowedError('permission check error');

                // // user info:"role" , "defaultContact" maintained by 'admin'
                // if (ctx.dto?.role != null || ctx.dto?.defaultContact != null)
                //     throw new MethodNotAllowedError('permission check error');
                break;
            case RequestOperation.DELETE:
                if (! await this.checkGroupMemberPermission(ctx.resourceId, ctx.user.id, GroupRole.Admin)) {
                    throw new MethodNotAllowedError('permission check: member');
                }
                break;
            default:
                throw new MethodNotAllowedError('permission check: server');
        }
    }

    async checkGroupMemberPermission(groupId: string | Types.ObjectId, userId: string | Types.ObjectId, ...groupRoles: string[]) {
        const gm = await GroupMemberModel.findOne({ userId, groupId }).exec();
        if (gm) {
            if (groupRoles.length > 0)
                return groupRoles.includes(gm.groupRole);

            return true;
        }

        return false;
    }

    async getGroupMembers(docs: DocumentType<Group>[]) {
        let objList = docs.map(x => x.toJSON());

        for (const element of this.childModels) {
            const { name, ref, localField, foreignField, populate } = element;
            const childModel = model(ref);
            const values = docs.map(x => x.get(localField));

            const modelQuery = childModel.find().where(foreignField).in(values);
            if (populate) {
                modelQuery.populate(populate)
            }
            const childList = await modelQuery.exec();

            for (const obj of objList) {
                let localValue = obj[localField];

                obj[name] = childList
                    .filter(x => localValue?.equals ? localValue?.equals(x.get(foreignField)) : x.get(foreignField) == localValue)
                    .map(z => z.toJSON());
            }
        };

        return objList;
        // const ids = docs.map(x=>x._id) ;

        // const pms = await GroupMemberModel.find({}).where('groupId').in(ids).exec() ;

        // const convert = (groups:DocumentType<Group> [],members:DocumentType<GroupMember>[])=>{
        //     return docs.map(x=>{
        //         const memberList = members.filter(y=>y.groupId==x.id)                
        //                                 .map(z=>{
        //                                     return z.toJSON() ;                        
        //                                 }) ;

        //         return {
        //             ... x.toJSON(),
        //             members:memberList 
        //         };       
        //     });
        // };

        // return convert(docs,pms) ;        
    }

    async getGroupMember(doc: DocumentType<Group>) {
        const docsWithMember = await this.getGroupMembers([doc]);

        return docsWithMember[0];
    }


    /**
     * create an new group
     * @param dto 
     */
    async create(dto: { name: string, description: string, owner: string }) {
        // const  = dto;
        // groupDto.owner = groupDto.owner || user._id

        const group = new GroupModel(dto);
        await group.save();

        await GroupMemberModel.create({
            groupId: group._id,
            userId: group.owner,
            groupRole: GroupRole.Admin,
        });

        // GroupModel.emit(Operation.Created, group) ;
        return await this.getGroupMember(group);
    }

    /**
     *  list
     * @param query 
     */
    async list(query: any) {

        const groupList = await this.queryService.list(GroupModel, query);

        return await this.getGroupMembers(groupList as DocumentType<Group>[]);
    }

    /**
     *  list by member
     * @param query 
     */
    async listByMember(member: string, query: any) {
        const pms = await GroupMemberModel.find({ userId: member }).exec();
        if (pms.length == 0) {
            return [];
        }
        const ids = pms.map(x => String(x.groupId));
        return await this.list({ ...query, _id: ids });

    }


    /**
     * get by id
     * @param id 
     */
    async getById(id: string) {
        const group = await GroupModel.findById(id).exec();
        if (group) {
            const doc = await this.getGroupMember(group);

            return doc;
        }
    }

    /**
     * update info
     * @param id  id
     * @param dto 
     */
    async update(id: string, dto: UpdateQuery<DocumentType<Group>>) {
        let doc = await this.getById(id);
        if (doc) {
            doc = GroupModel.findByIdAndUpdate(id, dto, { new: true }).exec();

            return doc;
        }
    }

    /**
     * delete user
     * @param id 
     * @param dto 
     */
    async delete(id: string) {
        const doc = await GroupModel.findById(id).exec();;
        if (doc) {
            doc.deleted = true;
            return await doc.save();
        }

        return null;
    }


    /**
 *  child model query
 * @param query 
 */
    async relatedMember(dto: { userId: string, q?: string }) {
        const groups = await this.listByMember(dto.userId, '');

        const users = new Map<string, any>();
        for (const g of groups) {
            for (const u of g.members) {


                let checked = (u.deleted != true);
                const user = u.user;
                if (user == null) continue;
                const q = String(dto.q || "").toLowerCase();
                if (q) {
                    checked = false;
                    if (user.name.toLowerCase().includes(q)) {
                        checked = true;
                    }
                    if (user.email.toLowerCase().includes(q)) {
                        checked = true;
                    }
                }

                if (checked) {

                    users.set(String(user._id), user);
                }
            }
        }

        const ret = []
        for (const u of users.keys()) {

            const gmList = await GroupMemberModel
                .find({ userId: u })
                .populate('groupId')
                .exec();

            const user = users.get(u) || {};
            ret.push({
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                groups: gmList.map(x => x.groupId)
            });
        }

        return ret;



        const userId = Types.ObjectId(dto.userId);
        // const userGroupList = await GroupMemberModel.find({userId}).exec();

        // const userList = await GroupMemberModel.find({}).in('groupId',userGroupList.map(x=>x.groupId)).exec() ;

        // await UserModel.find({}).in('_id',userList.map(x=>x.userId).filter(x=>x != userId ))

        const query: any[] = [
            {
                '$match': {
                    'userId': userId
                }
            }, {
                '$lookup': {
                    'from': 'groupmembers',
                    'localField': 'groupId',
                    'foreignField': 'groupId',
                    'as': 'members'
                }
            }, {
                '$unwind': {
                    'path': '$members',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$group': {
                    '_id': '$members.userId',
                    'groupId': {
                        '$push': '$members.groupId'
                    }
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': '_id',
                    'foreignField': '_id',
                    'as': 'user'
                }
            }, {
                '$lookup': {
                    'from': 'groups',
                    'localField': 'groupId',
                    'foreignField': '_id',
                    'as': 'groups'
                }
            }, {
                '$replaceRoot': {
                    'newRoot': {
                        '$mergeObjects': [
                            {
                                '$arrayElemAt': [
                                    '$user', 0
                                ]
                            }, '$$ROOT'
                        ]
                    }
                }
            }, {
                '$project': {
                    'name': 1,
                    'email': 1,
                    'deleted': 1,
                    'groups': 1
                }
            }, {
                '$match': {
                    '_id': { $ne: userId }
                }
            }
        ];

        if (dto.q) {
            const regexMatch = { "$regex": dto.q, "$options": 'i' };
            query.push({
                '$match': {
                    "$or": [
                        { 'name': regexMatch },
                        { 'email': regexMatch },
                    ]
                }
            });
            // query.push(where);
        }

        return await GroupMemberModel.aggregate(query).exec();
    }


    /**
     *  child model query
     * @param query 
     */
    async listMember(id: string) {
        return await GroupMemberModel.find({ groupId: id }).populate("userId").exec();
    }


    /**
     *  child model create
     */
    async appendMember(id: string, dto: { userId, groupRole }) {
        const group = await GroupModel.findById(id).exec();
        if (!group) return;

        const groupId = group._id;
        const { userId, groupRole } = dto
        const user = await UserModel.findById(userId).exec();

        const groupMember = GroupMember.appendMember(groupId, user._id, groupRole);

        GroupMemberModel.emit(RepoOperation.Created, groupMember);

        return groupMember;

    }



    /**
     *  child model create
     */
    async inviteMember(groupId: Types.ObjectId, dto: { userId: Types.ObjectId, groupRole: string }, sender: string) {

        const group = await GroupModel.findById(groupId).exec();

        if (group == null) {
            throw new NotAcceptableError('group not exists');
        }

        const groupMember = await GroupMemberModel.findOne({
            groupId,
            userId: dto.userId
        }).exec();

        if (groupMember != null) {
            throw new NotAcceptableError('Group member already exists');
        }


        const invitation = await InvitationGroupModel.findOne({
            "data.userId": dto.userId,
            "data.groupId": groupId,
            status: ActionStatus.Pending,
        }).exec();
        if (invitation != null) {
            throw new NotAcceptableError("Group invitation already sent out, pending for action.");
        }

        return await this.actionService.create(InvitationGroupModel, {
            receiver: dto.userId,
            data: {
                userId: dto.userId,
                groupId: groupId,
                groupRole: dto.groupRole,
                name: group.name,
            },
            sender: sender,
        });

    }


    /**
     *  getMember
     */
    async getMemberById(id: string) {
        return await GroupMemberModel.findById(id).exec();
    }

    async getMember(filter) {
        return await GroupMemberModel.findOne(filter).exec();
    }

    /**
     *  child model delete
     */
    async updateMember(dto: { group: string, user: string, groupRole: string }) {

        const groupMember = await GroupMemberModel.findOne({
            groupId: new Types.ObjectId(dto.group),
            userId: new Types.ObjectId(dto.user),
        }).exec();

        if (groupMember) {
            groupMember.groupRole = dto.groupRole;
            await groupMember.save();
        }
        return groupMember;
    }



    /**
     *  child model delete
     */
    async deleteMember(dto: { group: string, user: string }) {

        const groupMember = await GroupMemberModel.findOne({
            groupId: new Types.ObjectId(dto.group),
            userId: new Types.ObjectId(dto.user),
        }).exec();

        if (groupMember) {
            await groupMember.remove();
        }
        return groupMember;
    }


    // /**
    //  * user handle group invited, action accept or reject
    //  * @param dto 
    //  */
    // async memberConfirm( dto:{email:string, id:string, status?:string }) {

    //     const gm = await GroupMemberModel.findOne({groupId:dto.id,email:dto.email}).exec() ;

    //     if(gm){
    //         gm.status = dto.status == MemberStatus.Refused ? MemberStatus.Refused: MemberStatus.Confirmed  ;

    //         if(! gm.userId) {
    //             const user = await UserModel.findOne({email:gm.email}).exec() ;                
    //             gm.userId = user._id ;
    //         }

    //         await gm.save() ;

    //         return {result:"Invitation confirmed "} ;
    //     }

    //     throw new NotFoundError('param_error');
    // }    


}