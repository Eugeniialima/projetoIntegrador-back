import crypto from 'crypto';

const algorithm='aes-256-cbc';
const password= 'maria@3ug3ni@v@nd3rl3y!ima@milke';
const iv='5s4!kdsi$#lsa(%!';

const HashPassword=(text:string):string =>{
    const hash=crypto.createHash('sha256');
    return hash.update(text).digest('hex');
};

export default HashPassword;