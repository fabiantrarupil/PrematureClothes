import { useContext } from 'react';
import { Navbar, Container, Nav, NavDropdown, Badge, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import {
  ShoppingCart, User, LogOut, Heart, PlusCircle,
  BarChart3, MessageSquare, ClipboardList, Settings, Users, ShieldCheck
} from 'lucide-react';

const Navigation = () => {
  const { user, logout, cantidadTotalItems, totalCarrito } = useContext(ProductContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // QA FIX: Aseguramos que detecte 'admin' correctamente (ajusta a .rol si usas español en la DB)
  const isAdmin = user?.rol === 'admin' || user?.role === 'admin';
  const isVendedor = user?.rol === 'vendedor' || user?.role === 'vendedor' || isAdmin;

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm fixed-top py-3" collapseOnSelect>
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold fs-4" style={{ color: '#ff85a2' }}>
          👶 PrematureClothes
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/catalogo">Catálogo</Nav.Link>

            {user && (
              <>
                <Nav.Link as={NavLink} to="/favoritos">
                  <Heart size={18} className="me-1" /> Favoritos
                </Nav.Link>
                <Nav.Link as={NavLink} to="/publicar" className="text-primary fw-bold">
                  <PlusCircle size={18} className="me-1" /> Vender
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="align-items-center">
            {user && (
              <Nav.Link as={NavLink} to="/carrito" className="me-lg-3 position-relative">
                <ShoppingCart size={24} />
                {cantidadTotalItems > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.6rem' }}>
                    {cantidadTotalItems}
                  </Badge>
                )}
                <span className="ms-2">
                  ${(totalCarrito || 0).toLocaleString('es-CL')}
                </span>
              </Nav.Link>
            )}

            {!user ? (
              <div className="d-flex align-items-center ms-lg-3 gap-2">
                <Button variant="link" className="text-decoration-none fw-bold px-3 shadow-none text-muted" onClick={() => navigate('/login')}>
                  Ingresar
                </Button>
                <Button variant="primary" size="sm" className="border-0 px-3 fw-bold shadow-sm" style={{ backgroundColor: '#ff85a2' }} onClick={() => navigate('/register')}>
                  Registrarme
                </Button>
              </div>
            ) : (
              <NavDropdown
                title={
                  <span>
                    {isAdmin ? <ShieldCheck size={20} className="me-1 text-danger" /> : <User size={20} className="me-1" />}
                    {user.nombre_completo || user.nombre || 'Mi Cuenta'}
                  </span>
                }
                id="user-dropdown"
                align="end"
                className="ms-lg-3 fw-bold"
              >
                <NavDropdown.Header>Mi Actividad</NavDropdown.Header>
                <NavDropdown.Item as={NavLink} to="/profile">Mi Perfil</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/pedidos">Mis Compras</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/mis-publicaciones">Mis Publicaciones</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/mensajes">
                  <MessageSquare size={16} className="me-2" /> Mensajes
                </NavDropdown.Item>

                {isVendedor && !isAdmin && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Header>Panel Vendedor</NavDropdown.Header>
                    <NavDropdown.Item as={NavLink} to="/vendedor/estadisticas">
                      <BarChart3 size={16} className="me-2" /> Mis Estadísticas
                    </NavDropdown.Item>
                  </>
                )}

                {/* 🎯 SECCIÓN EXCLUSIVA ADMINISTRADOR */}
                {isAdmin && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Header className="text-danger fw-bold">ADMINISTRACIÓN</NavDropdown.Header>
                    <NavDropdown.Item as={NavLink} to="/admin/pedidos">
                      <ClipboardList size={16} className="me-2" /> Gestionar Pedidos
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to="/admin/usuarios">
                      <Users size={16} className="me-2" /> Gestionar Usuarios
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to="/admin/reportes">
                      <Settings size={16} className="me-2" /> Reportes de Ventas
                    </NavDropdown.Item>
                  </>
                )}

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  <LogOut size={16} className="me-2" /> Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;