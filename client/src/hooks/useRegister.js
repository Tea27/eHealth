import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { userRole } from "../enums/UserRole";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const register = async (firstName, lastName, email, phone, info) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        info,
        role: "doctor",
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      if (user && user.role === userRole.Admin) {
        navigate("/Doctors");
      } else {
        setIsLoading(false);
        window.location.reload();
      }
    }
  };

  return { register, isLoading, response: { error } };
};
