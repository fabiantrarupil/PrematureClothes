import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Baby, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer 
      className="py-4 mt-auto border-top" 
      style={{ backgroundColor: 'var(--noche-profunda)', color: 'white' }}
    >
      <Container>
        <Row className="align-items-center gy-4">
          
          {/* Logo y Eslogan - Izquierda */}
          <Col md={4} className="text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-2">
              <Baby size={22} color="#ff8fab" className="me-2" />
              <span className="fw-bold h5 mb-0" style={{ color: 'var(--sweet-pink)' }}>
                PrematureClothes
              </span>
            </div>
            <p className="text-secondary small mb-0">
              Acompañando cada pequeño gran paso.
            </p>
            <p className="text-muted small mt-1" style={{ fontSize: '0.75rem' }}>
              © 2026 Todos los derechos reservados.
            </p>
          </Col>

          {/* Contacto Real - Centro */}
          <Col md={4} className="text-center">
            <h6 className="text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--sky-highlight)' }}>
              Contacto Directo
            </h6>
            <div className="d-flex flex-column align-items-center gap-2 small">
              <div className="d-flex align-items-center">
                <Phone size={14} className="me-2 text-secondary" />
                <span>+569 2640 6253</span>
              </div>
              <div className="d-flex align-items-center">
                <Mail size={14} className="me-2 text-secondary" />
                <span>contacto@prematureclothes.cl</span>
              </div>
              <div className="d-flex gap-3 mt-2">
                <Link to="/catalogo" className="text-decoration-none text-secondary hover-link">Catálogo</Link>
                <Link to="/perfil" className="text-decoration-none text-secondary hover-link">Mi Cuenta</Link>
              </div>
            </div>
          </Col>

          {/* Créditos - Derecha */}
          <Col md={4} className="text-center text-md-end">
            <div className="mb-2">
              <Instagram size={20} className="text-secondary cursor-pointer hover-link" />
            </div>
            <div className="mt-3">
              <span className="text-muted small d-block">Proyecto Final Bootcamp</span>
              <span className="fw-bold" style={{ color: 'var(--sky-highlight)' }}>
                Impulsado por FTWebDeveloper
              </span>
            </div>
          </Col>

        </Row>
      </Container>
    </footer>
  );
};

export default Footer;