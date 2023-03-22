import { createError } from "../error.js"
import User from '../models/userDetails.js'
export const update = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            },{
                new:true
            });
            res.status(200).json(updateUser);
        } catch (error) {
            next(error);
        }
    } else {
        return next(createError(403, "You are not allowed to do this"));
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted");
        } catch (error) {
            next(error);
        }
    } else {
        return next(createError(403, "You are not allowed to do this"));
    }
}
export const getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}