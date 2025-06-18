import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader, "authHeader @@@@@@@@");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add user to request safely
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};
