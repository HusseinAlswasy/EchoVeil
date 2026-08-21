export const authorization = (roles = []) => {
    return async (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            throw new Error("You Are Not Authorized", { cause: 403 });
        }

        next();
    };
};