import User from '../models/userDetails.js'
import bcrypt from 'bcryptjs'
import { createError } from "../error.js";
import jwt from 'jsonwebtoken'


export const signup = async (req, res, next) => {
    try {
        const userWithSameNameAndEmail = await User.findOne({
            name: req.body.name,
            email: req.body.email
        });
        if (userWithSameNameAndEmail) {
            return next(createError(400, "User with this name and email already exists"));
        }
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password.toString();
        const hash = bcrypt.hashSync(password, salt);
        const newUser = new User({ ...req.body, password: hash });
        await newUser.save();
        res.status(200).send("User has been created");
    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError(404, "User Not Found"));

        if (typeof req.body.password !== "string") {
            req.body.password = req.body.password.toString();
        }

        if (typeof user.password !== "string") {
            user.password = user.password.toString();
        }

        const isCorrectPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!isCorrectPassword)
            return next(createError(400, "Please Enter correct details"));

        const token = jwt.sign({ id: user._id }, process.env.JWT)
        const { password, ...others } = user._doc
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(others)
    } catch (error) {
        next(error);
    }
};

export const signout = async (req, res, next) => {
    try {
        // Clear the access_token cookie by setting it to an empty string
        res.cookie("access_token", "", { httpOnly: true });
        res.status(200).send("User has been signed out");
    } catch (error) {
        next(error);
    }
};



