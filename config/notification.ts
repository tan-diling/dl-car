// {
// //     "#Resource":
// // `

// //     type
// //     title
// //     description
// //     creator 
// //     parents
// //     assignees
// //     deleted
// //     estimate
// //     deadline
// //     createdAt
// //     updatedAt
// //     completedAt
// //     status
// //     seq
// //     members
// //   　children
// //     comments
// //     checklist
// //     attachments
  
// // }
// // `,
//     "Deliverable": [
//         {
//             "Created": [
//                 {
//                     "expression":"type!=TYPE_PROJECT",
//                     "actions":[{
//                         "receiver": "project_manager",
//                         "type":"db,mail"
//                     }]                    
//                 }
//             ],
            
//             "Updated": [
//                 {
//                     "expression":"",
//                     "actions":[{
//                         "receiver": "assignees",
//                         "type":"db,mail"
//                     }]                    
//                 },
//                 {
//                     "#expression":" 当Goal 在In progress或者Finalized情况下，如果下属的任意一个entity的内容改变了， 都需要给PM/PO发邮件， 发notification，",
//                     "expression":"type != TYPE_GOAL || GOAL.status == STATUS_PROCESSING",
                    
//                     "actions":[
//                         {
//                             "receiver": "project_manager,project_owner,goal_assignee,assignee",
//                             "type":"db,mail"
//                         }                        
//                 ]                    
//                 }
//             ],
//             "Deleted": [
//                 {
//                     "expression":"",
//                     "actions":[{
//                         "receiver": "project_manager",
//                         "type":"db,mail"
//                     }]                    
//                 }
//             ]
//         }
//     ]
// }