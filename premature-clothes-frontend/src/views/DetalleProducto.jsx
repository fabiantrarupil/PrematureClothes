import { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { ProductContext } from '../context/ProductContext';
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';

const DetalleProducto = () => {
  const { id } = useParams();
  
  // 1. Obtenemos datos con valores por defecto para evitar errores de 'undefined'
  const { 
    productos = [], 
    agregarAlCarrito, 
    favoritos = [], 
    toggleFavorito 
  } = useContext(ProductContext);
  
  const navigate = useNavigate();

  // 2. Buscamos el producto actual (coherencia con id o id_producto)
  const producto = productos.find((p) => (p.producto_id || p.id) === Number(id));

  // 3. Lógica de productos relacionados segura
  const productosRelacionados = productos
    .filter((p) => (p.producto_id || p.id) !== Number(id))
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Scroll al inicio al cambiar de producto
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // 4. Pantalla de carga o error si no existe el producto
  if (!producto) {
    return (
      <Container className="mt-5 text-center">
        <h3 className="text-muted">Buscando en PrematureClothes...</h3>
        <Button variant="primary" onClick={() => navigate('/catalogo')} className="mt-3" style={{ backgroundColor: '#ff85a2', border: 'none' }}>
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  // 5. Verificamos si es favorito para el estado del botón
  const esFavorito = favoritos.some(p => (p.producto_id || p.id) === (producto.producto_id || producto.id));

  return (
    <Container className="my-5 pt-4">
      <Button
        variant="link"
        onClick={() => navigate('/catalogo')}
        className="text-decoration-none mb-4 text-muted p-0 d-flex align-items-center"
      >
        <ArrowLeft size={18} className="me-2" /> Volver al catálogo
      </Button>

      <Row className="gy-4">
        {/* Lado Izquierdo: Imagen */}
        <Col md={6}>
          <div className="rounded-4 overflow-hidden shadow-sm border bg-white d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
            <img
              src={producto.imagen_url || producto.img || 'https://placehold.co/400'}
              alt={producto.nombre || producto.titulo}
              className="img-fluid"
              style={{ maxHeight: '500px', objectFit: 'contain', padding: '20px' }}
            />
          </div>
        </Col>

        {/* Lado Derecho: Información */}
        <Col md={6} className="d-flex flex-column">
          <div className="mb-auto">
            <Badge bg="light" text="dark" className="mb-2 border fw-normal px-3 py-2" style={{ borderRadius: '20px' }}>
              {producto.stock > 0 ? `Stock: ${producto.stock} u.` : "Agotado"}
            </Badge>
            <h1 className="fw-bold mb-3 display-5">{producto.nombre || producto.titulo || 'Sin nombre'}</h1>
            <h2 className="display-6 fw-bold mb-4" style={{ color: '#ff85a2' }}>
              ${Number(producto.precio || 0).toLocaleString('es-CL')}
            </h2>
            <p className="text-muted fs-5 mb-4" style={{ lineHeight: '1.6' }}>
              {producto.descripcion || producto.desc || 'No hay descripción disponible para este producto.'}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="d-flex gap-3 mt-4">
            <Button
              variant="primary"
              size="lg"
              className="flex-grow-1 py-3 fw-bold border-0 shadow"
              style={{ backgroundColor: '#ff85a2' }}
              onClick={() => agregarAlCarrito(producto)}
              disabled={producto.stock <= 0}
            >
              <ShoppingCart className="me-2" /> 
              {producto.stock > 0 ? "Añadir al Carrito" : "Sin Stock"}
            </Button>

            <Button
              variant={esFavorito ? "danger" : "outline-secondary"}
              size="lg"
              className="px-4 shadow-sm"
              onClick={() => toggleFavorito(producto)}
            >
              <Heart size={24} fill={esFavorito ? "white" : "transparent"} />
            </Button>
          </div>
        </Col>
      </Row>

      {/* Sección Relacionados */}
      <div className="mt-5 pt-5 border-top">
        <h4 className="fw-bold mb-4">También te podría gustar</h4>
        <Row className="g-4">
          {productosRelacionados.map((rel) => (
            <Col key={rel.producto_id || rel.id} xs={12} sm={4}>
              <div
                className="p-3 border rounded-4 bg-white shadow-sm h-100 card-hover"
                onClick={() => navigate(`/producto/${rel.producto_id || rel.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="overflow-hidden rounded-3 mb-3" style={{ aspectRatio: '1/1', backgroundColor: '#f8f9fa' }}>
                  <img
                    src={rel.url_imagen || rel.img || 'https://placehold.co/200'}
                    alt={rel.nombre}
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: 'contain', padding: '10px' }}
                  />
                </div>
                <h6 className="fw-bold mb-1 text-truncate">{rel.nombre || rel.titulo}</h6>
                <p className="fw-bold mb-0" style={{ color: '#ff85a2' }}>
                  ${Number(rel.precio || 0).toLocaleString('es-CL')}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default DetalleProducto;