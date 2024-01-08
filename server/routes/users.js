import express from "express";

import {
  getAllUsers,
  getAllPatients,
  getPatientsByDoctor,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  findByEmail,
  searchPatients,
  getAllDoctors,
  searchDoctors,
  deactivate,
  activate,
} from "../controllers/UserController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/allDoctors", getAllDoctors);

router.use(requireAuth);

router.get("/", getAllUsers);
router.get("/allPatients", getAllPatients);
router.get("/patientsByDoctor/:id", getPatientsByDoctor);
router.get("/findByEmail/:email", findByEmail);
router.get("/searchPatients/:searchInput/:id", searchPatients);
router.get("/searchDoctors/:searchInput", searchDoctors);

router.get("/:id", getUser);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.patch("/editUser/:id", updateUser);
router.patch("/deactivate/:id", deactivate);
router.patch("/activate/:id", activate);

export default router;
