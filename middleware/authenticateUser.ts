import { Response, NextFunction } from 'express';
import userService from '../services/userService';
import { PublicRequest } from '../types/requestTypes';

const authenticateUser = async (
    req: PublicRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (req.session.userId) {
            const fetchUser = await userService.getUserById(req.session.userId);
            if (fetchUser.success) {
                req.user = fetchUser.data;
                req.session.userId = fetchUser.data.id;
                next();
            } else {
                req.session.userId = undefined;
                res.status(401).send({ err: "Unauthorised request!" })
                return;
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export default authenticateUser;
