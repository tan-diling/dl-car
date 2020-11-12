import { EntityContext, Entity, ProjectEntity } from '../entity/entityContext';
import { ResourceType } from '@app/defines';

/**
 * mail template define
 */
function generateHTML(content: string) {
    const Mail_Layout =
        `
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title>Gestalter Mail Layout</title>
  </head>
  <body>
    <p style="box-sizing:border-box;border-bottom-width:1px !important;border-bottom-style:solid !important;border-bottom-color:#dee2e6 !important;" >
       <img style="width:20px;height:20px" src="https://dev.onwards.ai/assets/image/gest-logo.png" class="float-left" alt="image"/>
       <bold>Gestalter </bold>
    </p>
    <div class="container">
    ${content} 
    </div>
    <div style="box-sizing:border-box;border-top-width:1px !important;border-top-style:solid !important;border-bottom-color:#dee2e6 !important;" > 
      <div>Thank you,</div>
      <div>-Gestalter</div>
    </div>    
  </body>
</html>
`;
    return Mail_Layout;
}



export const mailTemplateConfig = {
    invitation: (ctx: any) => {
        const { user, server, doc } = ctx;
        const url = `${server}/project/dashboard?actionId=${doc._id}&userId=${user._id}`;
        switch (doc.__t || doc.type) {
            case "InvitationContact":
                return {
                    "subject": "Please confirm the contact invitation ",
                    "html": generateHTML(`
<div class="row">          
<h3>Hi ${user.name},</h3>                    

You have been invited as contact for ${doc.data.name}, please click the below link to view.

<a href="${url}" class="btn btn-primary" role="button" style="box-sizing:border-box;cursor:pointer;text-decoration:none;display:inline-block;font-weight:400;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border-width:1px;border-style:solid;padding-top:.375rem;padding-bottom:.375rem;padding-right:.75rem;padding-left:.75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;color:#fff;background-color:#007bff;border-color:#007bff;" >Show details</a>
</div>
`),
                };
                break;
            case "InvitationGroup":
                return {
                    "subject": "Please confirm the group invitation ",
                    "html": generateHTML(`

<div class="row">          
<h3>Hi ${user.name},</h3>                                        

You have been invited to join group ${doc.data.name}, please click the below link to view.

<a href="${url}" class="btn btn-primary" role="button" style="box-sizing:border-box;cursor:pointer;text-decoration:none;display:inline-block;font-weight:400;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border-width:1px;border-style:solid;padding-top:.375rem;padding-bottom:.375rem;padding-right:.75rem;padding-left:.75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;color:#fff;background-color:#007bff;border-color:#007bff;" >Show details</a>
</div>
`),
                };
                break;

            case "InvitationProject":
                return {
                    "subject": "Please confirm the project invitation ",
                    "html": generateHTML(`
                    <div class="row">          
                    <h3>Hi ${user.name},</h3>                                      
                    
                    You have been invited to join project ${ doc.data.name}, please click the below link to view.
                    
                    <a href="${url}" class="btn btn-primary" role="button" style="box-sizing:border-box;cursor:pointer;text-decoration:none;display:inline-block;font-weight:400;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border-width:1px;border-style:solid;padding-top:.375rem;padding-bottom:.375rem;padding-right:.75rem;padding-left:.75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;color:#fff;background-color:#007bff;border-color:#007bff;" >Show details</a>
                    </div>
                                
                        `),
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
                const updateList = [];
                if (body) {
                    for (const k of Object.keys(body)) {
                        if (k.startsWith('_')) continue;
                        if (k == 'id') continue;
                        updateList.push(`<dt class="col-sm-3">${k}:</dt> <dd class="col-sm-9">${body[k]}</dd> `);
                    }
                }

                desc = `<dl class="row">${updateList.join(' ')}</dl>`;

            }
        }

        const subject = `[GCP](${entityKey}) ${entity.type} '${entity.title}' ${action} `;

        let url = '';
        const entityType = entity.type.toLowerCase();
        switch (entityType) {
            case ResourceType.Project:
                url = `${server}/project/detail/${entity._id}`;
                break;
            case ResourceType.Goal:
            case ResourceType.Requirement:
            case ResourceType.Deliverable:
            case ResourceType.Task:
                url = `${server}/project/${project._id}/${entityType}/${entity._id}`;
                break;

        }
        return {
            "subject": subject,
            "html": generateHTML(`                
                <div class="row">
                <h3>Hi ${user.name},</h3>                    

                    <div>'${entity.title}' ${action} by ${entityContext.user.name} </div>
                    <div> ${ desc} </div>

                    <a href="${url}" class="btn btn-primary" role="button" style="box-sizing:border-box;cursor:pointer;text-decoration:none;display:inline-block;font-weight:400;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border-width:1px;border-style:solid;padding-top:.375rem;padding-bottom:.375rem;padding-right:.75rem;padding-left:.75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;color:#fff;background-color:#007bff;border-color:#007bff;" >Show details</a>
                </div>                
                `),
        };

    },

    forgetPassword: (ctx: any) => {
        const { user, server, doc } = ctx;
        return {
            "subject": "Reset your password",
            "html": generateHTML(`
                <div>
                <h3>Hi ${user.name},</h3>                    
                        We received a request to reset your password after confirming the verification code.Your GCP verification code is:

                <h3>${ doc.code} </h3>

                Please do not forward or give this code to anyone.

< /div>
                `),
        };
    }

}