import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Carousel, Col, Container, Row } from "react-bootstrap";
import { ActivityResponse } from "../../types/activity"; // assuming you have a type definition for Activity
import { getAllActivities } from "../../utils/apiFunctions";

const ActivityCarousel: React.FC = () => {
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getAllActivities()
      .then((data: ActivityResponse[]) => {
        setActivities(data);
        setIsLoading(false);
      })
      .catch((error: Error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="mt-5">Loading activities....</div>;
  }
  if (errorMessage) {
    return <div className=" text-danger mb-5 mt-5">Error : {errorMessage}</div>;
  }

  return (
    <section className="bg-light mb-5 mt-5 shadow">
      <Link to={"/browse-all-activities"} className="hote-color text-center">
        Browse all activities
      </Link>

      <Container>
        <Carousel indicators={false}>
          {[...Array(Math.ceil(activities.length / 4))].map((_, index) => (
            <Carousel.Item key={index}>
              <Row>
                {activities.slice(index * 4, index * 4 + 4).map((activity: ActivityResponse) => (
                  <Col key={activity.id} className="mb-4" xs={12} md={6} lg={3}>
                    <Card>
                      <Link to={`/book-activity/${activity.id}`}>
                        <Card.Img
                          variant="top"
                          src={`data:image/png;base64, ${activity.photo}`}
                          alt="Activity Photo"
                          className="w-100"
                          style={{ height: "200px" }}
                        />
                      </Link>
                      <Card.Body>
                        <Card.Title className="hotel-color">{activity.activityType}</Card.Title>
                        <Card.Title className="activity-price">${activity.price}/night</Card.Title>
                        <div className="flex-shrink-0">
                          <Link to={`/book-activity/${activity.id}`} className="btn btn-hotel btn-sm">
                            Book Now
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default ActivityCarousel;
