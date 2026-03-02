import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';

const ProductCard = ({ producto }) => {
  const navigate = useNavigate();
  const { agregarAlCarrito } = useContext(ProductContext);

  // Normalización de datos para evitar errores de undefined
  const nombreDisplay = producto.nombre || producto.titulo || "Producto sin nombre";
  const imagenDisplay = producto.img || producto.imagen_url || producto.imagen || 'https://placehold.co/400x400?text=Premature+Clothes';
  const descripcionDisplay = producto.desc || producto.descripcion || "Sin descripción disponible";
  const precioDisplay = Number(producto.precio || 0);

  return (
    <Card className="h-100 border-0 shadow-sm card-hover overflow-hidden">
      {/* Contenedor de Imagen con Proporción Fija */}
      <div className="position-relative" style={{ aspectRatio: '1/1', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
        <Card.Img
          variant="top"
          src={imagenDisplay}
          alt={nombreDisplay}
          style={{ 
            objectFit: 'cover', 
            width: '100%', 
            height: '100%',
            transition: 'transform 0.5s ease'
          }}
          className="product-img"
          // QA: Fallback en caso de que la URL de la imagen esté rota
          onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Imagen+No+Disponible' }}
        />
        
        {/* Badge de Talla/Categoría */}
        <Badge 
          bg="white" 
          className="position-absolute top-0 start-0 m-3 text-dark shadow-sm fw-normal"
          style={{ borderRadius: '20px' }}
        >
          Talla: {producto.talla_rango || 'Única'}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="mb-2">
          <Card.Title className="fs-6 fw-bold mb-1 text-truncate" title={nombreDisplay}>
            {nombreDisplay}
          </Card.Title>
          <Card.Text className="text-muted small" style={{ height: '40px', overflow: 'hidden' }}>
            {descripcionDisplay.length > 60 ? `${descripcionDisplay.substring(0, 60)}...` : descripcionDisplay}
          </Card.Text>
        </div>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fs-5 fw-bold" style={{ color: '#ff85a2' }}>
              ${precioDisplay.toLocaleString('es-CL')}
            </span>
            <Badge bg="light" text="dark" className="fw-normal border">
              {producto.estado_prenda || 'Nuevo'}
            </Badge>
          </div>

          <div className="d-flex gap-2">
            <Button 
              variant="light" 
              className="flex-grow-1 border-0"
              onClick={() => navigate(`/producto/${producto.id}`)}
              style={{ backgroundColor: '#fdf2f4', color: '#ff85a2' }}
              title="Ver detalle"
            >
              <Eye size={18} />
            </Button>
            <Button 
              variant="primary" 
              className="flex-grow-1 border-0 shadow-sm"
              style={{ backgroundColor: '#ff85a2' }}
              onClick={() => agregarAlCarrito(producto)}
              title="Añadir al carrito"
            >
              <ShoppingCart size={18} />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;