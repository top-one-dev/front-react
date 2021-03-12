import React from "react";
import Slider from "react-slick";
import './HomeSlider.css';


class HomeSlider extends React.Component {
  render() {
    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      mobileFirst: true,
    };
    return (
      <Slider {...settings} className="homeslider">
        <div>
          <img src={require('../../assets/img/slide1.jpg')} alt="C-SocialNet" className="img-responsive" />
        </div>
        <div>
          <img src={require('../../assets/img/slide2.jpg')} alt="C-SocialNet" className="img-responsive" />
        </div>
        <div>
          <img src={require('../../assets/img/slide3.jpg')} alt="C-SocialNet" className="img-responsive" />
        </div>
        <div>
          <img src={require('../../assets/img/slide4.jpg')} alt="C-SocialNet" className="img-responsive" />
        </div>
      </Slider>
    );
  }
}

export default HomeSlider;