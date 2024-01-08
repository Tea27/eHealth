import Carousel from "react-bootstrap/Carousel";
import ExampleCarouselImage from "./ExampleCarouselImage";
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMd } from "@fortawesome/free-solid-svg-icons";
import { Rating } from "@material-tailwind/react";
import { Typography } from "antd";

function CarouselFadeExample() {
  const [doctors, setDoctors] = useState(null);
  const [ratings, setRatings] = useState(null);

  const fetchDoctors = async () => {
    const response = await fetch("/api/user/allDoctors");

    const json = await response.json();

    if (response.ok) {
      setDoctors(json);
    }
  };

  const fetchRatings = async () => {
    const response = await fetch("/api/rating/getAverage");

    const json = await response.json();

    if (response.ok) {
      setRatings(json);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchRatings();
  }, []);

  return (
    <Carousel fade>
      {doctors &&
        doctors.map((doctor, index) => (
          <Carousel.Item key={index}>
            <ExampleCarouselImage text={doctor.email} />
            <Carousel.Caption className='carousel-caption'>
              <Card className='custom-card'>
                <div className='flex'>
                  <div className='ml-20 mr-16 pt-2'>
                    <FontAwesomeIcon
                      icon={faUserMd}
                      style={{ fontSize: "2.5rem" }}
                    />
                  </div>
                  <div>
                    <Card.Title>
                      <h3>
                        {doctor.firstName} {doctor.lastName}
                      </h3>
                    </Card.Title>
                    <Card.Subtitle className='mb-2 card-subtitle'>
                      {doctor.email}
                    </Card.Subtitle>
                  </div>
                  {ratings &&
                    ratings.map((rating) =>
                      rating._id === doctor._id ? (
                        <div key={rating._id} className='mt-2 ml-40'>
                          <Rating value={rating.averageRating} readonly />
                          <Typography className='font-medium'>
                            {rating.averageRating}.0 Rated
                          </Typography>
                        </div>
                      ) : null
                    )}
                </div>
                <hr></hr>

                <Card.Header className='custom-card-header'>Quote</Card.Header>

                <Card.Body className='custom-card-body'>
                  <blockquote className='blockquote mb-0'>
                    <p className='color-black'>" {doctor.info} "</p>
                    <footer className='blockquote-footer'>
                      {doctor.firstName} {doctor.lastName}
                    </footer>
                  </blockquote>
                </Card.Body>
              </Card>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
    </Carousel>
  );
}

export default CarouselFadeExample;
