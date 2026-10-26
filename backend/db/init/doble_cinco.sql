CREATE DATABASE IF NOT EXISTS doble_cinco;
USE doble_cinco;

CREATE TABLE IF NOT EXISTS cancha (
  numero INT PRIMARY KEY,
  tipo VARCHAR(30) NOT NULL,
  capacidad INT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  habilitada BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS usuario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  dni VARCHAR(10) NOT NULL,
  mail VARCHAR(100) NOT NULL UNIQUE,
  fecha_nac DATE NOT NULL,
  genero VARCHAR(10) NOT NULL,
  descripcion VARCHAR(200) NOT NULL,
  telefono VARCHAR(15) NOT NULL,
  rol ENUM('admin','user') NOT NULL DEFAULT 'user',
  password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS reserva (
  id INT PRIMARY KEY AUTO_INCREMENT,
  precio DECIMAL(10,2) NOT NULL,
  estado_pago BOOLEAN NOT NULL DEFAULT FALSE,
  estado_reserva VARCHAR(20) NOT NULL,
  visibilidad BOOLEAN NOT NULL DEFAULT FALSE,
  horario_inicio TIME NOT NULL,
  horario_fin TIME NOT NULL,
  dia DATE NOT NULL,
  codigo_invitacion VARCHAR(50) NOT NULL UNIQUE,
  numero_cancha INT NOT NULL,
  id_creador INT NOT NULL,
  FOREIGN KEY (numero_cancha) REFERENCES cancha(numero),
  FOREIGN KEY (id_creador) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS reserva_participante (
  id_reserva INT NOT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_reserva, id_usuario),
  FOREIGN KEY (id_reserva) REFERENCES reserva(id),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS equipo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tipo VARCHAR(30) NOT NULL,
  id_reserva INT NOT NULL,
  FOREIGN KEY (id_reserva) REFERENCES reserva(id)
);

CREATE TABLE IF NOT EXISTS equipo_participante (
  id_equipo INT NOT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_equipo, id_usuario),
  FOREIGN KEY (id_equipo) REFERENCES equipo(id),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS solicitud (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('pendiente','aceptada','rechazada') NOT NULL DEFAULT 'pendiente',
  id_usuario INT NOT NULL,
  id_reserva INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id),
  FOREIGN KEY (id_reserva) REFERENCES reserva(id)
);

CREATE TABLE IF NOT EXISTS chat (
  id_reserva INT PRIMARY KEY,
  FOREIGN KEY (id_reserva) REFERENCES reserva(id)
);

CREATE TABLE IF NOT EXISTS mensaje (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contenido TEXT NOT NULL,
  fecha_enviado TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario INT NOT NULL,
  id_chat INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id),
  FOREIGN KEY (id_chat) REFERENCES chat(id_reserva)
);

CREATE TABLE IF NOT EXISTS notificacion (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tipo VARCHAR(50) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario INT NOT NULL,
  id_reserva INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id),
  FOREIGN KEY (id_reserva) REFERENCES reserva(id)
);

-- Canchas de prueba para probar la página de reservas
INSERT IGNORE INTO cancha (numero, tipo, capacidad, precio, habilitada) VALUES
  (1, 'Fútbol 5', 10, 15000.00, TRUE),
  (2, 'Fútbol 5', 10, 15000.00, TRUE),
  (3, 'Fútbol 7', 14, 22000.00, TRUE);
