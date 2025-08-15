import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlayersService, Player } from '../../services/players.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './player-detail.component.html',
})
export class PlayerDetailComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  player?: Player;
  loading = true;
  error?: string;

  @ViewChild('radarCanvas') radarCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  private viewReady = false;
  private pendingRender = false; // nos indica que debemos reintentar cuando el canvas exista

  constructor(
    private route: ActivatedRoute,
    private players: PlayersService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || !/^\d+$/.test(idParam)) {
      this.loading = false;
      this.error = 'ID de jugador inválido';
      console.warn('[detail] id param inválido:', idParam);
      return;
    }
    const id = Number(idParam);

    this.players.get(id).subscribe({
      next: (p) => {
        this.player = p;
        this.loading = false;

        // Como el canvas está bajo *ngIf, forzamos un ciclo de cambio
        // y marcamos que hay un render pendiente.
        this.pendingRender = true;
        this.cd.detectChanges();

        // Reintento en el siguiente tick para asegurar que ViewChild se asigne.
        setTimeout(() => this.tryRenderChart());
      },
      error: (e) => {
        this.loading = false;
        this.error = 'No se pudo cargar el jugador';
        console.error('[detail] error get player', e);
      },
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    // si ya teníamos datos, intentamos (puede que aún no exista el canvas por el *ngIf)
    this.pendingRender = true;
    setTimeout(() => this.tryRenderChart());
  }

  ngAfterViewChecked(): void {
    // Si hay un render pendiente y ya tenemos canvas, pintamos.
    if (this.pendingRender && this.viewReady && this.radarCanvas?.nativeElement) {
      this.pendingRender = false;
      this.tryRenderChart();
    }
  }

  private tryRenderChart(): void {
    if (!this.viewReady) {
      console.log('[radar] view no listo aún');
      this.pendingRender = true;
      return;
    }
    if (!this.player) {
      console.log('[radar] sin player aún');
      this.pendingRender = true;
      return;
    }
    if (!this.player.radar || !this.player.radar.length) {
      console.log('[radar] player.radar vacío o inexistente:', this.player.radar);
      return;
    }
    if (!this.radarCanvas || !this.radarCanvas.nativeElement) {
      console.log('[radar] canvas no disponible aún');
      this.pendingRender = true;
      return;
    }

    const labels = this.player.radar.map((r) => r.label);
    const data = this.player.radar.map((r) => Number(r.value ?? 0));
    console.log('[radar] labels:', labels, 'data:', data);

    // destruir gráfico previo si existe
    this.chart?.destroy();

    this.chart = new Chart(this.radarCanvas.nativeElement, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: this.player.name,
            data,
            fill: true,
            borderWidth: 2,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            suggestedMax: 100,
            ticks: { stepSize: 20 },
            grid: { lineWidth: 1 },
            angleLines: { lineWidth: 1 },
            pointLabels: { font: { size: 12 } },
          },
        },
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true },
        },
        elements: { line: { tension: 0.2 } },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
