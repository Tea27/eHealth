import { useState } from "react";
import { appointmentStatus } from "../enums/AppointmentStatus";
import { useAuthContext } from "../hooks/useAuthContext.js";

export const useUpdateAppointment = () => {
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const updateAppointment = async (data, type, state) => {
    setError(null);
    const requestBody = {
      Subject: data.Subject,
      Description: data.Description,
      Location: data.Location,
      StartTime: data.StartTime,
      EndTime: data.EndTime,
    };

    if (type) {
      requestBody.Type = type;
    }

    if (state) {
      requestBody.State = state;
    }

    const response = await fetch(
      `/api/appointment/updateAppointment/${data._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    } else {
      if (state === appointmentStatus.Accepted) {
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
            Text: "Appointment accepted",
          }),
        });
      }
    }
  };

  return { updateAppointment, updateResponse: { error } };
};
