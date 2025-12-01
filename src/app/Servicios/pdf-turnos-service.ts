import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ITurno } from '../Models/I_turnos';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { SUsuarios } from './s-usuarios';
import { IPaciente } from '../Models/i_Paciente';
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { IDiagnostico } from '../Models/I_DIagnostico';

@Injectable({
  providedIn: 'root'
})
export class TurnosPdfService {

  private firestore = inject(Firestore);
  private servicio_usuario = inject(SUsuarios);
  private DiagnosticoAux:string='';

  constructor() {}

  async generarHistoriaClinicaPDF(logoUrl: string,  id_paciente:string ):Promise<boolean> {

     const actual = await this.servicio_usuario.obtenerUsuario(id_paciente);
      if(actual==null){
        return false;
      }
    // Referencia del paciente
    const pacienteRef = doc(this.firestore, 'Usuarios', id_paciente) as unknown as DocumentReference<any>;

    // Traer turnos
    const turnosRef = collection(this.firestore, 'Turnos');
    const q = query(turnosRef, where('id_paciente', '==', pacienteRef),  where('estado', '==', 'finalizado') );
    const snap = await getDocs(q);

    const turnos: ITurno[] = snap.docs.map(docSnap => {
      const data = docSnap.data() as ITurno;
      data.uid = docSnap.id;
      return data;
    });

    console.log("Turnos:", turnos);

    // Usar SOLO UN PDF
    const docPdf = new jsPDF();

    // Logo
    if (logoUrl) {
      const img = await this.loadImage(logoUrl);
      docPdf.addImage(img, 'PNG', 10, 10, 50, 15);
    }

    // Título
    docPdf.setFontSize(18);
    docPdf.text('Historia Clínica del Paciente', 70, 25);

    // Fecha
    const fecha = new Date().toLocaleString();
    docPdf.setFontSize(10);
    docPdf.text(`Fecha de impresión: ${fecha}`, 140, 30);

    // Preparar datos para autoTable
    const bodyData = turnos.map(t => [
      t.especialista,
      t.especialidad,
      t.fecha,
      t.hora,
      this.diagnosticoToString(t.diagnostico)
    ]);

    // Tabla, ahora sí sobre el PDF correcto
    autoTable(docPdf, {
      head: [['Especialista', 'Especialidad', 'Fecha', 'Hora', 'Diagnostico']],
      body: bodyData,
      startY: 40,
      styles: { fontSize: 9 }
    });
    // Guardar PDF
    const aux = actual as IPaciente;
    docPdf.save(`Turnos_${aux.Email}.pdf`);
    return true;
  }

  private loadImage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No se pudo crear canvas context');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
    });
  }
  private diagnosticoToString(d: IDiagnostico | null | undefined): string {
   
  if (!d)
    return "Altura: N/A\nPeso: N/A\nTemp: N/A\nPresión: N/A";
    this.DiagnosticoAux = `Altura: ${d.Altura} \n Peso: ${d.Peso}\n Temperatura: ${d.Temperatura}\n Presión: ${d.Presion}`;
   if(d.otrosDatos){
    for(let i=0;i<d.otrosDatos.length; i++){
      const item = d.otrosDatos[i];
      this.DiagnosticoAux += `${item.clave}: ${item.valor}\n`;
    }
   }
   this.DiagnosticoAux+= `\n ${d.comentarios}`

  return this.DiagnosticoAux;
}

}
