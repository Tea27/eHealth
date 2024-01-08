import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { appointmentStatus } from "../enums/AppointmentStatus";
import { appointmentType } from "../enums/AppointmentType";
export const useCreateAppointment = () => {
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const createAppointment = async (data, type) => {
    setError(null);
    type = type === "" ? appointmentType.Routine : type;
    const response = await fetch(`/api/appointment/create/${user.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        Subject: data.Subject,
        Description: data.Description,
        Location: data.Location,
        StartTime: data.StartTime,
        EndTime: data.EndTime,
        Type: type,
        State: appointmentStatus.Pending,
      }),
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    } else {
      await fetch(`/api/notification/create/${json.appointment._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          doctorID: json.appointment.doctorID,
          patientID: json.appointment.patientID,
          StartTime: data.StartTime,
          Subject: data.Subject,
          Description: data.Description,
          Location: data.Location,
          Text: "New appointment scheduled",
        }),
      });
    }
  };

  return { createAppointment, response: { error } };
};
