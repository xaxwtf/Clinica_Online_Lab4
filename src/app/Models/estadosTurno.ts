export enum EstadoTurno {
  SOLICITADO = 'solicitado', ///al crear el turno
  ACEPTADO = 'aceptado', ///el especialista decir entre
  RECHAZADO = 'rechazado', /// y rechazarlo
  RECHAZADO_ADMINISTRACION='rechazado_administracion', //// los administradores pueden rechazar las solicitudes
  CANCELADO_PACIENTE = 'cancelado_paciente', /// el usuario cancelo el turno
  CANCELADO_ESPECIALISTA = 'cancelado_especialista', ////el especialista cancelo, el turno
  FINALIZADO = 'finalizado', //// el especialista finaliza el turno
  DISPONIBLE = 'disponible'  //// estado al generar los turnos hipoteteticos
}
