import axios from "axios";

const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {
    const requestConfig = {
        method: httpRequest,
        url: url,
        data: reqBody,
        headers: reqHeader ?? {}  
    };

    return await axios(requestConfig)
        .then(res => res)
        .catch(err => err);
};

export default commonAPI;
