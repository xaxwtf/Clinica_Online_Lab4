import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { IAdmin } from '../Models/I_Admin';
import { IEspecialista } from '../Models/I_Especialista';
import { IPaciente } from '../Models/i_Paciente';
import { Rol } from '../Models/Rol';

@Injectable({ providedIn: 'root' })
export class ExcelUsuariosService {
  private firestore = inject(Firestore);

  constructor() {}

  // Traer usuarios por rol
  private async getUsuariosPorRol<T>(rol: Rol): Promise<T[]> {
    const q = query(collection(this.firestore, 'Usuarios'), where('rol', '==', rol));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as T[];
  }

  // Generar Excel con hojas por rol
  public async generarExcelUsuarios() {
    // Traemos usuarios de cada rol
    const admins = await this.getUsuariosPorRol<IAdmin>(Rol.Admin);
    const especialistas = await this.getUsuariosPorRol<IEspecialista>(Rol.Especialista);
    const pacientes = await this.getUsuariosPorRol<IPaciente>(Rol.Paciente);

    // Creamos libro
    const wb = XLSX.utils.book_new();

    // Creamos hojas
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(admins), 'Admins');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(especialistas), 'Especialistas');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(pacientes), 'Pacientes');

    // Escribimos y descargamos
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'usuarios_por_rol.xlsx');
  }
}
