/**
 * mongoose connect init;
 * init data (default account info)
 * 
 * @packageDocumentation
 * @module startup
 */
import { MONGODB_URL, DB_DATA_INIT, DB_DEBUG } from '@app/config';
import { Schema, model, Document, connect, Mongoose } from 'mongoose';
import { Db } from 'mongodb';
import * as mongoose from 'mongoose';
import { setLogLevel, LogLevels } from '@typegoose/typegoose';

let db: Db = null;

if (DB_DEBUG) {
    mongoose.set('debug', true);

    setLogLevel(LogLevels.DEBUG);
}


async function init_db(db: Db) {
    const db_init = DB_DATA_INIT;

    for (const d of db_init) {
        const { table, dataArray } = d
        if (table && dataArray) {
            console.log(`init_db: ${table} `);
            for (const data of dataArray) {
                const { key, doc } = data;
                const _doc = await db.collection(table).findOne(key);
                if (_doc == null) {
                    await db.collection(table).insertOne({ ...key, ...doc });
                }
            }
        }
    }
}

export const database_startup = async (init?: Function): Promise<Db> => {
    if (db != null)
        return db;

    const url = MONGODB_URL;
    console.log("DB URL " + url);
    const connection = await connect(
        url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // serverSelectionTimeoutMS:5000,
            useFindAndModify: false,
            useCreateIndex: true,

        },
    );

    const conn = connection.connection;
    conn.on('error', console.error.bind(console, '**db connection error:'));
    conn.once('open', function () {
        // we're connected!
        console.info('**db connection error:**')
    });

    db = connection.connection.db;
    await init_db(db)

    if (init != null) {

        await init();

    }

    return db;
};

/** user login model */

// export * from './model/photo';