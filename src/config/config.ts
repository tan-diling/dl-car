import * as  config from 'config';
import * as path from 'path';

console.log('NODE_CONFIG_ENV: ' + config.util.getEnv('NODE_CONFIG_ENV'));

export const DEBUG = config.util.getEnv('NODE_CONFIG_ENV') == "development";

const AppPrefix = 'GCP_'

export const config_get = (key: string, val: any = undefined): any => {
    let v = val;
    if (config.has(key)) {
        v = config.get(key);
    }

    const envKey = AppPrefix + key.replace('.', '_').toUpperCase();
    return process.env[envKey] || v;

    // return val ;
};


