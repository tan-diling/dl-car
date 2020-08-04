export const JWT_OPTION = {
    secretOrKey:  process.env.JWT_SECRET || 'dealing' ,
    algorithm: process.env.JWT_ALGORITHM || 'HS256',
    expiresIn: 2* 60 * 60 , // 1h=60*60s

};