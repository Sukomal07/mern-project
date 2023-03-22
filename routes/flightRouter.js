import express from 'express'
import { createFlight, deleteAllFlights, deleteFlight, getFlights, updateFlight } from '../controllers/flight.js'
import {verifyToken} from '../verifyToken.js'
const router = express.Router()

router.post('/flights',verifyToken ,createFlight)
router.get('/flights', verifyToken, getFlights)
router.put('/flights/:id',verifyToken, updateFlight)
router.delete('/flights/:id', verifyToken, deleteFlight)
router.delete('/flights', verifyToken, deleteAllFlights)

export default router