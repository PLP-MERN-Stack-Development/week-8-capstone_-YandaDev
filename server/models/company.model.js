import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    logo: {
        type: String // URL to company logo
    },
    // userId removed to allow multiple recruiters per company
}, { timestamps: true })
const Company = mongoose.model("Company", companySchema);
export default Company;