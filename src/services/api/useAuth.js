import { useState, useCallback } from "react";
import axios from "axios";

const aadTenant = "https://login.microsoftonline.com/";
const aadTenantId = "e61536a5-a78f-407e-a1a0-224c9ba6bc34";

const appId = "5619159e-3844-4bc0-8073-be4c479bb5b0";
const appSecret = "rbU8Q~isvHsTXDlCtERpji6TmhuolZ~2iXAbeciI";
const fhirEndpoint =
  "https://projetofiapfhir-fhirservice.fhir.azurehealthcareapis.com/";

const useAuth = () => {
  const [accessToken, setAccessToken] = useState(null);

  const getAuthToken = useCallback(async () => {
    try {
      const data = new FormData();
      data.append("client_id", appId);
      data.append("client_secret", appSecret);
      data.append("grant_type", "client_credentials");
      data.append("resource", fhirEndpoint);

      const response = await axios.post(
        aadTenant + aadTenantId + "/oauth2/token",
        data
      );

      const newAccessToken = response.data.access_token;

      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.log("\tError getting token: " + error.message);
      return null;
    }
  }, []);

  return { accessToken, getAuthToken };
};

export default useAuth;
