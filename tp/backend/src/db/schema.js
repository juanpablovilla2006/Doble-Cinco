import {
  mysqlTable,
  int,
  varchar,
  decimal,
  boolean
} from "drizzle-orm/mysql-core";

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