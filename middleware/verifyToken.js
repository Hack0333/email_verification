import jwt from 'jsonwebtoken'

export const verifyToken = async(req,res,next)=>{
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded) return res.status(405).json({success:false , message : "unauthorised- no user"});
        // console.log("decoded",decoded);
        req.userId = decoded.userid;
        
        next();

    } catch (error) {
        console.log("error in verify token",error);
        return res.status(401).json({success:false , message : "unauthorised- invalid token"});
    }
}