import { Component, ElementRef, inject, AfterViewInit, ViewChild, viewChild } from '@angular/core';
import  Highcharts from 'highcharts';
import { ILogs } from '../Models/I_Logs';
import { ServicesLogs } from '../Servicios/services-logs';
import { SUsuarios } from '../Servicios/s-usuarios';
import { IUsuarioDB } from '../Models/I_UsuarioDB';
import { ITurno } from '../Models/I_turnos';
import { Rol } from '../Models/Rol';
import { doc, Firestore } from '@angular/fire/firestore';
import { EspecialidadesService } from '../Servicios/s-especialidad';
import { TurnosService } from '../Servicios/turnos-service';
import { FormsModule } from '@angular/forms';
import { EstadoTurno } from '../Models/estadosTurno';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';



@Component({
  selector: 'app-estadisticas',
  imports:[FormsModule],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})

export class Estadisticas implements AfterViewInit {

  private serv_logs = inject(ServicesLogs);
  private serv_usuario = inject(SUsuarios);
  private serv_turnos= inject(TurnosService);
  private serv_especialidades=inject(EspecialidadesService);
  listaLogs: ILogs[] = [];
  listaUsuarios: IUsuarioDB[] = [];
  listaTurnos:ITurno[]=[];
  listaEspecialidadesActuales:{uid:string, nombre:string}[]=[];
   


@ViewChild('graficoRef') graficoRef!: ElementRef;
@ViewChild('testRef') testRef!: ElementRef;
@ViewChild('grafico_dia_ref') grafico_dia_ref!: ElementRef;
@ViewChild('graficoTurnosMedico') graficoTurnosMedico!: ElementRef;
@ViewChild('graficoTurnosFinalizados') graficoTurnosFinalizados!:ElementRef;

fechaDesde: string = "";
fechaHasta: string = "";
testeando=Exporting;

constructor(){
  
      // Inicializar módulos
}

  async ngAfterViewInit() {
    await this.cargarDatos();
    this.generarGraficoPrincipal();
    this.test();
    this.graficoTurnosPorDia();
  }

  async cargarDatos() {
    this.listaLogs = await this.serv_logs.getAllLogs();
    this.listaUsuarios = await this.serv_usuario.getAllUsuarios();
    this.listaTurnos= await this.serv_turnos.getAllTurnos();
    this.listaEspecialidadesActuales= await this.serv_especialidades.getAllEspecialidades();
    console.log(this.listaTurnos, "turnos obtenidos");

  }

  generarGraficoPrincipal() {
     const cont = this.graficoRef.nativeElement;

    if (!cont) {
      return;
    }

    const series = this.generarScatterSeries();

    Highcharts.chart(cont, {
      chart: { type: 'scatter' },
      title: { text: 'Ingresos por usuario (día y horario)' },
      xAxis: {
        type: 'datetime',
        title: { text: 'Fecha y hora' }
      },
      yAxis: {
        title: { text: 'Usuarios' },
        categories: this.listaUsuarios.map(
          u => `${u.Nombre} ${u.Apellido}`
        ),
        tickInterval: 1
      },
      series: series as Highcharts.SeriesOptionsType[]
    });
  }

  private generarScatterSeries() {
    const series: Highcharts.SeriesScatterOptions[] = [];

    this.listaUsuarios.forEach((usuario, index) => {
      const puntos = this.listaLogs
        .filter(log => log.uid_usuario === usuario.uid)
        .map(log => {
          const f = this.normalizarFecha(log.log_in);
          if (!f) return null;
          return { x: f.getTime(), y: index };
        })
        .filter(p => p !== null);

      series.push({
        type: 'scatter',
        name: `${usuario.Nombre} ${usuario.Apellido}`,
        data: puntos!
      });
    });

    return series;
  }

  private normalizarFecha(f: any): Date | null {
    if (!f) return null;

    if (f instanceof Date) return f;

    if (f.seconds != null) return new Date(f.seconds * 1000);

    if (typeof f === "string") {
      const d = new Date(f);
      return isNaN(d.getTime()) ? null : d;
    }

    if (typeof f === "number") {
      const d = new Date(f);
      return isNaN(d.getTime()) ? null : d;
    }

    return null;
  }

test() {
  const cont = this.testRef.nativeElement;

  if (!cont) {
    console.error('❌ No se encontró el contenedor #test');
    return;
  }

  // Categorías: nombres de especialidades
  const categorias = this.listaEspecialidadesActuales.map(e => e.nombre);

  // Contar turnos por especialidad
  const cantidades = this.listaEspecialidadesActuales.map(esp =>
    this.listaTurnos.filter(t => t.especialidad === esp.uid).length
  );

  Highcharts.chart(cont, {
    chart: { type: 'column' },
    title: { text: 'Cantidad de turnos por especialidad' },
    xAxis: {
      categories: categorias,
      title: { text: 'Especialidades' },
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: { text: 'Cantidad de turnos' }
    },
    series: [
      {
        name: 'Turnos',
        type: 'column',
        data: cantidades
      }
    ]
  });
}

graficoTurnosPorDia() {

  const cont = this.grafico_dia_ref.nativeElement;

  if (!cont) {
    console.error('❌ No se encontró el contenedor #graficoDias');
    return;
  }

  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const contador = [0, 0, 0, 0, 0, 0, 0];

  this.listaTurnos.forEach(t => {
    if (!t.fecha) return;

    let d = new Date(t.fecha);

    // Si el string viene como DD/MM/YYYY
    if (isNaN(d.getTime()) && t.fecha.includes("/")) {
      const [dia, mes, año] = t.fecha.split("/");
      d = new Date(`${año}-${mes}-${dia}`);
    }

    if (!isNaN(d.getTime())) {
      const diaSemana = d.getDay();  // 0 = domingo, 6 = sábado
      contador[diaSemana]++;
    }
  });

  Highcharts.chart(cont, {
    chart: { type: 'column' },
    title: { text: 'Cantidad de turnos por día de la semana' },

    xAxis: {
      categories: dias,
      title: { text: 'Día' },
      crosshair: true
    },

    yAxis: {
      min: 0,
      title: { text: 'Cantidad de turnos' }
    },

    series: [
      {
        name: 'Turnos',
        type: 'column',
        data: contador
      }
    ]
  });
}

generarGraficoTurnosPorMedico() {
  if (!this.fechaDesde || !this.fechaHasta) {
    console.log("Seleccione ambas fechas");
    return;
  }

const desde = new Date(this.fechaDesde + 'T00:00:00'); // inicio del día
const hasta = new Date(this.fechaHasta + 'T23:59:59'); // fin del día

  const cont = this.graficoTurnosMedico.nativeElement;
  if (!cont) return;

  const turnosFiltrados = this.listaTurnos.filter(t => {
    if (!t.fecha_emision) return false;

    let fecha: Date;

    if ('seconds' in t.fecha_emision) {
      fecha = t.fecha_emision.toDate ? t.fecha_emision.toDate() : new Date(t.fecha_emision.seconds * 1000);
    } else {
      fecha = new Date(t.fecha_emision);
    }

    return fecha >= desde && fecha <= hasta;
  });

  console.log("Turnos filtrados:", turnosFiltrados);

  const especialistas = this.listaUsuarios.filter(u => u.rol === Rol.Especialista);

  const categorias = especialistas.map(e => `${e.Nombre} ${e.Apellido}`);
  const cantidades = especialistas.map(e => turnosFiltrados.filter(t => t.id_especialista.id === e.uid).length);
  console.log(cantidades, "estoy filtrando esto");
  Highcharts.chart(cont, {
    chart: { type: 'column' },
    title: { text: 'Turnos solicitados por médico en el rango seleccionado' },
    xAxis: {
      categories: categorias,
      title: { text: 'Médicos' }
    },
    yAxis: {
      min: 0,
      title: { text: 'Cantidad de turnos solicitados' }
    },
    series: [
      {
        name: "Solicitudes",
        type: "column",
        data: cantidades
      }
    ]
  });
}

generarGraficoTurnosFinalizados() {
  if (!this.fechaDesde || !this.fechaHasta) {
    alert("Seleccione ambas fechas");
    return;
  }

  const desde = new Date(this.fechaDesde);
  const hasta = new Date(this.fechaHasta);
  hasta.setHours(23, 59, 59); // incluir fin del día

  const cont = this.graficoTurnosFinalizados.nativeElement;
  if (!cont) return;

  // Filtrar turnos dentro del rango y que estén finalizados
  const turnosFiltrados = this.listaTurnos.filter(t => {
    if (!t.fecha_emision) return false;

    let fecha: Date;

    if ('seconds' in t.fecha_emision) {
      fecha = t.fecha_emision.toDate ? t.fecha_emision.toDate() : new Date(t.fecha_emision.seconds * 1000);
    } else {
      fecha = new Date(t.fecha_emision);
    }

    return fecha >= desde && fecha <= hasta && t.estado === EstadoTurno.FINALIZADO;
  });

  // Especialistas
  const especialistas = this.listaUsuarios.filter(u => u.rol === Rol.Especialista);

  const categorias = especialistas.map(e => `${e.Nombre} ${e.Apellido}`);
  const cantidades = especialistas.map(e =>
    turnosFiltrados.filter(t => t.id_especialista.id === e.uid).length
  );

  Highcharts.chart(cont, {
    chart: { type: 'column' },
    title: { text: 'Turnos finalizados por médico en el rango seleccionado' },
    xAxis: {
      categories: categorias,
      title: { text: 'Médicos' }
    },
    yAxis: {
      min: 0,
      title: { text: 'Cantidad de turnos finalizados' }
    },
    series: [
      {
        name: "Finalizados",
        type: "column",
        data: cantidades
      }
    ]
  });
}

}
