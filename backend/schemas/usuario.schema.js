import { z } from "zod";

const EDAD_MAXIMA = 100;
const EDAD_MINIMA = 14;
const hoy = () => new Date().toLocaleDateString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" });
//limite de edad para registrarse, (superior) en formato YYYY-MM-DD 
function fechaLimiteNacimiento() {
  const limite = new Date();
  limite.setFullYear(limite.getFullYear() - EDAD_MINIMA);
  return limite.toISOString().slice(0, 10);
}
//limite de edad para registrarse, (inferior) en formato YYYY-MM-DD
function fechaLimiteAntiguedad(){
  const limite = new Date();
  limite.setFullYear(limite.getFullYear() - EDAD_MAXIMA);
  return limite.toISOString().slice(0, 10);
}

export const usuarioSchema = z.object({
  nombre: z.string().trim().min(1).max(50),
  apellido: z.string().trim().min(1).max(50),
  dni: z.string().trim().regex(/^\d{7,10}$/, "El DNI tiene que tener entre 7 y 10 dígitos"),
  mail: z.email("El mail no es válido").trim().toLowerCase().max(100),
  fecha_nac: z.iso
    .date("La fecha de nacimiento tiene que tener formato YYYY-MM-DD")
    .refine((fecha) => fecha <= fechaLimiteNacimiento(), `Tenés que tener al menos ${EDAD_MINIMA} años`)
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
export const editarUsuarioSchema = usuarioSchema.partial({ password: true }).extend({ descripcion: z.string().trim().max(200).optional()});

export const idParamSchema = z.object({
  id: z.coerce
    .number({ error: "El id de usuario no es válido, tiene que ser un número" })
    .int("El id de usuario no es válido, tiene que ser entero")
    .positive("El id de usuario no es válido, tiene que ser mayor a cero")
});

// Para ingresar alcanza con mail y contraseña; no se revisan reglas de formato
export const loginSchema = z.object({
  mail: z.string().trim().toLowerCase().min(1, "El mail es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria")
});