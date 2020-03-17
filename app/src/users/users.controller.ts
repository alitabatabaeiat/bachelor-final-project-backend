import express from "express";
import {Request} from '@interfaces';
import service from "./users.service";

const signUp = async (req: Request, res: express.Response) => {
    const { body } = req;
    const user = await service.createUser(body);
    res.status(201).jsend.success('You have successfully registered');
};

export default {
    signUp
}
