### dealing backend Auth module
*********************************************************************


## api
- /login
- /refresh
- /logout

## default user schema
- user
  - _id
  - email
  - password  
  - ...
- session
  - _id
  - device
  - refreshToken  
  - expireAt
  - user: ref(user)
  

## test login module script

```
ts-node ./test/login.test.ts
```


