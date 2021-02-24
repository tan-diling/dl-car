/**
 * backend api bootstrap  
 * 1. backend jobs: Agenda startup
 *    1. job define startup {@link AgendaService}
 * 1. event subscribe startup
 * 1. api service startup
 * 1. socket io service startup
 * 
 * @packageDocumentation
 * @module startup
 * @preferred
 */

import { logger as Logger } from '@app/config';
import * as express from 'express';
import { express_startup } from './express';
import { database_startup } from './database';
//We have to import at least all the events once so they can be triggered
// import './events';

export const startup = async (app: express.Application) => {
  await database_startup();

  await express_startup(app);
  Logger.info('✌️ Express loaded');

};
