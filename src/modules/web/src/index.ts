import 'reflect-metadata'; // We need this in order to use @Decorators

import * as express from 'express';
import * as http from 'http';
import * as loader from './startup';
import { db_startup } from './startup/database';

/** startup callback sign */
interface RegisterServerCallback {
  (server:{expressApp:express.Application,httpServer: http.Server}):Promise<any> ;
}

/** startup register interface */
interface RegisterConfig{
  /** name or description */
  name: string, 
  /** prior ,startup order */
  prior: number,
  /** startup callback */
  callback: RegisterServerCallback
}

/** backend server , singleton  */
export class BackendServer{

  private static instance: BackendServer;
    
  static getInstance(): BackendServer {
        if (!BackendServer.instance) {
          BackendServer.instance = new BackendServer();
        }

        return BackendServer.instance;
  }

  
  private serviceConfigList:Array<RegisterConfig> = [] ;

  public controllers  = [] ;

  public expressApp : express.Application  ;
  public httpServer : http.Server ;

  
  private constructor() {
    this.initServer() ;
    
  }

  private initServer( expressApp?: express.Application,  httpServer?: http.Server) {
    this.expressApp = expressApp || this.expressApp || express() ;
    this.httpServer = httpServer || this.httpServer  ||　new http.Server(this.expressApp) ;

    const server = this ;
    this.register('config express',async (options)=>{
      await db_startup() ;
      await loader.default(server) ;
    }) ;
  }

  /** register route controllers */
  registerController(... controllers:any[]){
    this.controllers.push(...controllers);
    return this ;
  }

  /** register server startup  */
  register(name:string, callback:RegisterServerCallback, prior:number=5){
    this.serviceConfigList.push({name,callback,prior});
    return this ;
  }

  /** start server */
  async start(unitTest:boolean=false) {


    const callbackList = this.serviceConfigList.sort((x,y)=>x.prior-y.prior);
    
    let i:number = 0 ;
    const serverOptions = {expressApp:this.expressApp,httpServer:this.httpServer} ;
    for(const x of callbackList) {
      i++ ;
      console.log("    ################################################");
      console.log(`      == init ${i}. ${x.name} ==`);
      await x.callback(serverOptions) ;      
      console.log("    ################################################");
    }


    if (unitTest) {
      return this.httpServer ;
    }
    
    const port :number = Number(process.env.PORT || 3000) ;

    console.log(
      `
    ################################################
    🛡️  Server listening on port: ${port} 🛡️ 
    ################################################
  `
    );
    this.httpServer.listen(port);
  }
}

export function register(name:string, callback:RegisterServerCallback, prior:number=5) {
  return BackendServer.getInstance().register(name,callback,prior);    
};

export async function startServer() {
  return BackendServer.getInstance().start();    
};

if (require.main === module) {  

  startServer();
}


