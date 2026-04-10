# Propuesta TP DSW

## Grupo
### Integrantes
* 54326 Doino, Roque
* 54327 Gallina, Santino Lucio
* 54689 Villa, Juan Pablo

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
*Doble Cinco es una aplicación para la gestión de un complejo de fútbol que permite a los usuarios reservar canchas. Además, proporciona la búsqueda de partidos, conectando jugadores sin equipo con otros usuarios o equipos completos. La plataforma ofrece herramientas para la creación y organización de torneos.*

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Cancha<br>3. CRUD Equipo|
|CRUD dependiente|1. CRUD Reserva {depende de} CRUD Cancha<br>2. CRUD Torneo {depende de} CRUD Complejo y CRUD Equipo|
|Listado<br>+<br>detalle| 1. Listado de canchas filtrado por tipo y disponibilidad, muestra nombre del complejo, tipo y precio ⇒ detalle CRUD Cancha<br> 2.Listado de reservas filtrado por estado y fecha, muestra cancha, horario y estado de pago, nombre del usuario que reservo ⇒ detalle muestra datos completos de la reserva y usuario|
|CUU/Epic|1. Reservar cancha para un partido<br>2. Encontrar un partido con falta de jugadores|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Complejo<br>3. CRUD Equipo<br>4. CRUD Cancha<br>5. CRUD Reserva<br>6. CRUD Partido<br>7. CRUD Torneo<br>8. CRUD Fecha<br>9. CRUD Notificacion|
|CUU/Epic|1. Reservar cancha para un partido<br>2. Encontrar un partido con falta de jugadores<br>3. Crear un torneo<br>4.Inscribir equipos a torneo<br>5. Registrar resultado de los partidos|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

