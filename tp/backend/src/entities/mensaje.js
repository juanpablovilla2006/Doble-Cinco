export class Mensaje {
  constructor(contenido, fecha_enviado, usuario,chat) {
    this.contenido = contenido;
    this.fecha_enviado = fecha_enviado;
    this.usuario = usuario;
    this.chat = chat;
  }
}