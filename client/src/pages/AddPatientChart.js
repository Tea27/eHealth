import React, { useEffect, useState } from "react";
import { Card } from "antd";
import DragAndDrop from "../components/DragAndDrop";
import useFileSelection from "../hooks/useFileSelection";
import { useParams, useNavigate } from "react-router-dom";
import { useUploadImage } from "../hooks/useUploadImage";

const AddPatientChart = () => {
  const { id } = useParams();
  const [conditions, setConditions] = useState([]);
  const [addFile, removeFile, selectedFiles] = useFileSelection();
  const [description, setDescription] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const { uploadImage, error } = useUploadImage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApiData = async () => {
      const response = await fetch(`/api/icd/fetchFromApi`);
      const data = await response.json();

      if (response.ok) {
        setConditions(data);
      }
    };
    fetchApiData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imagesData = await Promise.all(
      selectedFiles.map(async (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            const binaryData = new Uint8Array(arrayBuffer);
            const base64Data = btoa(
              binaryData.reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );

            resolve({
              data: base64Data,
              contentType: file.type,
            });
          };

          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsArrayBuffer(file);
        });
      })
    );

    const formData = {
      condition: selectedCondition,
      data: description,
      images: imagesData,
      patientID: id,
    };

    await uploadImage(formData);
    navigate(`/patients/${id}`);
  };

  const goToPatient = () => {
    navigate(`/patients/${id}`);
  };

  return (
    <div className='patientChart bg-gray-50 h-screen'>
      <div className='flex justify-center items-start min-h-screen pt-4'>
        <div
          className='bg-white rounded-2xl shadow-2xl flex flex-col w-full md:w-1/2 items-center max-w-4xl transition duration-1000 ease-out'
          key='patChart'
        >
          <p className='text-3xl text-violet-500 font-bold'>Appointment Data</p>
          <div className='flex flex-col items-center justify-center'>
            <form className='patForm' onSubmit={handleSubmit}>
              <Card
                style={{ margin: "auto", width: "80%" }}
                actions={[<button className='submitButton'>Submit</button>]}
              >
                <div style={{ maxHeight: "400px" }}>
                  <textarea
                    name='description'
                    className='rounded-2xl px-2 py-1 md:w-full border-[1px] border-violet-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0 resize-none'
                    placeholder='Enter description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    cols='60'
                    rows='4'
                  ></textarea>
                  <select
                    name='condition'
                    className='rounded-2xl px-2 py-1 md:w-full border-[1px] border-violet-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0'
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                  >
                    <option value=''>Select a condition</option>
                    {conditions.length > 0 && (
                      <>
                        <option value='none'>None</option>
                        {conditions.map((condition) => (
                          <option key={condition} value={condition}>
                            {condition}
                          </option>
                        ))}
                      </>
                    )}
                  </select>

                  <DragAndDrop addFile={addFile} removeFile={removeFile} />
                </div>
              </Card>
            </form>
          </div>
          <p
            className='text-violet-700 mb-4 text-sm cursor-pointer'
            onClick={() => goToPatient()}
          >
            Go back to patient data
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddPatientChart;
