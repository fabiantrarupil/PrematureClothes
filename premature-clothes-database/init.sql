-- ==========================================
-- PROYECTO: PrematureClothes
-- VERSION: 2.0 - Profesional Extendida
-- DESCRIPCIÓN: Marketplace especializado en ropa para bebés prematuros.
-- ==========================================

-- 1. ELIMINACIÓN DE TABLAS Y TIPOS (Para reinicio limpio)
DROP TABLE IF EXISTS notificaciones, mensajes, comentarios, favoritos, pedido_detalles, pedidos, carrito_items, historial_precios, imagenes_producto, productos, categorias, usuarios CASCADE;
DROP TYPE IF EXISTS rol_usuario, talla_prematuro, estado_prenda, metodo_pago, estado_pedido, tipo_notificacion;

-- 2. CREACIÓN DE TIPOS ENUM
CREATE TYPE rol_usuario AS ENUM ('comprador', 'vendedor', 'admin');
CREATE TYPE talla_prematuro AS ENUM ('000', '00', '0', 'RN');
CREATE TYPE estado_prenda AS ENUM ('nuevo', 'usado_como_nuevo', 'usado');
CREATE TYPE metodo_pago AS ENUM ('Webpay', 'Paypal', 'Transferencia');
CREATE TYPE estado_pedido AS ENUM ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado');
CREATE TYPE tipo_notificacion AS ENUM ('nuevo_mensaje', 'pedido_actualizado', 'producto_favorito', 'nuevo_comentario', 'sistema');

-- 3. TABLAS DE ENTIDADES INDEPENDIENTES
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    direccion_envio TEXT,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    rol rol_usuario DEFAULT 'comprador',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLAS DE PRODUCTOS Y RELACIONADOS
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    vendedor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio INTEGER NOT NULL CHECK (precio > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    talla_rango talla_prematuro NOT NULL,
    estado_prenda estado_prenda NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE imagenes_producto (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    orden INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historial_precios (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    precio_anterior INTEGER NOT NULL,
    precio_nuevo INTEGER NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLAS DE TRANSACCIONES Y CARRITO
CREATE TABLE carrito_items (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL DEFAULT 1 CHECK (cantidad >= 1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, producto_id)
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    total INTEGER NOT NULL DEFAULT 0,
    estado estado_pedido DEFAULT 'pendiente',
    metodo_pago metodo_pago NOT NULL,
    direccion_entrega TEXT NOT NULL CHECK (char_length(direccion_entrega) >= 10),
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedido_detalles (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    producto_titulo VARCHAR(100) NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario INTEGER NOT NULL CHECK (precio_unitario > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. INTERACCIÓN Y SOCIAL
CREATE TABLE favoritos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, producto_id)
);

CREATE TABLE comentarios (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL CHECK (char_length(contenido) >= 5),
    calificacion INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mensajes (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    remitente_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    destinatario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo tipo_notificacion NOT NULL,
    contenido TEXT NOT NULL,
    metadata JSONB,
    leida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. ÍNDICES ADICIONALES PARA RENDIMIENTO
CREATE INDEX idx_usuarios_ubicacion ON usuarios (latitud, longitud);
CREATE INDEX idx_productos_cat_act ON productos (categoria_id, activo);
CREATE INDEX idx_productos_recientes ON productos (created_at DESC);
CREATE INDEX idx_pedidos_recientes ON pedidos (fecha_pedido DESC);
CREATE INDEX idx_comentarios_recientes ON comentarios (created_at DESC);
CREATE INDEX idx_mensajes_conversacion ON mensajes (remitente_id, destinatario_id, created_at);
CREATE INDEX idx_notificaciones_recientes ON notificaciones (usuario_id, leida, created_at DESC);