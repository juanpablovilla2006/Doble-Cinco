Reglas de negocio:

Usuarios y reservas

1. Cada reserva debe tener un único usuario creador. Un usuario puede crear cero o muchas reservas.

2. El creador también debe formar parte de los participantes de su reserva.

3. Un usuario puede participar en cero o muchas reservas, y una reserva puede tener uno o muchos participantes.

4. Un usuario no puede aparecer más de una vez como participante de la misma reserva.

5. Cada reserva debe corresponder a una única cancha. Una cancha puede tener muchas reservas en diferentes fechas y horarios.

6. Solo pueden crearse reservas para canchas habilitadas y para fechas y horarios futuros.

7. El horario de finalización debe ser posterior al de inicio. La duración se calcula a partir de ambos.

8. No pueden existir reservas activas con horarios superpuestos para una misma cancha. Las reservas canceladas no bloquean ese horario.

9. La cantidad de participantes no puede superar la capacidad de jugadores de la cancha.

10. Solo el creador puede modificar o cancelar su reserva. Los cambios deben respetar la disponibilidad de la cancha y la capacidad de participantes.

11. El precio guardado en la reserva corresponde al importe acordado al crearla. Un cambio posterior en el precio de la cancha no modifica automáticamente las reservas existentes.

12. La visibilidad de una reserva puede ser pública o privada. Las reservas públicas aparecen en el listado general. Las privadas no aparecen en ese listado y pueden compartirse mediante un enlace de invitación. Quien acceda mediante el enlace debe iniciar sesión para solicitar unirse. Su incorporación requiere la aceptación del creador.

13. Cada usuario debe tener una contraseña (password) para iniciar sesión junto con su correo electrónico. La contraseña debe almacenarse mediante un hash, nunca como texto plano.

14. Cada usuario debe tener un rol, cuyos valores permitidos son admin y user.

15. Todo usuario registrado recibe el rol user de forma predeterminada y no puede asignarse a sí mismo el rol admin.

16. Solo los usuarios con rol admin pueden crear, modificar o eliminar canchas. Los usuarios con rol user pueden consultarlas y realizar reservas.

Solicitudes para unirse

17. Cada solicitud debe corresponder a un único usuario solicitante y a una única reserva. Un usuario puede realizar muchas solicitudes y una reserva puede recibir muchas.

18. Cada solicitud debe registrar un identificador, una fecha de creación y un estado: pendiente, aceptada o rechazada.

19. Un usuario no puede solicitar unirse si ya participa en esa reserva, ni tener más de una solicitud pendiente para la misma reserva.

20. Solo el creador de la reserva puede aceptar o rechazar las solicitudes dirigidas a ella.

21. Al aceptar una solicitud, el usuario solicitante se incorpora a los participantes y la solicitud pasa a estado aceptada. Al rechazarla, no se incorpora y la solicitud pasa a estado rechazada.

22. Solo pueden aceptarse solicitudes pendientes para reservas que todavía no comenzaron, no están canceladas y tienen lugar disponible. El cupo debe comprobarse al aceptar, aunque hubiera lugar cuando se presentó la solicitud.

Equipos

23. Una reserva puede tener entre cero y dos equipos. Cada equipo pertenece a una única reserva.

24. Un usuario puede integrar equipos de distintas reservas, pero solo puede integrar un equipo dentro de una misma reserva.

25. Para integrar un equipo, el usuario debe ser participante de la reserva correspondiente.

26. La cantidad de usuarios de un equipo se calcula a partir de sus integrantes.

Chats y mensajes

27. Cada reserva tiene un único chat y cada chat pertenece exclusivamente a una reserva. El chat depende de esa reserva y se identifica mediante ella.

28. Solo los participantes de una reserva pueden acceder a su chat y enviar mensajes.

29. Cada mensaje pertenece a un único chat y tiene un único autor. Debe registrar un identificador, contenido y fecha de envío. El contenido puede repetirse entre mensajes.

Notificaciones

30. Cada notificación corresponde a una única reserva y se envía únicamente al creador de esa reserva. Una reserva y un usuario pueden tener cero o muchas notificaciones.

31. Cada nueva solicitud para unirse genera una notificación para el creador. Otros motivos de notificación quedan por definir.

Datos derivados

32. La edad del usuario se calcula a partir de su fecha de nacimiento; la duración de la reserva, a partir de su inicio y finalización. Estos valores deben mantenerse coherentes con los datos de origen.

