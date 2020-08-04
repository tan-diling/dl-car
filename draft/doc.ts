/**
 * use `ts-node ./draft/doc.ts` run 
 */
import * as express from 'express' ;
// const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./draft/api/user.v1.yaml');
 
app.use('/api_docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3001,()=>{
    console.log("http://127.0.0.1:3001/api_docs running") ;
});

