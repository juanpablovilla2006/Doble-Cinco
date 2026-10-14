export class Notificacion {
  constructor(tipo, descripcion, fecha, reserva) {
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.usuario = reserva.creador; //Asigna el creador de la reserva como el usuario de la notificación
    this.reserva = reserva;
  }
}