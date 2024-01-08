import cron from "node-cron";
import { Appointment } from "../models/AppointmentModel.js";
import { createNotification } from "../controllers/NofiticationController.js";
import { appointmentStatus } from "../enums/AppointmentStatus.js";

const createNotificationForAppointment = async (appointment) => {
  const { doctorID, patientID, StartTime, Subject, Description, Location } =
    appointment;

  const mockReq = {
    params: { id: appointment._id },
    body: {
      doctorID,
      patientID,
      StartTime,
      Subject,
      Description,
      Location,
      Text: "Appointment reminder",
    },
  };
  const mockRes = {
    status: (code) => ({
      json: (data) => console.log("Response:", code, data),
    }),
  };

  // Call the controller function with mock objects
  await createNotification(mockReq, mockRes);
};

const checkTimeToNotify = async () => {
  console.log("running every minute: appointments");

  try {
    const now = new Date();
    const nowUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        0,
        0
      )
    ); // Convert to UTC with milliseconds as 000
    const oneHourFromNow = new Date(nowUTC.getTime() + 60 * 60 * 1000);
    const oneDayFromNow = new Date(nowUTC.getTime() + 24 * 60 * 60 * 1000);

    const appointments = await Appointment.find({
      $and: [
        {
          $or: [{ StartTime: oneHourFromNow }, { StartTime: oneDayFromNow }],
        },
        { status: appointmentStatus.Accepted },
      ],
    }).sort({ StartTime: 1 });

    for (const appointment of appointments) {
      await createNotificationForAppointment(appointment);
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
};

// Schedule tasks to be run on the server.
var task = cron.schedule("* 8-15,1 * * 1-5", checkTimeToNotify);
export default task;
