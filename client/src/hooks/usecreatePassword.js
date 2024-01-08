import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useCreatePassword = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const createPassword = async (userID, token, password, confirmPassword) => {
    setError(null);

    const response = await fetch(`/api/auth/set-password/${userID}/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        confirmPassword,
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    } else {
      navigate("/Login");
    }
  };
  return { createPassword, error };
};
