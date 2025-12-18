import axios from "axios";

const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {
    const requestConfig = {
        method: httpRequest,
        url: url,
        data: reqBody,
        headers: reqHeader ?? {}  
    };

    // Debug logging
    console.log(`[API] ${httpRequest} ${url}`, {
        data: reqBody,
        headers: reqHeader
    });

    try {
        const response = await axios(requestConfig);
        console.log(`[API] Success:`, response.status, response.data);
        return response;
    } catch (error) {
        console.error(`[API] Error:`, {
            url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        // Return error response if available, otherwise return error object
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return error.response;
        } else if (error.request) {
            // The request was made but no response was received
            return {
                status: 0,
                data: { message: "Network error. Please check your connection." }
            };
        } else {
            // Something happened in setting up the request that triggered an Error
            return {
                status: 0,
                data: { message: error.message || "Request failed" }
            };
        }
    }
};

export default commonAPI;
