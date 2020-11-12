import { EntityContext, Entity, ProjectEntity } from '../entity/entityContext';
import { ResourceType } from '@app/defines';

/**
 * mail template define
 */
const Mail_Header = `
<div>
<img style='display:block; width:20px;height:20px;'
       src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOvSURBVHgBhZRdaBxVFMfPuXf2zsxuPtZE0m2sJZZUERSpKagYJAoRGqlFobZRC6Jp8ibog1KlmheDRfRB+mJTsWCkWkV9CWp9ECQStO2DWrEINaW0TUM+2u52k9mZe+/pmZlsm27T5ixn7jL33t+cc/7nXoRl7P2f5xqV8Z7SVvRG2nZEmlaFmkBbOxtpGAsjfej/0m3f/fAqVmr3Yu2LvT9Vts9OXRyaPle8q3w5AMdT4Nb7UF/IMxAg5Ad/ACJD5zSIdz/ry+9fFjg4OCgu5HbsO/7byZfPn5pBosUJSlc1rGqAux+7F/JrmyE0RDqyyFAwBobaZ/bu5v32OuCj3T++d2l2fhdZQjbGEC5XjnWd66nwwBqGXY0UyMD+Q6+17IznRfzo2vJrX2nO7BKoUEoXROzCo3R0LQp1GNHpt0I+/O/46XZtzXAM0nGEFig09pWnP5jenkTY1vWLly/rk/y/dUmOxLEjEE3yljf+PLJpZGmUOz45uzYKM/9oAzmdioWc+kR0cX6DaAoyWziKVvY0MulzZB5HpqaNk3miFhbb5wN3nGbQF1FkOHV2FkpbarP1uR6BUm0TS9MUCmMHoV7/e/zxE3ATCyJ9tMLRxZ7WkkXS+nlHouqMM7ymTyLvX0fHNozALSwM8T9NlmtIYFnfxIk6HES3GUXCSRsF4wn4FlawUgg+MpDXxiBI2oygxYlTRayiUpMgjqwErIR6I3FYVI2EINHRkUJN8bg6RWIywRKXVgKWg+hZLjRVSZh0hp0TUrjHEoVjR5dFcUlKf92tYIX+E1vLgX1wIdQYsCBhZPlIGmTlx4SQ6mDcJjJtFVbY5YPiPHQzWP6l8TYTBR9VwgiC0HLqBtPzDRRZ+kpIY0alVBOYtIxPiy3U29VDhVpY69bRblWZP4zRwhowAVgdgubjEgM5wkkH6ftEiO7N1CsEjHB5RbWBSOKHx8N97/iwcHvZyEdANWxDWddDmSzXxOdD6/Jqh8cMb3DAoUz/5IF7hq8qu/lFM8yV7VvE8U/QjPkDzxR/51MggJwcy5/l0eePeQxSDHRZCAcd6Q1NHrj/7ZgjqsCOdjHg1MGQ10jgNQL4jRbvbNoI61uehKziFxR3muFRc+OlnhUS2t3CpwNt9+2ucm64ol54U+9ECYPc7K18gyXXmGFIcWEaLleKUDGGPJXDOtUw4Tq5t77Zk/1y6f5l77xNH5O7uhQ+I6V8jnPoZGhzMmFhim/JY1rbg+ViefTrPU2XavdeAfEC0Vgp/UliAAAAAElFTkSuQmCC' />
Gestalter
</div>
<br/>
` ;
const Mail_Footer = `
<br/>
<div class='footer'>
  <div>Thank you,</div>
  <div>-Gestalter</div>
</div>
` ;
export const mailTemplateConfig = {
    invitation: (ctx: any) => {
        const { user, server, doc } = ctx;
        const url = `${server}/project/dashboard?actionId=${doc._id}&userId=${user._id}`;
        switch (doc.__t || doc.type) {
            case "InvitationContact":
                return {
                    "subject": "Please confirm the contact invitation ",
                    "html": `
${Mail_Header}  
<div>          
<div>Hi ${user.name},<div>                    

You have been invited as contact for ${doc.data.name}, please click the below link to view.

<div><a href='${url}'>Show details</a></div>
</div>
${Mail_Footer} 
`,
                };
                break;
            case "InvitationGroup":
                return {
                    "subject": "Please confirm the group invitation ",
                    "html": `
${Mail_Header}  
<div>          
<div>Hi ${user.name},<div>                    

You have been invited to join group ${doc.data.name}, please click the below link to view.

<div><a href='${url}'>Show details</a></div>
</div>
${Mail_Footer}
`,
                };
                break;

            case "InvitationProject":
                return {
                    "subject": "Please confirm the project invitation ",
                    "html": `
                    ${Mail_Header}  
                    <div>          
                    <div>Hi ${user.name},<div>                    
                    
                    You have been invited to join project ${ doc.data.name}, please click the below link to view.
                    
                    <div><a href='${url}'>Show details</a></div>
                    </div>
                    ${Mail_Footer}                    
                        `,
                };
                break;
        }

    },

    entity: (ctx: any) => {
        const { user, server, doc } = ctx;
        const entityContext = doc as EntityContext<Entity>;
        const entity = entityContext.entity;
        const project = (entity.parents[0] || entity) as ProjectEntity;
        const entityKey = entity.parents.length == 0 ? `${project.key} ` : `${project.key} -${entity.seq} `;

        const body = entityContext.req?.body;
        let desc = body?._desc || "";

        const updateList = [];
        if (body) {
            for (const k of Object.keys(body)) {
                if (k.startsWith('_')) continue;
                if (k == 'id') continue;
                updateList.push(`${k}: ${body[k]} `);
            }
        }

        let action = entityContext.method;
        if (action == "member.append") {
            action = "add member";
            action = action + ` ${body._user.name} `;
        } else if (action == "member.remove") {
            action = "delete member";
            action = action + ` ${body._user.name} `;
        } else if (action == "assignee.append") {
            action = "add assignee";
            action = action + ` ${body._user.name} `;
        } else if (action == "assignee.remove") {
            action = "delete assignee";
            action = action + ` ${body._user.name} `;
        } else {
            if (desc == "") {
                if (updateList.length > 0) {
                    desc = updateList.join('\n');
                }
            }
        }

        const subject = `[GCP](${entityKey}) ${entity.type} '${entity.title}' ${action} `;

        let url = '';
        const entityType = entity.type.toLowerCase();
        switch (entityType) {
            case ResourceType.Project:
                url = `${server} /project/detail / ${entity._id} `;
                break;
            case ResourceType.Goal:
            case ResourceType.Requirement:
            case ResourceType.Deliverable:
            case ResourceType.Task:
                url = `${server} /project/${project._id} /${entityType}/${entity._id} `;
                break;

        }
        return {
            "subject": subject,
            "html": `
                ${ Mail_Header}
                <div>
                    <div>Hi ${ user.name}, </div>

                    <div>${ entityKey} ${action} by ${entityContext.user.name} </div>
                    <div> ${ desc} </div>

                    <div><a href='${url}' > Show details < /a></div >
                </div>
                ${ Mail_Footer}
                `,
        };

    },

    forgetPassword: (ctx: any) => {
        const { user, server, doc } = ctx;
        return {
            "subject": "Reset your password",
            "html": `
                ${ Mail_Header}
                <div>
                    <div>Hi ${ user.name}, <div>
                        We received a request to reset your password after confirming the verification code.Your GCP verification code is:

                <h3>${ doc.code} </h3>

                Please do not forward or give this code to anyone.

< /div>
                ${ Mail_Footer}
                `,
        };
    }

}