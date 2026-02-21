import React from 'react';
import { Container, Row, Col, ListGroup, Badge, Card } from 'react-bootstrap';

const Mensajes = () => {
  // Simulación de datos para la vista
  const chats = [
    { id: 1, usuario: "María Paz", asunto: "Consulta Body Prematuro", fecha: "Hoy", leido: false },
    { id: 2, usuario: "Juan Castro", asunto: "Envío a Providencia", fecha: "Ayer", leido: true },
    { id: 3, usuario: "Tienda Pequeñitos", asunto: "Stock de calcetines", fecha: "02 Feb", leido: true },
  ];

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold" style={{ color: '#ff85a2' }}> Mis Mensajes 💌</h2>
      <Row>
        {/* Lista de Conversaciones */}
        <Col md={4} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white fw-bold">Bandeja de Entrada</Card.Header>
            <ListGroup variant="flush">
              {chats.map((chat) => (
                <ListGroup.Item 
                  key={chat.id} 
                  action 
                  className="d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{chat.usuario}</div>
                    <small className="text-muted text-truncate d-inline-block" style={{maxWidth: '150px'}}>
                      {chat.asunto}
                    </small>
                  </div>
                  {!chat.leido && <Badge bg="primary" pill>Nuevo</Badge>}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Ventana de Chat (Placeholder) */}
        <Col md={8}>
          <Card className="shadow-sm border-0 h-100" style={{ minHeight: '400px' }}>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center text-muted">
              <div className="display-1">✉️</div>
              <h5>Selecciona una conversación</h5>
              <p>Aquí podrás coordinar compras y entregas.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Mensajes;