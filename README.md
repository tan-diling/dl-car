# Gestalter Client Portal Backend
*********************************************************************

this project design for backend framework 

### packages
- core
- mongoose
- web
- mail

### project structure
- src/    # source code dir
  - config/ # config file dir
  - loaders/ # 
  - routes/ # global route define dir
  - models/ # mongo model define dir
  - controllers/ # wep api controller dir
    - index.ts # export controllers fro route
    - user/ # user controller dir
      - dto/ 
        - user.dto.ts # user data transmit object, used for request data validation 
      - user.controller.ts # user controller file ,for route
      - user.service.ts  # 
    - group/
    - resource/
    - photo/
  - subscriber/ # event subscriber dir 
  - modules/ # module dir
    - login/ # login module, for JWT token 
    - mail/ # mail module, 
    - query/ # mongoose query module, for mongoose schema and init connection
    - web/ # web module ,integrate with express,routing-controllers provide base web function
- draft/ # design dir 
- test/ # test dir
- config/ # config dir
  - default.json    # default deploy config file
  - development.json    # development deploy config file , work with default.json
  - production.json # production deploy config file , work with default.json
  - token.json   # google apis auth token file
  - credentials.json   # google apis auth credentials file
- dist/ # build output dir


### api 
#### mock server
postman
#### draft file 
- `draft/api/user.v1.yaml`
#### self hosted document
- `npm run api:doc`
- http://localhost:3001/api_docs


#### nginx selinux config

```
#nginx log:connect() to 127.0.0.1:3000 failed (13: Permission denied)
setsebool -P httpd_can_network_connect 1
```

### develop server
- https://dev.onwards.ai

### cicd server
- https://cicd.dev.onwards.ai
#### build
- build api 
  > https://cicd.dev.onwards.ai/job/test01/build?token=gest_client_portal_backend
#### account info
```
cicd.dev.intime.ai
tan
TFoPw0IDWUGa4ZtXGL8JlyA1@FT8kxs

cicd.dev.onwards.ai
tan
G5tgDVn2Wrwl6lsEH&gt;oVOKEAs@850EH
```
