import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import './aboutus.css';

const AboutUs = () => {
  return (
    <Container className="about-us py-5">
      <Row className="justify-content-center text-center">
        <Col md={8}>
        <h2 className="mb-4 text-center" style={{direction:"rtl"}}>
  مرحبًا بكم في Mister Mobile
</h2>

          <p className="lead" style={{direction:"rtl"}}>
            Mister Mobile هو وجهتك المثالية لشراء أحدث الهواتف الذكية والإكسسوارات الأصلية،
            بالإضافة إلى تقديم خدمات صيانة وإصلاح احترافية لجميع أنواع الهواتف المحمولة.
            نحن نؤمن بأهمية توفير منتجات عالية الجودة بأسعار تنافسية، مع ضمان أفضل تجربة للعملاء.
          </p>
        </Col>
      </Row>
      
      <Row className="text-center my-4" style={{direction:"rtl"}}>
        <Col md={4} className="mb-3 cardBody">
          <Card className="shadow-sm p-3">
            <Card.Body>
              <h5>📱 أحدث الهواتف الذكية</h5>
              <p>نوفر أحدث الأجهزة من العلامات التجارية الموثوقة.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3 cardBody">
          <Card className="shadow-sm p-3">
            <Card.Body>
              <h5>🔌 إكسسوارات أصلية</h5>
              <p>كفرات، سماعات، شواحن، وحمايات الشاشة.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3 cardBody">
          <Card className="shadow-sm p-3">
            <Card.Body>
              <h5>🛠 صيانة وإصلاح</h5>
              <p>إصلاح احترافي بأيدي خبراء معتمدين.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="text-center" style={{direction:"rtl"}}>
      <Col>
          <h4 className="fw-bold d-flex align-items-center justify-content-center p-3">
            عناوين الفروع
          </h4>

          <p className="fw-semibold"><i className="fa-solid fa-map-marker-alt me-2 text-secondary"></i> شارع 15 , سوهاج</p>
          <p className="fw-semibold"><i className="fa-solid fa-map-marker-alt me-2 text-secondary"></i> شارع أحمد بدوي, المراغة</p>
          <p className="fw-semibold"><i className="fa-solid fa-map-marker-alt me-2 text-secondary"></i> شارع عبدالمنعم رياض, المراغة</p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
