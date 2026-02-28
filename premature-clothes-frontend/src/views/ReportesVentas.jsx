import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert, Badge } from 'react-bootstrap'; 
import { ProductContext } from '../context/ProductContext';
import { Navigate } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Users, Calendar } from 'lucide-react';

const ReportesVentas = () => {
  const { user } = useContext(ProductContext);
  const [reportes, setReportes] = useState({ estadisticas: [], transacciones: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 QA Check: Coherencia con el ENUM de tu DB ('administrador')
  const esAdmin = user?.rol === 'administrador';

  useEffect(() => {
    if (esAdmin) {
      fetchDataReportes();
    }
  }, [esAdmin]);

  const fetchDataReportes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // Usamos el endpoint de pedidos para generar el reporte
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pedidos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al cargar reportes');
      const pedidos = await response.json();

      // Lógica para transformar pedidos en estadísticas
      const totalVentas = pedidos.reduce((acc, p) => acc + Number(p.total || 0), 0);
      const pedidosNuevos = pedidos.filter(p => p.estado === 'creado' || p.estado === 'pagado').length;
      
      // Obtener clientes únicos (QA: Usamos un Set para no repetir)
      const clientesUnicos = new Set(pedidos.map(p => p.usuario_id)).size;

      setReportes({
        estadisticas: [
          { titulo: "Ventas Totales", valor: `$${totalVentas.toLocaleString('es-CL')}`, color: "#ff85a2", icon: <TrendingUp /> },
          { titulo: "Pedidos Nuevos", valor: pedidosNuevos.toString(), color: "#6c757d", icon: <ShoppingBag /> },
          { titulo: "Clientes Activos", valor: clientesUnicos.toString(), color: "#ff85a2", icon: <Users /> }
        ],
        transacciones: pedidos.slice(0, 10) // Últimas 10 transacciones
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !esAdmin) {
    return <Navigate to="/" />;
  }

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="danger" />
      <p className="mt-2 text-muted">Generando reportes de PrematureClothes...</p>
    </div>
  );

  return (
    <Container className="py-5 mt-4">
      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: '#ff85a2' }}>
          Reportes Administrativos <Calendar className="ms-2" />
        </h2>
        <p className="text-muted">Análisis de rendimiento real basado en transacciones.</p>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        {reportes.estadisticas.map((item, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card className="border-0 shadow-sm text-center py-4 rounded-4">
              <div className="mb-2" style={{ color: item.color }}>{item.icon}</div>
              <Card.Subtitle className="text-muted mb-2 uppercase small fw-bold">{item.titulo}</Card.Subtitle>
              <Card.Title className="display-6 fw-bold" style={{ color: item.color }}>{item.valor}</Card.Title>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          <div className="p-4 bg-light border-bottom">
            <h5 className="m-0 fw-bold">Detalle de Transacciones Recientes</h5>
          </div>
          <Table hover responsive className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="ps-4">ID Pedido</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th className="text-end pe-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {reportes.transacciones.length > 0 ? (
                reportes.transacciones.map((t) => (
                  <tr key={t.id}>
                    <td className="ps-4 fw-bold text-muted">#{t.id}</td>
                    <td>{new Date(t.created_at || t.fecha).toLocaleDateString()}</td>
                    <td>
                      <Badge bg={t.estado === 'entregado' ? 'success' : 'warning'} className="fw-normal">
                        {t.estado}
                      </Badge>
                    </td>
                    <td className="text-end pe-4 fw-bold">
                      ${Number(t.total).toLocaleString('es-CL')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">No hay transacciones registradas aún.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportesVentas;