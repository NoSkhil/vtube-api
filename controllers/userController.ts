import userService from "../services/userService";
import { Request, Response, NextFunction } from "express";
import { ICreateUser } from "../types/userTypes";
import { PublicRequest } from "../types/requestTypes";


const getUserByEmail = async (req: Request, res: Response) => {
    try {

        const { email } = req.body;

        const getUser = await userService.getUserByEmail(email);
        if (!getUser.success) return res.status(getUser.code).send(getUser.error);

        return res.status(200).send(getUser.data);

    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}

const login = async (req: PublicRequest, res: Response) => {
    try {

        const { email, password } = req.body;

        const login = await userService.login({ email, password });
        if (!login.success) return res.status(login.code).send(login.error);

        req.user = login.data;
        req.session.userId = login.data.id;
        return res.status(200).send(login.data);

    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}

const register = async (req: PublicRequest, res: Response) => {
    try {

        const createUserData: ICreateUser = req.body;

        const registerUser = await userService.register(createUserData);
        if (!registerUser.success) return res.status(registerUser.code).send(registerUser.error);

        req.user = registerUser.data;
        req.session.userId = registerUser.data.id;

        return res.status(200).send(registerUser.data);

    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}

const validateAuth = async (req: PublicRequest, res: Response) => {
    try {

        if (req.user) return res.status(200).send(req.user);
        else return res.status(403).send("Unauthorised Request");

    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error")
    }
}

export default {
    getUserByEmail,
    login,
    register,
    validateAuth
};