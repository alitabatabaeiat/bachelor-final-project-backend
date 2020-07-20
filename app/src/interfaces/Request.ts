import express from 'express';
import User from "./User";

export interface Request extends express.Request {
    user?: User;
    file?
}

export default Request;
