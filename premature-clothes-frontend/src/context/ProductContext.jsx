import { createContext, useState, useEffect } from "react";
import { getProductos, toggleFavoritoDB } from "../services/ProductService";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // 1. Cargamos el usuario del localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState(() => JSON.parse(localStorage.getItem("carrito")) || []);
  const [favoritos, setFavoritos] = useState(() => JSON.parse(localStorage.getItem("favoritos")) || []);

  // Sincronización automática con LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [carrito, favoritos]);

  // Carga inicial de productos
  useEffect(() => {
    const cargar = async () => {
      const data = await getProductos();
      setProductos(data);
    };
    cargar();
  }, []);

  // 3. FUNCIÓN DE FAVORITOS (Corregida para evitar ReferenceError)
  const toggleFavorito = async (producto) => {
    const token = user?.token;

    if (!token) {
      alert("Por favor, inicia sesión para guardar tus favoritos ❤️");
      return;
    }

    // QA FIX: Extraemos el ID del objeto producto de forma segura
    const idProd = producto.producto_id || producto.id_producto || producto.id;

    try {
      // 🚀 Llamamos al servicio con el ID normalizado
      await toggleFavoritoDB(idProd, token);

      // Si el servidor responde OK, actualizamos el estado local
      setFavoritos((prev) => {
        const existe = prev.find((p) => (p.producto_id || p.id_producto || p.id) === idProd);
        if (existe) {
          return prev.filter((p) => (p.producto_id || p.id_producto || p.id) !== idProd);
        }
        return [...prev, producto];
      });
      
    } catch (error) {
      console.error("Error al guardar favorito:", error);
      alert("No se pudo sincronizar el favorito con la base de datos.");
    }
  };

  // Funciones de Carrito
  const agregarAlCarrito = (producto) => {
    const idProd = producto.producto_id || producto.id_producto || producto.id;
    setCarrito((prev) => {
      const existe = prev.find((p) => (p.producto_id || p.id_producto || p.id) === idProd);
      if (existe) {
        return prev.map((p) => (p.producto_id || p.id_producto || p.id) === idProd 
          ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const ajustarCantidad = (id, incremento) => {
    setCarrito((prev) => prev.map((p) => (p.producto_id || p.id_producto || p.id) === id 
      ? { ...p, cantidad: Math.max(1, (p.cantidad || 1) + incremento) } : p));
  };

  const eliminarDelCarrito = (id) => setCarrito((prev) => prev.filter((p) => (p.producto_id || p.id_producto || p.id) !== id));
  
  const totalCarrito = carrito.reduce((acc, p) => acc + (Number(p.precio) * (p.cantidad || 1)), 0);

  const logout = () => {
    setUser(null);
    setCarrito([]);
    setFavoritos([]);
    localStorage.clear();
  };

  return (
    <ProductContext.Provider value={{
      productos, user, setUser, carrito, favoritos, totalCarrito,
      agregarAlCarrito, eliminarDelCarrito, ajustarCantidad, toggleFavorito, logout
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;