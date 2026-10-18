import {
  mysqlTable,int,varchar,decimal,boolean,date,time,timestamp,text,mysqlEnum,primaryKey} from "drizzle-orm/mysql-core";

export const usuario = mysqlTable("usuario", {
  id: int("id").primaryKey().autoincrement(),
  nombre: varchar("nombre", { length: 50 }).notNull(),
  apellido: varchar("apellido", { length: 50 }).notNull(),
  dni: varchar("dni", { length: 10 }).notNull(),
  mail: varchar("mail", { length: 100 }).notNull(),
  fecha_nac: date("fecha_nac", { mode: "string" }).notNull(),
  genero: varchar("genero", { length: 10 }).notNull(),
  descripcion: varchar("descripcion", { length: 200 }).notNull(),
  telefono: varchar("telefono", { length: 15 }).notNull(),
  rol: mysqlEnum("rol", ["admin", "user"]).notNull().default("user"),
  password: varchar("password", { length: 100 }).notNull()
});

export const cancha = mysqlTable("cancha", {
  numero: int("numero").primaryKey(),
  tipo: varchar("tipo", { length: 30 }).notNull(),
  capacidad: int("capacidad").notNull(),
  precio: decimal("precio", {
    precision: 10,
    scale: 2
  }).notNull(),
  habilitada: boolean("habilitada").notNull().default(true)
});

export const reserva = mysqlTable("reserva", {
  id: int("id").primaryKey().autoincrement(),
  precio: decimal("precio", {
    precision: 10,
    scale: 2
  }).notNull(),
  estado_pago: boolean("estado_pago").notNull().default(false),
  estado_reserva: varchar("estado_reserva", { length: 20 }).notNull(),
  visibilidad: boolean("visibilidad").notNull().default(false),
  horario_inicio: time("horario_inicio", { mode: "string" }).notNull(),
  horario_fin: time("horario_fin", { mode: "string" }).notNull(),
  dia: date("dia", { mode: "string" }).notNull(),
  codigo_invitacion: varchar("codigo_invitacion", { length: 50 }).notNull().unique(),
  numero_cancha: int("numero_cancha").notNull().references(() => cancha.numero),
  id_creador: int("id_usuario").notNull().references(() => usuario.id)
});

export const reserva_participante = mysqlTable(
  "reserva_participante",
  {
    id_reserva: int("id_reserva")
      .notNull()
      .references(() => reserva.id),

    id_usuario: int("id_usuario")
      .notNull()
      .references(() => usuario.id)
  },
  (tabla) => [
    primaryKey({
      columns: [tabla.id_reserva, tabla.id_usuario]
    })
  ]
);

export const equipo = mysqlTable("equipo", {
  id: int("id").primaryKey().autoincrement(),
  tipo: varchar("tipo", { length: 30 }).notNull(),
  id_reserva: int("id_reserva").notNull().references(() => reserva.id)
});

export const equipo_participante = mysqlTable("equipo_participante", {
  id_equipo: int("id_equipo").notNull().references(() => equipo.id),
  
  id_usuario: int("id_usuario").notNull().references(() => usuario.id)
   },
  (tabla) => [
    primaryKey({
      columns: [tabla.id_equipo, tabla.id_usuario]
    })
  ]
);

export const solicitud = mysqlTable("solicitud", {
  id: int("id").primaryKey().autoincrement(),
  fecha: timestamp("fecha").notNull().defaultNow(),
  estado: mysqlEnum("estado", ["pendiente","aceptada","rechazada"]).notNull().default("pendiente"),
   id_usuario: int("id_usuario").notNull().references(() => usuario.id),

  id_reserva: int("id_reserva").notNull().references(() => reserva.id)
});

export const chat = mysqlTable("chat", {
  id_reserva: int("id_reserva").primaryKey().references(() => reserva.id)
});

export const mensaje = mysqlTable("mensaje", {
  id: int("id").autoincrement().primaryKey(),
  contenido: text("contenido").notNull(),
  fecha_enviado: timestamp("fecha_enviado").notNull().defaultNow(),
  id_usuario: int("id_usuario").notNull().references(() => usuario.id),
  id_chat: int("id_chat").notNull().references(() => chat.id_reserva)
});

export const notificacion = mysqlTable("notificacion", {
  id: int("id").autoincrement().primaryKey(),
  tipo: varchar("tipo", { length: 50 }).notNull(),
  descripcion: text("descripcion").notNull(),
  fecha: timestamp("fecha").notNull().defaultNow(),
  id_usuario: int("id_usuario").notNull().references(() => usuario.id),
  id_reserva: int("id_reserva").notNull().references(() => reserva.id)
});