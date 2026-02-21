import { useContext } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { ProductContext } from '../context/ProductContext';
import { User, Package, Heart, LogOut, Settings, MapPin, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, favoritos, carrito } = useContext(ProductContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <h3 className="mb-4">Debes iniciar sesión para ver tu perfil</h3>
        <Button onClick={() => navigate('/login')} style={{ backgroundColor: '#ff85a2', border: 'none' }}>Ir al Login</Button>
      </Container>
    );
  }

  // 🛡️ QA FIX: Intentamos obtener la dirección de varios posibles nombres de columna
  // Priorizamos 'direccion' que es el estándar de tu DB
  const direccionAMostrar = user.direccion || user.direccion_envio || user.direccion_completa || 'No registrada';

  return (
    <Container className="my-5 pt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header del Perfil */}
            <div className="p-4 text-white text-center position-relative" style={{ backgroundColor: '#ff85a2' }}>
              <Button
                variant="light"
                size="sm"
                className="position-absolute top-0 end-0 m-3 rounded-circle shadow-sm border-0"
                style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => navigate('/editar-perfil')}
                title="Editar mi perfil"
              >
                <Settings size={20} color="#ff85a2" />
              </Button>

              <div className="bg-white rounded-circle d-inline-block p-3 mb-3 shadow-sm">
                <User size={50} color="#ff85a2" />
              </div>

              <h2 className="fw-bold mb-0">{user.nombre_completo || user.nombre || 'Usuario'}</h2>
              <p className="opacity-75 mb-0">{user.email}</p>
              <span className="badge rounded-pill bg-light text-dark mt-2 px-3 py-2">
                <ShieldCheck size={14} className="me-1" />
                {user.rol?.toUpperCase() || 'CLIENTE'}
              </span>
            </div>

            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Información de Entrega</h5>
              <div className="d-flex align-items-center p-3 rounded-3 mb-4" style={{ backgroundColor: '#fff0f3' }}>
                <MapPin className="text-danger me-3" size={24} />
                <div>
                  <small className="text-muted d-block">Dirección registrada:</small>
                  {/* ✅ Aquí usamos la variable corregida */}
                  <span className="fw-semibold">{direccionAMostrar}</span>
                </div>
              </div>

              <h5 className="fw-bold mb-3">Mi Actividad</h5>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex align-items-center py-3 border-0 px-0">
                  <Package className="me-3 text-muted" size={20} />
                  <span>Mis Compras ({carrito?.length || 0})</span>
                  <Button variant="link" className="ms-auto p-0 text-decoration-none" style={{ color: '#ff85a2' }}>Ver historial</Button>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center py-3 border-0 px-0">
                  <Heart className="me-3 text-muted" size={20} />
                  <span>Mis Favoritos ({favoritos?.length || 0})</span>
                  <Button
                    variant="link"
                    className="ms-auto p-0 text-decoration-none"
                    style={{ color: '#ff85a2' }}
                    onClick={() => navigate('/favoritos')}
                  >
                    Ver lista
                  </Button>
                </ListGroup.Item>
              </ListGroup>

              <div className="mt-5 border-top pt-4 text-center">
                <Button variant="outline-danger" className="border-0 fw-bold px-4" onClick={logout}>
                  <LogOut size={18} className="me-2" /> Cerrar Sesión
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;