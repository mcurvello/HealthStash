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

    return accessToken;
  } catch (error) {
    console.log("\tError getting token: " + error.message);
    return null;
  }
};

async function getPatients(accessToken) {
  const baseUrl = fhirEndpoint + "Patient?_count=100";

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

async function getPractitionerById(accessToken, id) {
  const baseUrl = fhirEndpoint + `Practitioner/${id}`;

  try {
    const response = await axios.get(baseUrl, {
      headers: getHttpHeader(accessToken),
    });

    return response?.data;
  } catch (error) {
    console.log("\tError getting practitioner data: " + error.response.status);
  }
}

async function getPractitioners(accessToken) {
  const baseUrl = fhirEndpoint + "Practitioner";

  try {
    const response = await axios.get(baseUrl, {
      headers: getHttpHeader(accessToken),
    });

    return response?.data;
  } catch (error) {
    console.log("\tError getting practitioner data: " + error.response.status);
  }
}

async function postPractitioner(accessToken, data) {
  try {
    const response = await axios.post(fhirEndpoint + "Practitioner", data, {
      headers: getHttpHeader(accessToken),
    });
    const resourceId = response.data.id;
    console.log(
      "\tPractitioner ingested: " + resourceId + ". HTTP " + response.status
    );
    return resourceId;
  } catch (error) {
    console.log("\tError persisting practitioner: " + error.response.status);
    return null;
  }
}

async function getAppointments(accessToken) {
  const baseUrl = fhirEndpoint + "Appointment";

  try {
    const response = await axios.get(baseUrl, {
      headers: getHttpHeader(accessToken),
    });

    return response?.data;
  } catch (error) {
    console.log("\tError getting appointment data: " + error.response.status);
  }
}

async function postAppointment(accessToken, appointmentData) {
  try {
    const response = await axios.post(
      fhirEndpoint + "Appointment",
      appointmentData,
      {
        headers: getHttpHeader(accessToken),
      }
    );
    const resourceId = response.data.id;
    console.log(
      "\tAppointment ingested: " + resourceId + ". HTTP " + response.status
    );
    return resourceId;
  } catch (error) {
    console.log("\tError persisting appointment: " + error.response.status);
    return null;
  }
}

export {
  getAuthToken,
  getPatients,
  postPatient,
  getPractitionerById,
  getPractitioners,
  postPractitioner,
  getAppointments,
  postAppointment,
};
