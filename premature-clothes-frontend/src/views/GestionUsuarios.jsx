import { Container, Table, Button, Form, Card, Badge } from 'react-bootstrap';
import { UserCog, ShieldCheck, UserMinus, Mail } from 'lucide-react';

const GestionUsuarios = () => {
  // Simulamos una lista de usuarios registrados
  const usuarios = [
    { id: 1, nombre: 'Francisco Rojas', email: 'f.rojas@email.com', rol: 'Administrador', estado: 'Activo' },
    { id: 2, nombre: 'María Loreto', email: 'm.loreto@email.com', rol: 'Vendedor', estado: 'Activo' },
    { id: 3, nombre: 'Camilo Guerrero', email: 'c.guerrero@email.com', rol: 'Usuario', estado: 'Inactivo' },
  ];

  return (
    <Container className="my-5 pt-4">
      <div className="mb-4">
        <h2 className="fw-bold m-0 text-dark">Gestión de Usuarios <UserCog size={30} className="ms-2" /></h2>
        <p className="text-muted">Administra los accesos, roles y estados de los guerreros en la plataforma.</p>
      </div>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Table responsive hover className="align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="py-3">Rol</th>
              <th className="py-3">Estado</th>
              <th className="py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-light p-2 rounded-circle me-3">
                      <Mail size={18} className="text-muted" />
                    </div>
                    <div>
                      <div className="fw-bold">{u.nombre}</div>
                      <small className="text-muted">{u.email}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <Form.Select size="sm" defaultValue={u.rol} className="w-auto border-0 bg-light fw-bold">
                    <option>Usuario</option>
                    <option>Vendedor</option>
                    <option>Administrador</option>
                  </Form.Select>
                </td>
                <td>
                  <Badge bg={u.estado === 'Activo' ? 'success' : 'secondary'} className="fw-normal">
                    {u.estado}
                  </Badge>
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <Button variant="outline-primary" size="sm" title="Validar cuenta">
                      <ShieldCheck size={16} />
                    </Button>
                    <Button variant="outline-danger" size="sm" title="Suspender">
                      <UserMinus size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default GestionUsuarios;