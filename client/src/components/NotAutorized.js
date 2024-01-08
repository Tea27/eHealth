const NotAuthorized = () => {
  return (
    <div className='flex justify-center items-start min-h-screen mt-20'>
      <div
        className='justify-center bg-gradient-to-b from-gray-600 to-gray-400 text-white rounded-2xl shadow-2xl flex flex-col w-full md:w-1/2 items-center max-w-4xl transition duration-1000 ease-in'
        key='regForm'
      >
        <h3 className='p-3 text-3xl font-bold text-white'>
          <i class='bi bi-eye-slash'> Access denied</i>
        </h3>

        <div className='inline-block border-[1px] w-20 border-white border-solid'></div>
        <div className='flex flex-col space-y-2 m-4 items-center justify-center text-white'>
          <div>
            You don't have the correct permissions to visit this page...
          </div>
          <div>
            Please log in with the corresponding credentials to view content!
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
