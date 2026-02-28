import { createContext, useState, useEffect } from "react";
import { getProductos, toggleFavoritoDB } from "../services/ProductService";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState(() => JSON.parse(localStorage.getItem("carrito")) || []);
  const [favoritos, setFavoritos] = useState(() => JSON.parse(localStorage.getItem("favoritos")) || []);

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

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getProductos();
        setProductos(data || []);
      } catch (error) {
        console.error("❌ Error en carga inicial:", error);
      }
    };
    cargar();
  }, []);

  const toggleFavorito = async (producto) => {
    const token = user?.token || localStorage.getItem('token');

    if (!token) {
      alert("Por favor, inicia sesión para guardar tus favoritos ❤️");
      return;
    }

    const idProd = producto.producto_id || producto.id_producto || producto.id;

    try {
      await toggleFavoritoDB(idProd, token);
      setFavoritos((prev) => {
        const existe = prev.find((p) => (p.producto_id || p.id_producto || p.id) === idProd);
        if (existe) {
          return prev.filter((p) => (p.producto_id || p.id_producto || p.id) !== idProd);
        }
        return [...prev, producto];
      });
    } catch (error) {
      console.error("Error al guardar favorito:", error);
    }
  };

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
  
  const totalCarrito = carrito.reduce((acc, p) => acc + (Number(p.precio || 0) * (p.cantidad || 1)), 0);
  const cantidadTotalItems = carrito.reduce((acc, p) => acc + (p.cantidad || 0), 0);

  const logout = () => {
    setUser(null);
    setCarrito([]);
    setFavoritos([]);
    localStorage.clear();
  };

  return (
    <ProductContext.Provider value={{
      productos, user, setUser, carrito, favoritos, totalCarrito, cantidadTotalItems,
      agregarAlCarrito, eliminarDelCarrito, ajustarCantidad, toggleFavorito, logout
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;