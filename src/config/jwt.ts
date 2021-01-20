export const JWT_OPTION = {
    secretOrKey: process.env.JWT_SECRET || 'diling',
    algorithm: process.env.JWT_ALGORITHM || 'HS256',
    expiresIn: 30 * 60, // 1h=60*60s

};