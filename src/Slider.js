import Carousel from 'react-bootstrap/Carousel';
import banner1 from './img/banner_home1.png';
import banner2 from './img/banner_home2.png';
import banner3 from './img/banner_box1.jpg';


function ControlledCarousel() {
  return (
    <Carousel interval={2000} fade>
      <Carousel.Item>
      <img className="d-block w-100" src={banner1} alt="First slide" />


        <Carousel.Caption>
          <h3>الشريحة الأولى</h3>
          <p>نص تجريبي للشريحة الأولى</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
      <img className="d-block w-100" src={banner3} alt="First slide" />
 <Carousel.Caption>
          <h3>الشريحة الثانية</h3>
          <p>نص تجريبي للشريحة الثانية</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
      <img className="d-block w-100" src={banner2} alt="First slide" />
 <Carousel.Caption>
          <h3>الشريحة الثالثة</h3>
          <p>نص تجريبي للشريحة الثالثة</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;
