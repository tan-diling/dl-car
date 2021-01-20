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

import {logger as Logger} from '@app/config';

import expressLoader from './express';

import { BackendServer } from '../server';
//We have to import at least all the events once so they can be triggered
// import './events';

export default async (server:BackendServer) => {
  
  await expressLoader(server);
  Logger.info('✌️ Express loaded');

};
