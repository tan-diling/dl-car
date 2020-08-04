import * as appRootPath from 'app-root-path'
import * as path from 'path';
import { config_get } from './config';


export const AppPath = appRootPath.path ;

console.log('AppPath: ' + AppPath);

export const WebServer = config_get('webServer') || "http://localhost:3000/api";

const photo_base_path:string = config_get("photo.path","../upload") ;
export const PHOTO_BASE_PATH = photo_base_path.startsWith("/") ? photo_base_path : path.join(process.cwd(),photo_base_path) ;