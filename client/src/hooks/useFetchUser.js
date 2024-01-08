import { useState } from "react";

export const useFetchUser = () => {
  const [error, setError] = useState(null);

  const fetchUser = async (id) => {
    const response = await fetch(`/api/user/${id}`);
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    } else {
      return json;
    }
  };
  return { fetchUser, userError: error };
};
