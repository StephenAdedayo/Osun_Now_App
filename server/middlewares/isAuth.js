const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config/keys")
const { User } = require("../models")



const isAuth = async (req, res, next) => {
    
    try {
        const authorization = req.headers.authorization ? req.headers.authorization.split(" ") : []

        const token = authorization.length > 1 ? authorization[1] : null
        
        if(token){

            const payload = jwt.verify(token, JWT_SECRET)

            if(payload){
                const user = await User.findById(payload._id)
                req.user = user
                next()
            }else{
               res.code = 401
               throw new Error("Unauthorized")
            }

        }else{
            res.code = 400
            throw new Error("Token is required")
        }
    } catch (error) {
        next(error)
    }


}

module.exports = isAuth