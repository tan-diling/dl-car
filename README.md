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
## .evn file config  
```
## jwt secret 
JWT_SECRET=diling
JWT_ALGORITHM=HS256

## mongo db connect 
#GCP_MONGODB_URL=mongodb://localhost:27017/diling

## backend http server port
PORT=3000

##default google mail account, later User can change it in gcp system
GCP_MAIL_USER=dl@testmvp.com
GCP_MAIL_PASSWORD=dl@diling2702

## GCP WEBSITE URL 
GCP_WEBSERVER=https://dev.onwards.ai

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
- https://dev.onwards.ai

### cicd server
- https://cicd.dev.onwards.ai
#### build
- build api 
  > https://cicd.dev.onwards.ai/job/test01/build?token=gest_client_portal_backend

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

    server_name dev.onwards.ai _;

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

=============================================================
[tan@c1-mean-dl05-onwards-ai ~]$ wscat -c wss://dev.onwards.ai/socket.io/?transport=websocket
error: Unexpected server response: 400
[tan@c1-mean-dl05-onwards-ai ~]$ wscat -c ws://dev.onwards.ai/socket.io/?transport=websocket
error: Unexpected server response: 301
[tan@c1-mean-dl05-onwards-ai ~]$ wscat -c ws://127.0.0.1/socket.io/?transport=websocket
Connected (press CTRL+C to quit)
< 0{"sid":"ezaXyZnPQXnayw-hAAHm","upgrades":[],"pingInterval":25000,"pingTimeout":5000}
< 40
> [tan@c1-mean-dl05-onwards-ai ~]$ ^C
[tan@c1-mean-dl05-onwards-ai ~]$ ping dev.onwards.ai
PING dev.onwards.ai (66.27.53.100) 56(84) bytes of data.
64 bytes from mail.rysonate.com (66.27.53.100): icmp_seq=1 ttl=64 time=0.202 ms
[tan@c1-mean-dl05-onwards-ai ~]$ wscat -c ws://66.27.53.100/socket.io/?transport=websocket
error: Unexpected server response: 404
```