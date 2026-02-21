import { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { ProductContext } from '../context/ProductContext';
import { ShoppingCart, Trash2, HeartOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Favoritos = () => {
  const {
    favoritos = [],
    toggleFavorito,
    agregarAlCarrito
  } = useContext(ProductContext);

  const navigate = useNavigate();

  return (
    <Container className="my-5 pt-4">
      <div className="d-flex align-items-center mb-4">
        <h2 className="fw-bold m-0">Mis Favoritos ❤️</h2>
        <span className="ms-3 badge rounded-pill bg-light text-dark border">
          {favoritos.length} artículos
        </span>
      </div>

      {favoritos.length === 0 ? (
        <Card className="text-center p-5 border-0 shadow-sm rounded-4 bg-white">
          <Card.Body>
            <HeartOff size={60} className="text-muted mb-3 opacity-25" />
            <p className="text-muted fs-5">Aún no tienes productos guardados.</p>
            <Button
              variant="primary"
              className="px-4 py-2 border-0 fw-bold mt-2"
              style={{ backgroundColor: '#ff85a2' }}
              onClick={() => navigate('/catalogo')}
            >
              Explorar Catálogo
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {favoritos.map((prod, index) => {
            // LLAVE DE SEGURIDAD: 
            // Si prod.id_producto no existe, usa el index para que React no reclame.
            const uniqueKey = prod.id_producto || `fav-${index}`;

            return (
              <Col key={uniqueKey} xs={12} md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                  {/* ... resto del contenido del Card ... */}
                  <div
                    onClick={() => navigate(`/producto/${prod.id_producto}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Img
                      variant="top"
                      src={prod.imagen_url || 'https://placehold.co/400'}
                      style={{ height: '220px', objectFit: 'contain', padding: '20px' }}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold text-truncate mb-1">
                      {prod.nombre || "Producto sin nombre"}
                    </Card.Title>

                    <p className="text-muted small flex-grow-1 text-truncate">
                      {prod.descripcion || "Sin descripción disponible"}
                    </p>

                    <h5 className="fw-bold" style={{ color: '#ff85a2' }}>
                      ${Number(prod.precio || 0).toLocaleString('es-CL')}
                    </h5>

                    <div className="d-flex gap-2 mt-3">
                      <Button
                        variant="primary"
                        className="flex-grow-1 border-0 fw-bold d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: '#ff85a2' }}
                        onClick={() => agregarAlCarrito(prod)}
                      >
                        <ShoppingCart size={18} className="me-2" /> Añadir
                      </Button>
                      <Button
                        variant="outline-danger"
                        className="d-flex align-items-center justify-content-center"
                        onClick={() => toggleFavorito(prod)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default Favoritos;