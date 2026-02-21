import { useContext } from 'react';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { ProductContext } from '../context/ProductContext';
import { DollarSign, Package, Heart, TrendingUp } from 'lucide-react';

const EstadisticasVendedor = () => {
  const { productos, favoritos } = useContext(ProductContext);

  // Simulamos datos para el ejercicio (En un caso real vendrían de una API de ventas)
  const totalVentas = 158900;
  const productosVendidos = 12;
  const visitasTotales = 450;

  return (
    <Container className="my-5 pt-4">
      <h2 className="fw-bold mb-4">Panel de Estadísticas 📊</h2>
      
      {/* Tarjetas de Resumen */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex align-items-center">
              <div className="p-3 rounded-circle me-3" style={{ backgroundColor: '#fff0f3' }}>
                <DollarSign color="#ff85a2" size={24} />
              </div>
              <div>
                <small className="text-muted d-block">Ganancias</small>
                <span className="fw-bold fs-5">${totalVentas.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex align-items-center">
              <div className="p-3 rounded-circle me-3" style={{ backgroundColor: '#eef2ff' }}>
                <Package color="#4f46e5" size={24} />
              </div>
              <div>
                <small className="text-muted d-block">Vendidos</small>
                <span className="fw-bold fs-5">{productosVendidos} items</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex align-items-center">
              <div className="p-3 rounded-circle me-3" style={{ backgroundColor: '#fff7ed' }}>
                <Heart color="#f97316" size={24} />
              </div>
              <div>
                <small className="text-muted d-block">Favoritos</small>
                <span className="fw-bold fs-5">{favoritos.length} veces</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3 h-100">
            <div className="d-flex align-items-center">
              <div className="p-3 rounded-circle me-3" style={{ backgroundColor: '#f0fdf4' }}>
                <TrendingUp color="#16a34a" size={24} />
              </div>
              <div>
                <small className="text-muted d-block">Visitas</small>
                <span className="fw-bold fs-5">{visitasTotales}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Rendimiento por Categoría */}
      <Row>
        <Col md={6}>
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-4">Rendimiento por Categoría</h5>
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span>Ropa de UCIN</span>
                <span className="fw-bold">70%</span>
              </div>
              <ProgressBar now={70} variant="info" style={{ height: '8px' }} />
            </div>
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span>Accesorios / Gorros</span>
                <span className="fw-bold">45%</span>
              </div>
              <ProgressBar now={45} variant="warning" style={{ height: '8px' }} />
            </div>
            <div className="mb-2">
              <div className="d-flex justify-content-between mb-1">
                <span>Sets de Regalo</span>
                <span className="fw-bold">25%</span>
              </div>
              <ProgressBar now={25} variant="danger" style={{ height: '8px' }} />
            </div>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm rounded-4 p-4 h-100 d-flex align-items-center justify-content-center text-center">
            <div className="opacity-50">
              <TrendingUp size={48} className="mb-3" />
              <p className="fs-5">Próximamente:<br/>Gráficos de ventas mensuales</p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EstadisticasVendedor;