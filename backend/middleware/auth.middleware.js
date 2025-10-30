const jwt = require('jsonwebtoken')


function verifyToken(req,res,next){
    const token = req.header('Authorization');
    console.log(req.header);
    if (!token) {
        return res.status(401).send({
            error:"Access denied"
        })
    }
    try {
        const decoded = jwt.verify(token,"secret")
        console.log(decoded);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({
            error:"Invalid token"
        });
    }
}

function isAdmin(req,res,next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({
            error:"Access Forbidden"
        })
    }
    
}

module.exports ={ verifyToken , isAdmin}