import express from 'express'
import { findFlights } from '../controllers/chatBot.js'
import { verifyToken } from '../verifyToken.js'

const router = express.Router()

router.post('/flights', verifyToken, findFlights)

export default router