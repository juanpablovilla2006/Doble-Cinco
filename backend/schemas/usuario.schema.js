import { z } from "zod";

const hoy = () => new Date().toISOString().slice(0, 10);

export const usuarioSchema = z.object({
  nombre: z.string().trim().min(1).max(50),
  apellido: z.string().trim().min(1).max(50),
  dni: z.string().trim().regex(/^\d{7,10}$/, "El DNI tiene que tener entre 7 y 10 dígitos"),
  mail: z.email("El mail no es válido").trim().toLowerCase().max(100),
  fecha_nac: z.iso
    .date("La fecha de nacimiento tiene que tener formato YYYY-MM-DD")
    .refine((fecha) => fecha <= hoy(), "La fecha de nacimiento no puede ser futura"),
  genero: z.string().trim().min(1).max(10),
  descripcion: z.string().trim().max(200).default(""),
  telefono: z.string().trim().regex(/^\+?\d{6,14}$/, "El teléfono no es válido"),
  // Se borró el campo rol ya que por defecto se creera en la DB con rol user. De la manera anterior se podia crear un admin.
  //EL admin hay que crearlo desde workbench
  // bcrypt solo considera los primeros 72 bytes
  password: z.string().min(8, "La contraseña tiene que tener al menos 8 caracteres").max(72)
});

// En la edición la contraseña es opcional: si no viene, se mantiene la actual
export const editarUsuarioSchema = usuarioSchema.partial({ password: true });

export const idParamSchema = z.object({
  id: z.coerce
    .number({ error: "El id de usuario no es válido, tiene que ser un número" })
    .int("El id de usuario no es válido, tiene que ser entero")
    .positive("El id de usuario no es válido, tiene que ser mayor a cero")
});
