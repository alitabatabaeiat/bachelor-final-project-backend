import express from 'express';
import User from "./User";
import Apartment from "../apartments/apartments.entity";

export interface Request extends express.Request {
    user?: User;
    apartment?: Apartment;
}

export default Request;
