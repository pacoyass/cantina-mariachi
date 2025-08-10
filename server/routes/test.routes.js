import express from 'express';
import { createResponse } from '../utils/response.js';
import prisma from '../config/database.js';


const router = express.Router();


router.get('/',async (req, res) => {
    const test = await prisma.user.findMany();
    createResponse(res,200,"hello1",{users:test})
});


export default router;
