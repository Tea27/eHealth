import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { userStatus } from "../enums/UserStatus";

export function DeactivationConfirmation({
  isOpen,
  closeModal,
  children,
  selectedUser,
}) {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);

  const changeStatus = async () => {
    const url =
      selectedUser.state === userStatus.Active ? "deactivate" : "activate";
    const response = await fetch(`/api/user/${url}/${selectedUser._id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user?.token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      closeModal();
      window.location.reload();
    }
  };
  return (
    <>
      <div>
        {isOpen ? (
          <>
            <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative w-auto my-6 mx-auto max-w-3xl'>
                <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                  <div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                    <h3 className='text-3xl font-semibold'>
                      {selectedUser.state === userStatus.Active ? (
                        <>Deactivation </>
                      ) : (
                        <>Activation </>
                      )}
                      Confirmation
                    </h3>
                    <button
                      className='p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                      onClick={closeModal}
                    >
                      <span className='bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none'>
                        ×
                      </span>
                    </button>
                  </div>
                  <div className='relative p-6 flex-auto'>
                    <p className='my-4 text-slate-500 text-lg leading-relaxed'>
                      Are you sure you want to
                      {selectedUser.state === userStatus.Active ? (
                        <> deactivate </>
                      ) : (
                        <> activate </>
                      )}
                      selected user?
                    </p>
                  </div>
                  <div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b'>
                    <button
                      className='text-purple-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                      type='button'
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      className='bg-purple-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                      type='button'
                      onClick={changeStatus}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {error && <div className='error text-red-400'>{error}</div>}
            <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
          </>
        ) : null}
      </div>
    </>
  );
}
