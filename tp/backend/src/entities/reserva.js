import {Chat} from './chat.js';

export class Reserva {
  constructor(precio, estado_pago, estado_reserva, visibilidad, horario_inicio, horario_final, dia, codigo_invitacion,cancha, creador) {
    this.cancha = cancha;
    this.creador = creador;
    this.participantes = [creador];
    this.equipos = [];
    this.precio = precio;
    this.estado_pago = estado_pago;
    this.estado_reserva = estado_reserva;
    this.visibilidad = visibilidad;
    this.horario_inicio = horario_inicio;
    this.horario_final = horario_final;
    this.dia = dia;
    this.codigo_invitacion = codigo_invitacion;
    this.chat = new Chat(this);
  }
}