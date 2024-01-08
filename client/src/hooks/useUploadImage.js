import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useUploadImage = () => {
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const uploadImage = async (formData) => {
    try {
      const response = await fetch("/api/patientChart/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      }
    } catch (error) {
      setError(error);
    }
  };
  return { uploadImage, error };
};
