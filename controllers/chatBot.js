import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'
import flightDetails from '../models/flightDetails.js'
dotenv.config()
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const findFlights = async(req,res) =>{
    try {
        const {text} = req.body
        // const flights = await flightDetails.find({
        //     $or:[
        //         {flightNumber:text},
        //         {airlineName:text},
        //         {destinationName:text}
        //     ]
        // })

        // const flightDetailsString = flights.map(flight =>{
        //     return `${flight.airlineName} ${flight.flightNumber} to ${flight.destinationName} departs at ${flight.departureTime} from terminal ${flight.terminal} gate ${flight.gateNumber}`
        // }).join('\n')
        const {data} = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Human:${text}\nAI:`,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
        });
        // console.log({text});
        if(data){
            if(data.choices[0].text){
                return res.status(200).json(data.choices[0].text)
            }
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message});
    }
}



