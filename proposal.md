# Propuesta TP DSW

## Grupo
### Integrantes
* 54326 Doino, Roque
* 54689 Villa, Juan Pablo

### Repositorios
* Es un monorepo dentro de este mismo repositorio. La carpeta backend corresponde al backend. Lo mismo con la de front.

## Tema
### Descripción
*Doble Cinco es una aplicación para la gestión de un complejo de fútbol que permite a los usuarios reservar canchas. Además, proporciona la búsqueda de partidos, conectando jugadores sin equipo con otros usuarios o equipos completos.*

### Modelo
![imagen del modelo](./MODELODDSF.png)


## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Cancha<br>|
|CRUD dependiente|1. CRUD Equipo {depende de} Reserva<br>|
|Listado<br>+<br>detalle| 1. Listado de canchas filtrado por tipo y disponibilidad para una fecha y horario. Muestra número, tipo, capacidad y precio → detalle CRUD Cancha.<br>|
|CUU/Epic|1. Generar una Reserva de cancha para un partido.<br>|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Cancha<br>3. CRUD Equipo<br>|
|CUU/Epic|1. Generar una reserva de cancha para un partido.<br>2. Gestionar la incorporación a una reserva pública o privada mediante solicitudes: solicitar unirse, notificar al creador y aceptar o rechazar la solicitud.<br>|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1.Listado de reservas públicas con cupo disponible, filtrado por fecha y tipo de cancha. Muestra día, horario, cancha, precio y cantidad de participantes → detalle de la reserva.<br>2.Listado de reservas de un usuario, filtrado por fecha y estado → detalle de la reserva.|
|CUU/Epic|1. Modificación de reserva. <br> 2. Cancelación de reserva. <br> 3. Abandonar una reserva como participante. <br> 4. Moderación del chat. <br> 5. Regeneración del enlace de invitación.|
|Otros|1. Chat exclusivo para los participantes de cada reserva.<br>2. Envío de recordatorios de reserva por email.<br>|

