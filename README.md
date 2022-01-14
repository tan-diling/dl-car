# DL Client Portal Backend
*********************************************************************

this project design for backend framework 

### module
- query
- auth
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
- .env # env config file

### deploy
## system requirement 
  linux 
  node  v10.16+
## .evn file config example 
```
## jwt secret 
JWT_SECRET=xxxxxxxxx
JWT_ALGORITHM=HS256

## mongo db connect 
#GCP_MONGODB_URL=mongodb://localhost:27017/diling

## backend http server port
PORT=3000

##default google mail account, later User can change it in gcp system
#GCP_MAIL_USER= ####@gmail.com
#GCP_MAIL_PASSWORD=xxxx

## GCP WEBSITE URL 
GCP_WEBSERVER=https://xxxxxxxxx.ai

## GCP DEBUG OPTION for database, 
#GCP_DEBUG=db
```
## compile & run
  - `npm install & npm run build & npm run start`
  

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
# nginx log:connect() to 127.0.0.1:3000 failed (13: Permission denied)
setsebool -P httpd_can_network_connect 1
# nginx: stat() failed (13: permission denied) 
setsebool -P httpd_enable_homedirs 1

chcon -R -t httpd_sys_content_t /www/public_html/onwards.ai/private/gcp-frontend/
```

### develop server
- https://dev.xxxxxx.ai

### cicd server
- https://cicd.dev.xxxxxx.ai
#### build
- build api 
  > https://cicd.dev.xxxxxx.ai/job/test01/build?token=gest_client_portal_backend

nginx config for socketio
================================================================
upstream socket_nodes{
    ip_hash;
    server localhost:3000 ;
}


server {
    listen 80;
    listen [::]:80;
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name dev.xxxxx.ai _;

  ...


    location  /socket.io {
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://socket_nodes;
    }

    location  /api/chatbot {
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://socket_nodes;
    }
}    


