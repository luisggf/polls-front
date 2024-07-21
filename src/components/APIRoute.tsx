import axios from "axios";

const API_BASE_URL = "http://localhost:3333";

export const getPoll = async (pollId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/polls/${pollId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching poll data:", error);
    throw error;
  }
};
