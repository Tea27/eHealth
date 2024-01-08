import React from "react";
import { Accordion, Card, useAccordionButton } from "react-bootstrap";
import Statistic from "../components/Statistics";
import "bootstrap/dist/css/bootstrap.min.css";
import CarouselFadeExample from "../components/Carousel";
const CustomToggle = ({ children, eventKey }) => {
  const decoratedOnClick = useAccordionButton(eventKey);

  return <Card.Header onClick={decoratedOnClick}>{children}</Card.Header>;
};

const Home = () => {
  return (
    <div>
      <Accordion defaultActiveKey='0'>
        <Card className='accordion-card'>
          <CustomToggle eventKey='0'>
            <i className='bi bi-heart-pulse'> About</i>
          </CustomToggle>

          <Accordion.Collapse eventKey='0'>
            <Card.Body className='background-image-card'>
              <div className='background-image-home'>
                <h1>Welcome to eHealth</h1>
                <p>
                  Schedule your appointments and receive notification reminders.
                  Consult with doctors through our live chat app. Review your
                  patient charts and more...
                </p>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>

        <Card className='accordion-card'>
          <CustomToggle eventKey='1'>
            <i className='bi bi-bar-chart '> Statistics</i>
          </CustomToggle>

          <Accordion.Collapse eventKey='1'>
            <Card.Body className='card-body'>
              <Statistic />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className='accordion-card'>
          <CustomToggle eventKey='2'>
            <i className='bi bi-star-half'> Reviews</i>
          </CustomToggle>

          <Accordion.Collapse eventKey='2'>
            <Card.Body className='background-image-card'>
              <div>
                <CarouselFadeExample />
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default Home;
