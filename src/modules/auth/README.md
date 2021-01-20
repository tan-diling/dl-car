### diling backend Auth module
*********************************************************************


## api
- /login
- /refresh-token

## default user schema
- user
  - _id
  - email
  - name
  - password
  - emailValidated
  - ...
- login-session
  - _id
  - device
  - refreshToken
  - accessTime
  - refreshTime
  - user: ref(user)
  

## test login module script

```
ts-node ./test/login.test.ts
```


