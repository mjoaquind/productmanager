import jwt from 'jsonwebtoken';

export const checkRole = (roles)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.json({status:"error", message:"Necesitas estar autenticado"});
        }
        if(!roles.includes(req.user.role)){
            return res.json({status:"error", message:"No estas autorizado"});
        }
        next();
    }
}

export const verifyEmailTokenMW = () => {
    return (req, res, next) => {
        try {
            const token = req.query.token;
            const decoded = jwt.decode(token);
            const expirationTime = decoded.exp * 1000;
            const expirationDate = new Date(expirationTime);
            const currentDate = new Date();

            if (currentDate > expirationDate) {
                return res.status(400).send({ status: "error", message: "Token expirado" });
            }
        } catch (error) {
            return res.json({ status: "error", message: "Error en el token" });
        }
        next();
    }
}