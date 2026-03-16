import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { forkJoin, map, of, switchMap } from 'rxjs';
import {
  GastosService,
  ResumoPeriodoResponse,
} from '../services/Gastos/gastos.service';

Chart.register(...registerables);

type PeriodoDashboard = 'dia' | 'semana' | 'mes' | '6meses';

interface SeriePeriodo {
  chave: PeriodoDashboard;
  label: string;
  total: number;
  quantidade: number;
  gastos: ResumoPeriodoResponse['gastos'];
}

interface BarraTipo {
  tipo: string;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private gastosService = inject(GastosService);

  @ViewChild('linhaChartCanvas') linhaChartCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('barraChartCanvas') barraChartCanvas?: ElementRef<HTMLCanvasElement>;

  private chartLinha?: Chart<'line'>;
  private chartBarras?: Chart<'bar'>;
  private viewPronta = false;
  private tentativasRender = 0;
  private timeoutRenderId?: ReturnType<typeof setTimeout>;

  carregando = true;
  erro = '';

  totalGeral = 0;
  mediaTicket = 0;
  maiorPeriodo = 0;
  quantidadeTotal = 0;

  periodoSelecionado: PeriodoDashboard = 'mes';

  seriePeriodos: SeriePeriodo[] = [];
  barrasPorTipo: BarraTipo[] = [];

  readonly corBarras = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#06b6d4', '#f97316', '#84cc16'];

  ngOnInit(): void {
    this.carregarDashboard();
  }

  ngAfterViewInit(): void {
    this.viewPronta = true;
    this.atualizarGraficos();
  }

  ngOnDestroy(): void {
    if (this.timeoutRenderId) {
      clearTimeout(this.timeoutRenderId);
    }
    this.chartLinha?.destroy();
    this.chartBarras?.destroy();
  }

  get periodoAtual(): SeriePeriodo | undefined {
    return this.seriePeriodos.find((item) => item.chave === this.periodoSelecionado);
  }

  get gastosPeriodoSelecionado() {
    const gastos = this.periodoAtual?.gastos ?? [];
    return [...gastos]
      .sort((a, b) => new Date(b.dtCriacao).getTime() - new Date(a.dtCriacao).getTime())
      .slice(0, 8);
  }

  selecionarPeriodo(periodo: PeriodoDashboard): void {
    this.periodoSelecionado = periodo;
  }

  private carregarDashboard(): void {
    this.carregando = true;
    this.erro = '';

    forkJoin({
      categorias: this.gastosService.getCategorias(),
      gastos: this.gastosService.getGastos(),
      totalGeral: this.gastosService.getTotalGastos(),
      dia: this.gastosService.getGastosDoDia(),
      semana: this.gastosService.getGastosDaSemana(),
      mes: this.gastosService.getGastosDoMes(),
      seisMeses: this.gastosService.getGastosDosUltimos6Meses(),
    })
      .pipe(
        switchMap((base) => {
          const categorias = base.categorias ?? [];

          if (categorias.length === 0) {
            return of({
              base,
              totaisPorTipo: [] as number[],
            });
          }

          return forkJoin(categorias.map((categoria) => this.gastosService.getTotalGastosPorTipo(categoria.tipo))).pipe(
            map((totaisPorTipo) => ({
              base,
              totaisPorTipo,
            }))
          );
        })
      )
      .subscribe({
        next: ({ base, totaisPorTipo }) => {
          this.totalGeral = base.totalGeral ?? 0;

          this.seriePeriodos = [
            this.mapearPeriodo('dia', 'Hoje', base.dia),
            this.mapearPeriodo('semana', 'Semana', base.semana),
            this.mapearPeriodo('mes', 'Mes', base.mes),
            this.mapearPeriodo('6meses', '6 Meses', base.seisMeses),
          ];

          this.quantidadeTotal = (base.gastos ?? []).length;
          this.mediaTicket = this.quantidadeTotal > 0 ? this.totalGeral / this.quantidadeTotal : 0;
          this.maiorPeriodo = Math.max(...this.seriePeriodos.map((item) => item.total), 0);

          this.barrasPorTipo = base.categorias
            .map((categoria, index) => ({
              tipo: categoria.tipo,
              total: totaisPorTipo[index] ?? 0,
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 7);

          this.carregando = false;
          this.agendarRenderGraficos();
        },
        error: () => {
          this.erro = 'Nao foi possivel carregar os dados da dashboard.';
          this.carregando = false;
        },
      });
  }

  private mapearPeriodo(
    chave: PeriodoDashboard,
    label: string,
    resumo: ResumoPeriodoResponse | undefined
  ): SeriePeriodo {
    return {
      chave,
      label,
      total: resumo?.total ?? 0,
      quantidade: resumo?.quantidade ?? 0,
      gastos: resumo?.gastos ?? [],
    };
  }

  private atualizarGraficos(): void {
    if (!this.viewPronta) {
      return;
    }

    this.renderizarGraficoLinha();
    this.renderizarGraficoBarras();
  }

  private agendarRenderGraficos(): void {
    if (!this.viewPronta) {
      return;
    }

    if (this.timeoutRenderId) {
      clearTimeout(this.timeoutRenderId);
    }

    this.tentativasRender = 0;

    const tentarRender = () => {
      this.tentativasRender += 1;

      const linhaCanvasExiste = !!this.linhaChartCanvas?.nativeElement;
      const barraCanvasExiste = this.barrasPorTipo.length === 0 || !!this.barraChartCanvas?.nativeElement;

      if (linhaCanvasExiste && barraCanvasExiste) {
        this.atualizarGraficos();
        return;
      }

      if (this.tentativasRender < 8) {
        this.timeoutRenderId = setTimeout(tentarRender, 40);
      }
    };

    this.timeoutRenderId = setTimeout(tentarRender, 0);
  }

  private renderizarGraficoLinha(): void {
    const canvas = this.linhaChartCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    this.chartLinha?.destroy();

    const labels = this.seriePeriodos.map((item) => item.label);
    const valores = this.seriePeriodos.map((item) => item.total);

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Total por Periodo',
            data: valores,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.15)',
            borderWidth: 3,
            pointBackgroundColor: '#f97316',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                ` ${Number(context.parsed.y).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                Number(value).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                }),
            },
          },
        },
      },
    };

    this.chartLinha = new Chart(canvas, config);
  }

  private renderizarGraficoBarras(): void {
    const canvas = this.barraChartCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    this.chartBarras?.destroy();

    const labels = this.barrasPorTipo.map((item) => item.tipo);
    const valores = this.barrasPorTipo.map((item) => item.total);
    const cores = this.barrasPorTipo.map((_, index) => this.corBarras[index % this.corBarras.length]);

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total por Tipo',
            data: valores,
            backgroundColor: cores,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                ` ${Number(context.parsed.y).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                Number(value).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                }),
            },
          },
        },
      },
    };

    this.chartBarras = new Chart(canvas, config);
  }

}
