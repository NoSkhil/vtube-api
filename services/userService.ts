import db from '../prisma/client';
import * as argon2 from "argon2";
import { ICreateUser, IUser } from '../types/userTypes';
import { Result } from '../types/responseTypes';

const getUserById = async (id: string): Promise<Result<IUser>> => {
    try {
        const user = await db.users.findUnique({ where: { id }, omit: { password: true } });
        if (!user) return {success:false, code:404, error:"Invalid User ID"};

        else return {success:true,data:user};
    }
    catch (err) {
        console.log(err);
        return {success:false, code: 500, error:"Internal Server Error"}
    }
};

const getUserByEmail = async (email: string): Promise<Result<IUser>> => {
    try {
        const user = await db.users.findUnique({ where: { email } });
        if (!user) return {success:false, code:404, error:"Invalid User Email"};

        else return {success:true,data:user};
    }
    catch (err) {
        console.log(err);
        return {success:false, code: 500, error:"Internal Server Error"}
    }
};

const login = async ({ email, password }: {
    email: string;
    password: string;
}): Promise<Result<IUser>> => {
    try {
        const user = await db.users.findUnique({ where: { email } });
        if (!user) return {success:false, code:401, error:"Invalid Credentials"};

        const verify = await argon2.verify(user.password, password);
        if (!verify) return {success:false, code:401, error:"Invalid Credentials"};

        const { password: removePassword, ...safeUserObject }: { password: string; } = user;

        return {success:true, data:safeUserObject as IUser};
    }
    catch (err) {
        console.log(err);
        return {success:false, code: 500, error:"Internal Server Error"}
    }
};

const register = async (user: ICreateUser): Promise<Result<IUser>> => {
    try {
        const existingEmail = await db.users.findUnique({ where: { email: user.email } });
        const existingPhoneNumber = user.phone_number && await db.users.findUnique({ where: { phone_number: user.phone_number } });
        if (existingEmail || existingPhoneNumber) return {success:false, code:401, error:"User already exists"};

        const hashedPassword = await argon2.hash(user.password);
        user.password = hashedPassword;
        const savedUser = await db.users.create({ data: user });

        return {success:true,data:savedUser};
    }
    catch (err) {
        console.log(err);
        return {success:false, code: 500, error:"Internal Server Error"}
    }
};

export default {
    getUserById,
    getUserByEmail,
    login,
    register
};