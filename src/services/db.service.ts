
import { Model,Document, isValidObjectId, CreateQuery, Types, UpdateQuery } from 'mongoose';
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


export class DbService {

    static
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

    static
    async get<T extends Document>(model:Model<T>, query: string|any, options?) {
        
        const { filter, projection, population } = aqp(query, options || AQP_OPTIONS);
        const documentQuery = isValidObjectId(query)? model.findById(query) :  model.findOne(filter) ;

        if ( projection ) 
            documentQuery.select(projection);

        if ( population ) 
            documentQuery.populate(population) ;

        const doc = await documentQuery.exec();

        return doc;
    }

    static
    async count<T extends Document>(model:Model<T>, query: string|object, options?) {
        const { filter} = typeof(query)==typeof({})?{filter:query}:aqp(query, options || AQP_OPTIONS);
        const documentQuery =  model.find(filter).countDocuments() ;

        const doc = await documentQuery.exec();

        return doc;
    }

    static
    async delete<T extends Document>(model:Model<T>, id:string|Types.ObjectId) {        
        const documentQuery =   model.findById(id) ;

        const doc = await documentQuery.exec();

        if(doc){
            const deletedFieldName = 'deleted' ;
            if(model.schema.path(deletedFieldName)){
                doc.set(deletedFieldName,true) ;
                await doc.save() ;
            } else {
                await doc.remove() ;
            }            
        }
        return doc;
    }

    static
    async create<T extends Document>(model:Model<T>, dto: CreateQuery<T>) {
        const doc = await model.create(dto) ;       
        return doc;
    }

    static
    async update<T extends Document>(model:Model<T>, id:string|Types.ObjectId, dto: UpdateQuery<T>) {
        const doc = await model.findById(id).exec() ;       
        if(doc){
            model.findByIdAndUpdate(id,dto) ;
        }
        return doc;
    }

}