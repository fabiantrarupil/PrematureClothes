import { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { Eye, ShoppingCart } from 'lucide-react';

const CatalogoProductos = () => {
  // Consumimos los productos que vienen de la DB a través del Contexto
  const { productos, agregarAlCarrito } = useContext(ProductContext);
  const navigate = useNavigate();

  return (
    <Container className="my-5 pt-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold" style={{ color: '#ff85a2' }}>Nuestro Catálogo Especializado</h2>
        <p className="text-muted">Prendas diseñadas con amor y rigor médico para prematuros.</p>
      </div>

      <Row>
        {productos && productos.length > 0 ? (
          productos.map((producto) => (
            <Col key={producto.id} sm={12} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                {/* 1. Ajustado a 'imagen_url' de tu DB */}
                <Card.Img 
                  variant="top" 
                  src={producto.imagen_url || 'https://via.placeholder.com/200'} 
                  style={{ height: '200px', objectFit: 'contain', padding: '10px' }} 
                />
                
                <Card.Body className="d-flex flex-column">
                  {/* 2. Ajustado a 'titulo' de tu DB */}
                  <Card.Title className="fw-bold fs-6">{producto.titulo}</Card.Title>
                  
                  {/* 3. Ajustado a 'descripcion' de tu DB con safe check (?) */}
                  <Card.Text className="text-muted small flex-grow-1">
                    {producto.descripcion ? `${producto.descripcion.substring(0, 60)}...` : 'Sin descripción disponible'}
                  </Card.Text>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fw-bold fs-5" style={{ color: '#ff85a2' }}>
                      {/* 4. Aseguramos que el precio sea número para toLocaleString */}
                      ${Number(producto.precio).toLocaleString('es-CL')}
                    </span>
                    
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={() => navigate(`/producto/${producto.id}`)}
                      >
                        <Eye size={16} className="me-1" /> Ver
                      </Button>
                      
                      <Button
                        variant="primary"
                        size="sm"
                        style={{ backgroundColor: '#ff85a2', border: 'none' }}
                        onClick={() => agregarAlCarrito(producto)}
                      >
                        <ShoppingCart size={16} className="me-1" /> Añadir
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <p className="text-muted">Cargando productos desde la base de datos...</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default CatalogoProductos;