import express from "express";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import mainRoutes from "./routes/main.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import appointmentRoutes from "./routes/appointments.js";
import notificationRoutes from "./routes/notifications.js";
import conversationRoutes from "./routes/conversations.js";
import messageRoutes from "./routes/messages.js";
import apiRoutes from "./routes/icdApi.js";
import patientChartRoutes from "./routes/patientChart.js";
import ratingRoutes from "./routes/rating.js";
import task from "./utils/cronTask.js";

import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "production" });

const app = express();

//middleware
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(mainRoutes);
app.use(authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/icd", apiRoutes);
app.use("/api/patientChart", patientChartRoutes);
app.use("/api/rating", ratingRoutes);

const CONNECTION_URL = process.env.MONGO_URI;
const PORT = process.env.PORT || 5001;

mongoose.set("strictQuery", true);

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`connected to db & Server running on port ${PORT}`);
    })
  )
  .catch((error) => console.log(error.message));

task.start();
