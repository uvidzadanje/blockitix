import { CityModel, City } from "../models/City";
import { EventCategory, EventCategoryModel } from "../models/EventCategory";

export class StaticDataService {
    async getCities(): Promise<City[]>
    {
        let cities = await CityModel.find({});

        return cities;
    }

    async getEventCategories(): Promise<EventCategory[]>
    {
        let eventCategories = await EventCategoryModel.find({});

        return eventCategories;
    }
}