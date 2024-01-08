import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import Nav from "./components/Nav";
import RegisterUser from "./pages/Register";
import SetPassword from "./pages/CreatePassword";
import RecurrenceEvents from "./pages/Appointment";
import Patients from "./pages/Patients";
import RegisterPatientForm from "./components/RegisterPatientForm";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import { React } from "react";
import { NotificationProvider } from "./hooks/useNotificationContext";
import Messenger from "./pages/Messenger";
import PatientInfo from "./pages/PatientInfo";
import AddPatientChart from "./pages/AddPatientChart";
import Footer from "./components/Footer";
import EditPatientForm from "./components/EditPatientForm";
import RatingForm from "./components/RatingForm";
import Doctors from "./pages/Doctors";
import RegisterForm from "./components/RegisterForm";
import EditDoctorForm from "./components/EditDoctorForm";
import Reviews from "./pages/Reviews";
import AddDoctor from "./pages/AddDoctor";

function App() {
  return (
    <div className='App'>
      <NotificationProvider>
        <BrowserRouter>
          <Nav />
          <div className='pages'>
            <Routes>
              <Route
                path='/set-password/:userID/:token'
                element={<SetPassword />}
              />
              <Route
                path='/registerPatient'
                element={<RegisterPatientForm />}
              />
              <Route path='/patients/:id' element={<PatientInfo />} />
              <Route path='/patients/edit/:id' element={<EditPatientForm />} />
              <Route
                path='/patients/addPatientChart/:id'
                element={<AddPatientChart />}
              />
              <Route path='/Rating/:id/:token' element={<RatingForm />} />

              {/* <Route path='Login' element={<Login />} /> */}
              <Route path='Login' element={<RegisterUser />} />
              <Route path='Register' element={<RegisterForm />} />

              <Route path='Home' element={<Home />} />
              <Route path='Appointments' element={<RecurrenceEvents />} />
              <Route path='Patients' element={<Patients />} />
              <Route path='Doctors' element={<Doctors />} />
              <Route path='/doctors/edit/:id' element={<EditDoctorForm />} />

              <Route path='Notifications' element={<Notifications />} />
              <Route path='Messenger' element={<Messenger />} />
              <Route path='Reviews' element={<Reviews />} />
              <Route path='AddDoctor' element={<AddDoctor />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </NotificationProvider>
    </div>
  );
}

export default App;
