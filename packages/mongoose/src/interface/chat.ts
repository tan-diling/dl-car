// /**
//  * Chat Interface define file
//  * @packageDocumentation 
//  */


// export interface IChatRequest {
//     target_ai: string;
//     action_id: string;

//     action_data: {
//         data: {
//             [key: string]: any
//         }
//     };

//     origin_action: {
//         type: string,
//         content: {
//             [key: string]: any
//         }
//     };

//     user_data?: any;

//     timezone: number;

//     context: any | {
//         ai_state: [{
//             target_ai: string,
//             last_state: string,
//         }],
//         current_url: string,
//     };
// }