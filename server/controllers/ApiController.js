import fetch from "node-fetch";

export const fetchFromApi = async (req, res) => {
  const clientId =
    "e7bf9630-8bc6-4032-b61d-371e9e07077e_6665e40f-8835-44b3-845f-0fc31fb4d5d2";
  const clientSecret = "UPKeaNLH0V3NQqG/nxLyyeOf0DPotYgY7kz415AYNxQ=";
  const tokenEndpoint = "https://icdaccessmanagement.who.int/connect/token";
  const apiEndpoint = "https://id.who.int/icd/entity/455013390";
  const scope = "icdapi_access";

  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: `grant_type=client_credentials&scope=${scope}`,
    });
    const tokenData = await response.json();

    if (!response.ok) {
      console.error("Error fetching access token:", tokenData);
      res.status(500).json({ error: "Failed to fetch access token" });
      return;
    }

    const apiResponse = await fetchDataFromApi(
      apiEndpoint,
      tokenData.access_token
    );
    const data = await apiResponse.json();

    if (apiResponse.ok) {
      if (data.child && Array.isArray(data.child)) {
        data.child = data.child.map((childEntityUrl) =>
          childEntityUrl.replace(/^http:/, "https:")
        );
        const childTitles = await Promise.all(
          data.child.map(async (childEntityUrl) => {
            try {
              const childApiResponse = await fetchDataFromApi(
                childEntityUrl,
                tokenData.access_token
              );
              const childEntityData = await childApiResponse.json();
              return getChildTitle(childEntityData);
            } catch (error) {
              console.error("Error fetching/parsing child entity:", error);
              return "Title not available";
            }
          })
        );

        res.json(childTitles);
      }
    } else {
      console.error("Error fetching data from the ICD API:", data);
      res.status(500).json({ error: "Failed to fetch data from the ICD API" });
    }
  } catch (error) {
    console.error("Error fetching data from the ICD API:", error);
    res.status(500).json({ error: "Failed to fetch data from the ICD API" });
  }
};

function getChildTitle(childEntityData) {
  if (childEntityData.title && childEntityData.title["@value"]) {
    return childEntityData.title["@value"];
  } else {
    return "Title not available";
  }
}

async function fetchDataFromApi(url, accessToken) {
  try {
    const response = await fetch(url, {
      headers: {
        "API-Version": "v2",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Accept-Language": "en",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    return response;
  } catch (error) {
    console.error("Error fetching/parsing data from the API:", error);
    return null;
  }
}
