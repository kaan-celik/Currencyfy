import { APP_ID } from "../constants";

const baseURL = `https://api.fxfeed.io/v1/`;

const handleRequest = async (query) => {
    const response = await fetch(baseURL+query);
    const data = await response.json();
    return data;
}

export default {
    handleRequest
}