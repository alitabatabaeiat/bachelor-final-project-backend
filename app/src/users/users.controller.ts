import { Request, Response } from "express";
import service from "./users.service";

const signUp = async (req: Request, res: Response) => {
    const { body } = req;
    const user = await service.createUser(body);
    res.status(201).send('You have successfully registered');
};

export default {
    signUp
}
