import express from 'express'
import { signin, signout, signup } from '../controllers/auth.js'

const router = express.Router()
//create a user
router.post("/signup" , signup)
//sign in
router.post("/signin" , signin)

// sign out 
router.post("/signout", signout)




export default router