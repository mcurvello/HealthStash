import { useEffect, useState } from "react";
import axios from "axios";
import apiConfig from "./apiConfig";

const useHttpGet = (path) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = `${apiConfig.baseURL}${path}`;

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro na solicitação GET:", error);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
};

export default useHttpGet;
