import axios from "axios";
import apiConfig from "./apiConfig";

const useHttpPost = () => {
  const post = async (path, data) => {
    const url = `${apiConfig.baseURL}${path}`;

    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      console.error("Erro na solicitação POST:", error);
      throw error;
    }
  };

  return { post };
};

export default useHttpPost;
