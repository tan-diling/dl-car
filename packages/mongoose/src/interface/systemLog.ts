/** general system log define */
export interface ISystemLog{
    type?: string;        
    url:string;
    body:string|Object;
    responseCode:Number;
    responseBody:Object;
    method?:string;
    headers?:Object;
  
}
