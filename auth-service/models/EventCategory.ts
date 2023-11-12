import mongoose from "mongoose";

export interface EventCategory {
    name: string
}

const EventCategorySchema = new mongoose.Schema<EventCategory>({
    name: {
        type: String,
        required: true
    }
})

export const EventCategoryModel = mongoose.model<EventCategory>("eventcategories", EventCategorySchema);