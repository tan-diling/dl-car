/**
 * mongoose connect init;
 * init data (default account info)
 * 
 * @packageDocumentation
 * @module startup
 */
import {MONGODB_URL,config_get} from '@packages/core';
import {Schema,model,Document,connect, Mongoose } from 'mongoose';
import { Db } from 'mongodb';

let db: Db = null ;


async function init_db(db:Db){
    const db_init = config_get('init') || [] ;

    for(const d of db_init){
        const {table, dataArray} = d
        if(table && dataArray) {
            console.log(`init ${table} `);
            for( const data of dataArray){
                const {key,doc} = data ;
                const _doc = await db.collection(table).findOne(key) ;
                if(_doc == null ) {
                    await db.collection(table).insertOne({...key,...doc});
                }
            }
        }        
    }
}

export const db_startup =  async (init?:Function): Promise<Db> => {
    if (db != null)
        return db ;

    const url = MONGODB_URL ;
    console.log("DB URL " + url );
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

    const conn = connection.connection ;
    conn.on('error', console.error.bind(console, '**db connection error:'));
    conn.once('open', function() {
        // we're connected!
        console.info( '**db connection error:**')
    });

    db = connection.connection.db ;
    await init_db(db)

    if( init != null ) {
        
        await init();

    }

    

    return  db ;
};

db_startup() ;

function getModel<T>(name:string,schema:Schema) {
    // db_startup().finally();
    // let m =  model<T & Document>(name);
    // if((m == null) && (schema!=null)) 
    {
        return  model<T & Document>(name,schema);
    }
    // return m ;
}

/** user login model */

export * from './model/user';
// export * from './model/photo';