import 'reflect-metadata'; // We need this in order to use @Decorators

import * as express from 'express';
import * as http from 'http';
import { startup } from './loaders';

/** startup callback sign */
interface RegisterServerCallback {
  (server: { expressApp: express.Application, httpServer: http.Server }): Promise<any>;
}

/** startup register interface */
interface RegisterConfig {
  /** name or description */
  name: string,
  /** prior ,startup order */
  prior: number,
  /** startup callback */
  callback: RegisterServerCallback
}

/** backend server , singleton  */
export class App {

  private static instance: App;

  private readonly prefix = '/api';

  static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }

    return App.instance;
  }


  private serviceConfigList: Array<RegisterConfig> = [];

  public routers = [];

  public expressApp: express.Application;
  public httpServer: http.Server;


  private constructor() {
    this.initServer();

  }

  private initServer(expressApp?: express.Application, httpServer?: http.Server) {
    this.expressApp = expressApp || this.expressApp || express();
    this.httpServer = httpServer || this.httpServer || new http.Server(this.expressApp);

    const server = this;
    this.register('config express', async (options) => {
      await startup(server.expressApp);

      for (const r of this.routers) {
        server.expressApp.use(this.prefix, r);
      }
    });
  }

  /** register route controllers */
  registerRouter(...routers: express.Router[]) {
    this.routers.push(...routers);
    return this;
  }

  /** register server startup  */
  register(name: string, callback: RegisterServerCallback, prior: number = 5) {
    this.serviceConfigList.push({ name, callback, prior });
    return this;
  }

  /** start server */
  async start() {

    const callbackList = this.serviceConfigList.sort((x, y) => x.prior - y.prior);

    let i: number = 0;
    const serverOptions = { expressApp: this.expressApp, httpServer: this.httpServer };
    for (const x of callbackList) {
      i++;
      console.log("    ================================================");
      console.log(`      == init ${i}. ${x.name} ==`);
      await x.callback(serverOptions);
      console.log("    ################################################");
    }


    const port: number = Number(process.env.PORT || 3000);

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
