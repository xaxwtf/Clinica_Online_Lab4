import { RangoHorario } from "./I_disponibilidadPorHora";

export interface DisponibilidadPorDia {
  lunes: RangoHorario[];
  martes: RangoHorario[];
  miercoles: RangoHorario[];
  jueves: RangoHorario[];
  viernes: RangoHorario[];
  sabado: RangoHorario[];
  domingo: RangoHorario[];
}