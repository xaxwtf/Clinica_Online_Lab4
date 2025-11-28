import { DisponibilidadPorDia } from "./I_disponibilidadPorDia";

export interface DisponibilidadPorEspecialidad {
  [especialidad: string]: DisponibilidadPorDia;
}
