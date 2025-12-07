import SERVERURL from "./serverURL";
import commonAPI from "./commonAPI";

// Send a message
export const sendMessageAPI = async (data) => {
  const token = sessionStorage.getItem("token");
  return await commonAPI(
    "POST",
    `${SERVERURL}/api/communication/send`,
    data,
    {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};

// Get inbox messages
export const getInboxAPI = async () => {
  const token = sessionStorage.getItem("token");
  return await commonAPI(
    "GET",
    `${SERVERURL}/api/communication/inbox`,
    null,
    {
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};

// Get sent messages
export const getSentAPI = async () => {
  const token = sessionStorage.getItem("token");
  return await commonAPI(
    "GET",
    `${SERVERURL}/api/communication/sent`,
    null,
    {
      Authorization: token ? `Bearer ${token}` : "",
    }
  );
};

