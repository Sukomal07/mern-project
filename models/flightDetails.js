import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    flightNumber: {
        type: String,
        required: true
    },
    airlineName: {
        type: String,
        required: true
    },
    destinationName: {
        type: String,
        required: true
    },
    departureTime: {
        type: Date,
        required: true
    },
    terminal: {
        type: Number,
        required: true
    },
    gateNumber: {
        type: Number,
        required: true
    }
});

export default mongoose.model('Flight', flightSchema);


