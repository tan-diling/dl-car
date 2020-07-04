import { logger } from './src/logger';

export * from './src/logger' ;

export * from './src/config' ;



if (require.main === module) {  

    logger.info('logger module....');
  }
  

