import { useState } from "react";

export const useCreateReview = () => {
  const [error, setError] = useState(null);

  const createReview = async (userID, token, review, rateNumber) => {
    setError(null);

    const response = await fetch(`/api/rating/create/${userID}/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rateNumber,
        review,
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
  };
  return { createReview, error };
};
