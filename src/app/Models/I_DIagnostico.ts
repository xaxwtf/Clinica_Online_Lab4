export interface IDiagnostico {
  Altura:string,
  Peso:string,
  Temperatura:string,
  Presion:string,
  otrosDatos?: {clave:string, valor:any}[],
  comentarios?:string

}