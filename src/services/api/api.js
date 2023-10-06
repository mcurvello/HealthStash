import axios from "axios";
import {
  aadTenant,
  aadTenantId,
  appId,
  appSecret,
  fhirEndpoint,
} from "../../config/settings.js";

const getHttpHeader = (accessToken) => {
  return {
    Authorization: "Bearer " + accessToken,
    "Content-type": "application/json",
  };
};

const getAuthToken = async () => {
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
    const accessToken = response.data.access_token;
    console.log(
      "\tAAD Access Token acquired: " + accessToken.substring(0, 50) + "..."
    );
    return accessToken;
  } catch (error) {
    console.log("\tError getting token: " + error.message);
    return null;
  }
};

async function getPatients(accessToken) {
  const baseUrl = fhirEndpoint + "Patient";

  try {
    const response = await axios.get(baseUrl, {
      headers: getHttpHeader(accessToken),
    });

    return response?.data;
  } catch (error) {
    console.log("\tError getting patient data: " + error.response.status);
  }
}

async function postPatient(accessToken, data) {
  try {
    const response = await axios.post(fhirEndpoint + "Patient", data, {
      headers: getHttpHeader(accessToken),
    });
    const resourceId = response.data.id;
    console.log(
      "\tPatient ingested: " + resourceId + ". HTTP " + response.status
    );
    return resourceId;
  } catch (error) {
    console.log("\tError persisting patient: " + error.response.status);
    return null;
  }
}

export { getAuthToken, getPatients, postPatient };
