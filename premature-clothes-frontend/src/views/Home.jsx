import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, Truck } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page" style={{ height: 'calc(100vh - 90px)', overflow: 'hidden' }}>
      {/* SECTION 1: HERO - 65% del alto visible */}
      {/* SECTION 1: HERO - 65% del alto visible */}
      <div
        className="hero-section text-white d-flex align-items-center"
        style={{
          // UsamosbackgroundImage para el gradiente y la URL de Babysec
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://www.babysec.cl/assets/uploads/article/7445f-bebes-prematuros.jpg')`,

          // Separamos las propiedades para que React no envíe warnings
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',

          width: '100%',
          height: '65%', // Ajustado para que respete el 65/35 que planeamos
          display: 'flex',
          marginTop: '-24px'
        }}
      >
        <Container>
          <Row>
            <Col md={8} lg={6}>
              <h1 className="display-4 fw-bold mb-2">Ropa minúscula para grandes valientes</h1>
              <p className="lead mb-3 fs-5">El primer marketplace para guerreros prematuros.</p>
              <Button
                variant="primary"
                size="md"
                className="px-4 py-2 fw-bold shadow"
                onClick={() => navigate('/catalogo')}
                style={{ backgroundColor: '#ff85a2', border: 'none' }}
              >
                Explorar Catálogo
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* SECTION 2: BENEFICIOS - 35% del alto visible */}
      <div className="d-flex align-items-center" style={{ height: '35%', backgroundColor: '#fff' }}>
        <Container>
          <Row className="text-center g-2">
            <Col xs={4}>
              <Heart size={32} color="#ff85a2" className="mb-2" />
              <h6 className="fw-bold mb-1">Telas Orgánicas</h6>
              <p className="text-muted small d-none d-md-block">Algodón 100% certificado.</p>
            </Col>
            <Col xs={4}>
              <ShieldCheck size={32} color="#ff85a2" className="mb-2" />
              <h6 className="fw-bold mb-1">Comunidad</h6>
              <p className="text-muted small d-none d-md-block">Hecho por y para padres.</p>
            </Col>
            <Col xs={4}>
              <Truck size={32} color="#ff85a2" className="mb-2" />
              <h6 className="fw-bold mb-1">Envíos Express</h6>
              <p className="text-muted small d-none d-md-block">Cada día cuenta.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;