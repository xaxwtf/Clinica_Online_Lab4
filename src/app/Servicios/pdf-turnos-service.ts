import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc, DocumentData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ITurno } from '../Models/I_turnos';
import { IUsuarioDB } from '../Models/I_UsuarioDB';
import { DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class TurnosPdfService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  constructor() {}

  /**
   * Genera PDF con todos los turnos del paciente logeado
   * @param logoUrl URL de la imagen/logo a incluir
   * 
   */

  /* async generarPdfTurnosPaciente(logoUrl: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no logeado');

    // Referencia al paciente logeado
    const pacienteRef=  doc(this.firestore, 'Usuarios', user.uid) as DocumentReference<IUsuarioDB>;

    // Traer turnos donde el paciente sea el logeado
    const turnosRef = collection(this.firestore, 'Turnos');
    const q = query(turnosRef, where('id_paciente', '==', pacienteRef));
    const snap = await getDocs(q);

    const turnos: ITurno[] = snap.docs.map(docSnap => {
      const data = docSnap.data() as ITurno;
      data.uid = docSnap.id;
      return data;
    });

    // Crear documento PDF
    const doc = new jsPDF();

    // Agregar logo si existe
    if (logoUrl) {
      const img = await this.loadImage(logoUrl);
      doc.addImage(img, 'PNG', 10, 10, 50, 15); // ajusta posición y tamaño
    }

    // Título
    doc.setFontSize(18);
    doc.text('Turnos del Paciente', 70, 25);

    // Fecha de impresión
    const fecha = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Fecha de impresión: ${fecha}`, 140, 30);

    // Preparar datos de la tabla
    const bodyData = await Promise.all(turnos.map(async t => {
      // Obtener nombre del especialista
      const espSnap = await getDoc(t.id_especialista);
      const especialistaData = espSnap.exists() ? espSnap.data() : null;
      const especialistaNombre = especialistaData ? (especialistaData as any).Nombre || 'Sin nombre' : 'Sin nombre';

      // Convertir horario a Date si viene como Timestamp
      const fechaTurno = (t.horario as any)?.toDate ? (t.horario as any).toDate() : t.horario;

      return [
        especialistaNombre,
        t.especialidad,
        fechaTurno instanceof Date ? fechaTurno.toLocaleString() : fechaTurno,
        t.estado,
        t.reseña || ''
      ];
    }));

    // Crear tabla
    autoTable(doc, {
      head: [['Especialista', 'Especialidad', 'Horario', 'Estado', 'Reseña']],
      body: bodyData,
      startY: 40,
      styles: { fontSize: 9 }
    });

    // Guardar PDF
    doc.save(`Turnos_${user.displayName || user.email}.pdf`);
  }

  /**
   * Carga una imagen desde URL y la convierte a base64
   */
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
}
