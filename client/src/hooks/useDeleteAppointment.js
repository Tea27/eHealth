import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

import { userRole } from "../enums/UserRole";
export const useDeleteAppointment = () => {
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const deleteAppointment = async (data) => {
    setError(null);
    if (user.role === userRole.Patient) return;

    const response = await fetch(`/api/appointment/delete/${data._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    } else {
      await fetch(`/api/notification/create/${json._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          doctorID: data.doctorID,
          patientID: data.patientID,
          StartTime: data.StartTime,
          Subject: data.Subject,
          Description: data.Description,
          Location: data.Location,
          Text: "Appointment declined",
        }),
      });
    }
  };

  return { deleteAppointment, error };
};
