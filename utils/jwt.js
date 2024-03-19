const jwt = require('jsonwebtoken')

const JWT_secret = process.env.JWT_SECRET

const createtoken =  (user)=>{

    return  jwt.sign(user,JWT_secret,{ expiresIn: '1h' })
}

const verifytoken =async (token)=>{
   
    try{
        const decoded = await jwt.verify(token,JWT_secret)
        return decoded
    }
    catch(error)
    {
        console.log(error.message)
        return false

    }
   
}
module.exports = {
    createtoken,
    verifytoken
}