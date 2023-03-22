import flightDetails from "../models/flightDetails.js";
import mongoose from "mongoose";
import { createError } from '../error.js'

export const createFlight = async (req, res, next) => {
    const { flightNumber, airlineName, destinationName, departureTime, terminal, gateNumber } = req.body;

    const parsedDepartureTime = Date.parse(departureTime);
    if (isNaN(parsedDepartureTime) || parsedDepartureTime < Date.now()) {
        return next(createError(400, "Invalid departure time"));
    }

    const departureTimeDate = new Date(parsedDepartureTime);
    const localDepartureTime = departureTimeDate.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    try {
        const flight = new flightDetails({
            userId: req.user.id,
            flightNumber,
            airlineName,
            destinationName,
            departureTime: departureTimeDate,
            terminal,
            gateNumber
        });
        await flight.save();
        res.status(201).json({ ...flight._doc, departureTime: localDepartureTime });
    } catch (error) {
        next(error);
    }
};


export const getFlights = async (req, res, next) => {
    try {
        const flights = await flightDetails.find({ userId: req.user.id });
        const formattedFlights = flights.map(flight => {
            const localDepartureTime = flight.departureTime.toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: '2-digit',
                month: '2-digit',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
            return { ...flight._doc, departureTime: localDepartureTime };
        });
        res.status(200).json(formattedFlights);
    } catch (error) {
        next(error)

    }
};

export const updateFlight = async (req, res, next) => {
    try {
        const flight = await flightDetails.findById(req.params.id);
        if (!flight) return next(createError(404, "Flight not found"));

        if (req.user.id !== flight.userId) {
            return next(createError(403, "You can update only your flight"));
        }

        const { departureTime, ...rest } = req.body;
        if (departureTime) {
            const parsedDepartureTime = Date.parse(departureTime);
            const now = Date.now();
            if (isNaN(parsedDepartureTime) || parsedDepartureTime < now) {
                return next(createError(400, "Invalid departure time"));
            }
            rest.departureTime = new Date(parsedDepartureTime);
        }

        const updatedFlight = await flightDetails.findByIdAndUpdate(
            req.params.id,
            { $set: rest },
            { new: true }
        );

        const localDepartureTime = updatedFlight.departureTime.toLocaleString(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                month: "2-digit",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }
        );

        res.status(200).json({ ...updatedFlight._doc, departureTime: localDepartureTime });
    } catch (error) {
        next(error);
    }
};


export const deleteFlight = async (req, res, next) => {
    try {
        const flight = await flightDetails.findById(req.params.id)
        if (!flight) return next(createError(404, "Flight not found"))
        if (req.user.id === flight.userId) {
            await flightDetails.findByIdAndDelete(req.params.id)
            res.status(200).json("Flight has been deleted")
        } else {
            return next(createError(403, "You can delete only your flight"))
        }
    } catch (error) {
        next(error)
    }
};
export const deleteAllFlights = async (req, res, next) => {
    try {
        const flights = await flightDetails.find({ userId: req.user.id });
        if (flights.length === 0) {
            return next(createError(404, "No flights found for the user"))
        }
        await flightDetails.deleteMany({ userId: req.user.id });
        res.status(200).json("All flights have been deleted");
    } catch (error) {
        next(error);
    }
};

