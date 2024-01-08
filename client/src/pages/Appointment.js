import React, { useEffect, useState, useRef } from "react";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  WorkWeek,
  Inject,
} from "@syncfusion/ej2-react-schedule";
import { extend } from "@syncfusion/ej2-base";
import { PropertyPane } from "../common/PropertyPane.js";
import ReactDOM from "react-dom";
import { useCreateAppointment } from "../hooks/useCreateAppointment";
import { appointmentType } from "../enums/AppointmentType";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { userRole } from "../enums/UserRole.js";
import { appointmentStatus } from "../enums/AppointmentStatus.js";
import { useUpdateAppointment } from "../hooks/useUpdateAppointment.js";
import { applyCategoryColor } from "../helper/ApplyCategoryCollor.js";

import { useDeleteAppointment } from "../hooks/useDeleteAppointment.js";

import NotAuthorized from "../components/NotAutorized";

const RecurrenceEvents = () => {
  const { user } = useAuthContext();

  const scheduleObj = useRef(null);
  const [appointments, setAppointments] = useState([]);

  const [eventSettings, setEventSettings] = useState({
    dataSource: extend([], appointments, null, true),
    allowAdding: true,
  });
  const editorRef = useRef(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const { createAppointment, response } = useCreateAppointment();
  const { updateAppointment, updateResponse } = useUpdateAppointment();
  const { deleteAppointment, error } = useDeleteAppointment();

  const CustomPopupEditor = ({
    initialType,
    initialState,
    handleTypeChange,
    handleStateChange,
  }) => {
    const [selectedType, setSelectedType] = useState(initialType);
    const [selectedState, setSelectedState] = useState(initialState);

    useEffect(() => {
      setSelectedType(initialType);
      setSelectedState(initialState);
    }, [initialType, initialState]);

    return (
      <div className='custom-popup-editor'>
        <div className='mt-3'>
          <label>
            <input
              type='radio'
              name='radioType'
              value={appointmentType.Routine}
              checked={selectedType === appointmentType.Routine}
              onChange={(e) => {
                setSelectedType(e.target.value);
                handleTypeChange(e);
              }}
            />
            <span className='ml-1'> {appointmentType.Routine}</span>
          </label>
          <label>
            <input
              type='radio'
              name='radioType'
              value={appointmentType.Urgent}
              checked={selectedType === appointmentType.Urgent}
              className='ml-3'
              onChange={(e) => {
                setSelectedType(e.target.value);
                handleTypeChange(e);
              }}
            />
            <span className='ml-1'>{appointmentType.Urgent}</span>
          </label>
        </div>
        {user.role !== userRole.Patient && (
          <div className='mt-3'>
            <label>
              <input
                type='radio'
                name='radioStatus'
                value={appointmentStatus.Accepted}
                checked={selectedState === appointmentStatus.Accepted}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  handleStateChange(e);
                }}
              />
              <span className='ml-1'>{appointmentStatus.Accepted}</span>
            </label>
            <label>
              <input
                type='radio'
                name='radioStatus'
                value={appointmentStatus.Pending}
                checked={selectedState === appointmentStatus.Pending}
                className='ml-3'
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  handleStateChange(e);
                }}
              />
              <span className='ml-1'>{appointmentStatus.Pending}</span>
            </label>
          </div>
        )}
        {response.error && (
          <div className='error-message'>{response.error}</div>
        )}
      </div>
    );
  };
  const onEventRendered = (args) => {
    applyCategoryColor(args, scheduleObj.current.currentView);
  };

  const onActionBegin = async (args, e) => {
    if (!user) {
      return;
    }
    if (args.requestType === "eventCreate") {
      const appointmentData = args.data[0];
      await createAppointment(appointmentData, selectedType);

      const categoryColor = "#ea7a57";

      const updatedAppointment = {
        ...appointmentData,
        CategoryColor: categoryColor,
      };
      setAppointments((prevAppointments) => {
        const updatedAppointments = [...prevAppointments];
        updatedAppointments[updatedAppointments.length - 1] =
          updatedAppointment;
        return updatedAppointments;
      });

      setEventSettings((prevEventSettings) => {
        const updatedDataSource = [...prevEventSettings.dataSource];
        updatedDataSource[updatedDataSource.length - 1] = updatedAppointment;
        return {
          ...prevEventSettings,
          dataSource: updatedDataSource,
        };
      });
    } else if (args.requestType === "eventChange") {
      // Edit action
      const appointmentData = args.data;
      await updateAppointment(appointmentData, selectedType, selectedState);

      const categoryColor =
        selectedState === appointmentStatus.Accepted ? "#1aaa55" : "#ea7a57";

      const updatedAppointment = {
        ...appointmentData,
        CategoryColor: categoryColor,
      };

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === updatedAppointment._id
            ? updatedAppointment
            : appointment
        )
      );

      setEventSettings((prevEventSettings) => ({
        ...prevEventSettings,
        dataSource: prevEventSettings.dataSource.map((appointment) =>
          appointment._id === updatedAppointment._id
            ? updatedAppointment
            : appointment
        ),
      }));
    } else if (args.requestType === "eventRemove") {
      const appointmentData = args.data[0];

      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => {
          return appointment._id !== appointmentData._id;
        })
      );

      setEventSettings((prevEventSettings) => ({
        ...prevEventSettings,
        dataSource: prevEventSettings.dataSource.filter(
          (appointment) => appointment._id !== appointmentData._id
        ),
      }));
      await deleteAppointment(appointmentData);
    }
  };

  const onPopupOpen = (args) => {
    if (args.type === "Editor" && !editorRef.current) {
      renderCustomPopupEditor(args.data);
      const formElement = args.element.querySelector(".e-schedule-form");

      if (formElement) {
        const startElement = formElement.querySelector(".e-start");
        const endElement = formElement.querySelector(".e-end");
        const allDayElement = formElement.querySelector(".e-all-day-container");
        const timeZoneElement = formElement.querySelector(
          ".e-all-day-time-zone-row"
        );
        const recurrenceEditor = args.element.querySelector(
          "#_recurrence_editor"
        );

        if (startElement && endElement && user) {
          if (user.role === userRole.Patient) {
            startElement.setAttribute("readonly", true);
            endElement.setAttribute("readonly", true);
          }
        }

        if (recurrenceEditor) recurrenceEditor.style.display = "none";
        if (allDayElement) allDayElement.remove();
        if (timeZoneElement) timeZoneElement.remove();

        if (response.error) args.cancel = true;
      }
    }
  };

  const renderCustomPopupEditor = (data) => {
    editorRef.current = document.createElement("div");

    ReactDOM.render(
      <CustomPopupEditor
        initialType={data.Type || appointmentType.Routine}
        initialState={data.State || appointmentStatus.Pending}
        handleTypeChange={(e) => setSelectedType(e.target.value)}
        handleStateChange={(e) => setSelectedState(e.target.value)}
        patientID={data.patientID}
      />,
      editorRef.current
    );

    const formElement = document.querySelector(".e-schedule-form");
    formElement.appendChild(editorRef.current);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch(`/api/appointment/getAll/${user?._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setAppointments(json);
        setEventSettings(() => ({
          allowAdding: true,
          allowEditing: user?.role !== userRole.Patient ? true : false,
          allowDeleting: user?.role !== userRole.Patient ? true : false,
          dataSource: [...json],
        }));
      }
    };

    if (user) {
      fetchAppointments();
    }

    return () => {
      if (editorRef.current) {
        ReactDOM.unmountComponentAtNode(editorRef.current);
        editorRef.current.remove();
        editorRef.current = null;
      }
    };
  }, [user, user?.email]);

  if (!user) {
    return <NotAuthorized />;
  }

  return (
    <div className='schedule-control-section'>
      <div className='col-lg-9 control-section'>
        <div className='control-wrapper'>
          <ScheduleComponent
            className='schedule-full-width'
            height='650px'
            ref={scheduleObj}
            eventSettings={eventSettings}
            popupOpen={onPopupOpen}
            actionBegin={onActionBegin}
            eventRendered={onEventRendered}
          >
            <ViewsDirective>
              <ViewDirective option='Day' startHour='9:00' endHour='17:00' />
              <ViewDirective
                option='WorkWeek'
                startHour='9:00'
                endHour='17:00'
              />
            </ViewsDirective>
            <Inject services={[Day, WorkWeek]} />
          </ScheduleComponent>
        </div>
      </div>
      <div className='col-lg-3 property-section'>
        <PropertyPane>
          <table id='property' title='Properties' style={{ width: "100%" }}>
            <tbody>
              <tr style={{ height: "50px" }}>
                <td style={{ width: "100%" }}></td>
              </tr>
            </tbody>
          </table>
        </PropertyPane>
      </div>
    </div>
  );
};

export default RecurrenceEvents;
