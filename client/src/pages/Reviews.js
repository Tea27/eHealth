import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Card from "react-bootstrap/Card";
import { Rating } from "@material-tailwind/react";
import { Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMd } from "@fortawesome/free-solid-svg-icons";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(2);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = reviews?.slice(indexOfFirstPost, indexOfLastPost) || [];

  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const fetchRatings = async () => {
    const response = await fetch(`/api/rating/getAllRatings`);

    if (response.ok) {
      const json = await response.json();
      const formattedRatings = json.map((rating) => ({
        ...rating,
        createdAt: new Date(rating.createdAt).toLocaleString(),
      }));
      setReviews(formattedRatings);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  return (
    <div className='bg-gray-200 pt-3 flex justify-center h-screen'>
      <div className='ratings' style={{ width: "100%", maxWidth: "800px" }}>
        {currentPosts.map((rating) => (
          <Card className='custom-card mt-3'>
            <Card.Header>{rating.createdAt}</Card.Header>
            <Card.Body className='custom-card-body'>
              <Card.Title className='text-center'>
                <i class='bi bi-person-circle mr-2'></i>

                {rating.name}
              </Card.Title>
              <hr></hr>
              <Card.Subtitle className='mb-2 card-subtitle text-center'>
                <div>
                  <FontAwesomeIcon icon={faUserMd} className='mr-2' />
                  {rating.userID.firstName} {rating.userID.lastName}
                </div>
                <div className='ml-4 mt-2 flex justify-center' key={rating._id}>
                  <Rating value={rating.rateNumber} readonly />
                  <Typography className='font-medium ml-2'>
                    {rating.rateNumber}.0 Rated
                  </Typography>
                </div>
              </Card.Subtitle>
              <Card.Text className='mt-4'>{rating.review}</Card.Text>
            </Card.Body>

            {/* <div>
              <i
                class='bi bi-x-lg hover:cursor-pointer hover:bg-slate-500 hover:text-gray-100'
                onClick={() => handleNotificationDelete(notification)} // Add click event handler
              ></i>
            </div> */}
          </Card>
        ))}
        {reviews && reviews.length > postsPerPage && (
          <div className=' mt-4 pagination-on-sm flex justify-center '>
            <ul className='pagination'>
              <ReactPaginate
                onPageChange={paginate}
                pageCount={Math.ceil(reviews.length / postsPerPage)}
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

export default Reviews;
