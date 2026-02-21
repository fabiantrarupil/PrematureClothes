import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Estilos
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// --- IMPORTACIÓN DE VISTAS ---
import Home from './views/Home';
import CatalogoProductos from './views/CatalogoProductos';
import DetalleProducto from './views/DetalleProducto';
import Profile from './views/Profile';
import EditarPerfil from './views/EditarPerfil';
import PublicarProducto from './views/PublicarProducto';
import MisPublicaciones from './views/MisPublicaciones';
import CarritoCompras from './views/CarritoCompras';
import MisPedidos from './views/MisPedidos';
import Favoritos from './views/Favoritos';
import Mensajes from './views/Mensajes';
import ReportesVentas from './views/ReportesVentas';
import GestionUsuarios from './views/GestionUsuarios';
import GestionPedidos from './views/GestionPedidos';
import EstadisticasVendedor from './views/EstadisticasVendedor';
import Auth from './views/Auth';
import { ProductProvider } from './context/ProductContext'; // Asegúrate de usar llaves si es exportación nombrada

function App() {
  return (
    /* 1. El Provider debe envolver TODO para que Navbar y Footer también accedan al contexto */
    <ProductProvider> 
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-grow-1" style={{ marginTop: '90px' }}>
          <Routes>
            {/* ACCESO LIBRE */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Auth key="register" inicialEsLogin={false} />} />
            <Route path="/login" element={<Auth key="login" inicialEsLogin={true} />} />
            <Route path="/catalogo" element={<CatalogoProductos />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />

            {/* ACCESO PRIVADO (PROTEGIDO POR CONTEXTO/TOKEN) */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/editar-perfil" element={<ProtectedRoute><EditarPerfil /></ProtectedRoute>} />
            <Route path="/publicar" element={<ProtectedRoute><PublicarProducto /></ProtectedRoute>} />
            <Route path="/mis-publicaciones" element={<ProtectedRoute><MisPublicaciones /></ProtectedRoute>} />
            <Route path="/carrito" element={<ProtectedRoute><CarritoCompras /></ProtectedRoute>} />
            <Route path="/pedidos" element={<ProtectedRoute><MisPedidos /></ProtectedRoute>} />
            <Route path="/favoritos" element={<ProtectedRoute><Favoritos /></ProtectedRoute>} />
            <Route path="/mensajes" element={<ProtectedRoute><Mensajes /></ProtectedRoute>} />

            {/* ACCESO ADMINISTRADOR / VENDEDOR */}
            <Route path="/admin/usuarios" element={<ProtectedRoute><GestionUsuarios /></ProtectedRoute>} />
            <Route path="/admin/pedidos" element={<ProtectedRoute><GestionPedidos /></ProtectedRoute>} />
            <Route path="/admin/reportes" element={<ProtectedRoute><ReportesVentas /></ProtectedRoute>} />
            <Route path="/vendedor/estadisticas" element={<ProtectedRoute><EstadisticasVendedor /></ProtectedRoute>} />

            {/* RUTA 404 */}
            <Route path="*" element={
              <div className="container text-center mt-5">
                <h1 className="display-1 fw-bold text-muted">404</h1>
                <p className="lead">Lo sentimos, la página que buscas no existe.</p>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </ProductProvider> /* 2. Cerramos el Provider aquí */
  );
}

export default App;