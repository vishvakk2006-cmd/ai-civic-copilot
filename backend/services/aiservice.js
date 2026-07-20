import axios from "axios";


const API = axios.create({
    baseURL: "http://localhost:5000/api"
});


export function checkEligibility(citizenData) {

    return API.post(
        "/eligibility",
        citizenData
    );

}