import mongoose from "mongoose";

export interface City {
    name: string
}

const CitySchema = new mongoose.Schema<City>({
    name: {
        type: String,
        required: true
    }
})

export const CityModel = mongoose.model<City>("cities", CitySchema);