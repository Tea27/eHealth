import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUpdateNotifications } from "../hooks/useUpdateNotifications";
import ReactPaginate from "react-paginate";
import { useDeleteNotification } from "../hooks/useDeleteNotification";
import NotAuthorized from "../components/NotAutorized";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuthContext();

  const updateNotifications = useUpdateNotifications();
  const { deleteNotification, error } = useDeleteNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    notifications?.slice(indexOfFirstPost, indexOfLastPost) || [];

  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const fetchNotifications = useCallback(async () => {
    const response = await fetch(
      `/api/notification/getAllNotifications/${user?.email}`,
      {
        headers: { Authorization: `Bearer ${user?.token}` },
      }
    );

    if (response.ok) {
      const json = await response.json();
      const formattedNotifications = json.map((notification) => ({
        ...notification,
        createdAt: new Date(notification.createdAt).toLocaleString(),

        viewed: true,
      }));
      setNotifications(formattedNotifications);
      updateNotifications(formattedNotifications);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [fetchNotifications, user]);

  const handleNotificationDelete = async (notification) => {
    await deleteNotification(notification._id);
    const updatedNotifications = notifications.filter(
      (notif) => notif._id !== notification._id
    );

    setNotifications(updatedNotifications);

    const newIndexOfFirstPost = (currentPage - 1) * postsPerPage;

    const newCurrentPage = Math.ceil((newIndexOfFirstPost + 1) / postsPerPage);

    setCurrentPage(newCurrentPage);
  };

  if (!user) {
    return <NotAuthorized />;
  }

  return (
    <div className='bg-gray-200 pt-5 flex justify-center h-screen'>
      <div className='notifications '>
        {currentPosts.map((notification) => (
          <div
            id='toast-simple'
            key={notification._id}
            className='flex items-center w-full max-w-3xl p-4 space-x-4 text-slate-500 bg-gray-100 divide-x divide-gray-200 rounded-lg shadow mb-1'
            role='alert'
            style={{
              whiteSpace: "pre-wrap",
              height: "100px",
              position: "relative",
            }}
          >
            <i className='bi bi-bell'></i>
            <p
              className='text-sm inline-block'
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                fontSize: "12px",
                whiteSpace: "nowrap",
                maxWidth: "100%",
              }}
            >
              {notification.createdAt}
            </p>
            <div
              className='flex-grow pl-4 text-sm notif-on-sm font-normal'
              style={{ overflow: "hidden", maxHeight: "60px" }}
            >
              {notification.text}
            </div>
            <div>
              <i
                class='bi bi-x-lg hover:cursor-pointer hover:bg-slate-500 hover:text-gray-100'
                onClick={() => handleNotificationDelete(notification)}
              ></i>
            </div>
            {error && <div className='error text-red-400'>{error}</div>}
          </div>
        ))}
        {notifications && notifications.length > postsPerPage && (
          <div className=' mt-4 pagination-on-sm flex justify-center '>
            <ul className='pagination'>
              <ReactPaginate
                onPageChange={paginate}
                pageCount={Math.ceil(notifications.length / postsPerPage)}
                previousLabel={"Prev"}
                nextLabel={"Next"}
                containerClassName={"pagination"}
                pageLinkClassName={"page-number"}
                previousLinkClassName={"page-item"}
                nextLinkClassName={"page-item"}
                breakClassName={"page-item"}
                activeLinkClassName={"active"}
              />
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
