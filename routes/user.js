import express from 'express'
import { deleteUser, getUser,update } from '../controllers/user.js'
import { verifyToken } from '../verifyToken.js'

const router = express.Router()

//update a user
router.put("/:id", verifyToken, update)

//delete a user
router.delete("/:id" , verifyToken, deleteUser)

//get a user
router.get("/find/:id",getUser)
export default router