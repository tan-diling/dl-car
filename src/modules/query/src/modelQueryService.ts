
import { Model,Document, isValidObjectId } from 'mongoose';
import * as aqp from 'api-query-params';

export const AQP_OPTIONS = 
{
    casters: {
        q: val =>{ return {$search:val} },                
    },
    castParams: {
        $text: 'q',
    },
};


export class ModelQueryService {

    async list<T extends Document>(model:Model<T>, query: string|any, options?) {
        const { filter, skip, limit, sort, projection, population } = aqp(query, options || AQP_OPTIONS);
        const documentQuery =   model.find(filter) ;

        if ( skip || limit ) 
            documentQuery.skip(skip||0).limit(limit||100) ;

        if ( sort ) 
            documentQuery.sort(sort);

        if ( projection ) 
            documentQuery.select(projection);

        if ( population ) 
            documentQuery.populate(population) ;

        const docs = await documentQuery.exec();

        return docs;
    }

    async get<T extends Document>(model:Model<T>, query: string|any, options?) {
        if(isValidObjectId(query)){
            return await model.findById(query).exec() ;
        }

        const { filter, projection, population } = aqp(query, options || AQP_OPTIONS);
        const documentQuery =   model.findOne(filter) ;

        if ( projection ) 
            documentQuery.select(projection);

        if ( population ) 
            documentQuery.populate(population) ;

        const doc = await documentQuery.exec();

        return doc;
    }

    async count<T extends Document>(model:Model<T>, query: string|any, options?) {
        const { filter, skip, limit, sort, projection, population } = aqp(query, options || AQP_OPTIONS);
        const documentQuery =   model.find(filter).countDocuments() ;

        const doc = await documentQuery.exec();

        return doc;
    }

}