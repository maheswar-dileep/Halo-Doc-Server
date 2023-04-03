import { Request } from "express";

interface RequestDefenition extends Request {
    user: {
        id: string
    }
}

export default RequestDefenition;

