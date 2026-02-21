import React, { useContext } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { ProductContext } from '../context/ProductContext';
import { Navigate } from 'react-router-dom';

const ReportesVentas = () => {
  const { user } = useContext(ProductContext);

  // Lógica de seguridad en Frontend: Si no es admin, fuera.
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Datos simulados para el reporte
  const estadisticas = [
    { titulo: "Ventas Totales", valor: "$1.250.000", color: "#ff85a2" },
    { titulo: "Pedidos Nuevos", valor: "15", color: "#6c757d" },
    { titulo: "Clientes Activos", valor: "124", color: "#ff85a2" }
  ];

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold" style={{ color: '#ff85a2' }}>Panel de Reportes Administrativos 📈</h2>
      
      {/* Resumen de Tarjetas */}
      <Row className="mb-4">
        {estadisticas.map((item, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card className="border-0 shadow-sm text-center py-3">
              <Card.Subtitle className="text-muted mb-2">{item.titulo}</Card.Subtitle>
              <Card.Title className="display-6 fw-bold" style={{ color: item.color }}>{item.valor}</Card.Title>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tabla de Últimas Ventas */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Detalle de Transacciones Recientes</h5>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>04/02/2026</td>
                <td>Carlos Retamal</td>
                <td>Pack Body Prematuro</td>
                <td>$18.990</td>
              </tr>
              <tr>
                <td>03/02/2026</td>
                <td>Anaís Soto</td>
                <td>Gorro Algodón</td>
                <td>$5.500</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportesVentas;