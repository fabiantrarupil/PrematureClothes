import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ producto }) => {
  const navigate = useNavigate();

  return (
    <Card className="h-100 border-0 shadow-sm card-hover overflow-hidden">
      {/* Contenedor de Imagen con Proporción Fija */}
      <div className="position-relative" style={{ aspectRatio: '1/1', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
        <Card.Img
          variant="top"
          src={producto.img}
          alt={producto.nombre}
          style={{ 
            objectFit: 'cover', 
            width: '100%', 
            height: '100%',
            transition: 'transform 0.5s ease'
          }}
          className="product-img"
        />
        {/* Badge sutil de categoría o nuevo */}
        <Badge 
          bg="white" 
          className="position-absolute top-0 start-0 m-3 text-dark shadow-sm fw-normal"
          style={{ borderRadius: '20px' }}
        >
          Prematuro
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="mb-2">
          <Card.Title className="fs-6 fw-bold mb-1 text-truncate" title={producto.nombre}>
            {producto.nombre}
          </Card.Title>
          <Card.Text className="text-muted small" style={{ height: '40px', overflow: 'hidden' }}>
            {producto.desc}
          </Card.Text>
        </div>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fs-5 fw-bold text-dark">
              ${producto.precio.toLocaleString('es-CL')}
            </span>
          </div>

          <div className="d-flex gap-2">
            <Button 
              variant="light" 
              className="flex-grow-1 border-0"
              onClick={() => navigate(`/producto/${producto.id}`)}
              style={{ backgroundColor: '#fdf2f4', color: '#ff85a2' }}
            >
              <Eye size={18} />
            </Button>
            <Button 
              variant="primary" 
              className="flex-grow-1 border-0 shadow-sm"
              style={{ backgroundColor: '#ff85a2' }}
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