import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
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

export class PlayerDetailComponent implements OnInit, OnDestroy {
  player?: Player;
  loading = true;
  error?: string;

@ViewChild('radarCanvas') radarCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  constructor(private route: ActivatedRoute, private players: PlayersService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || Number.isNaN(id)) {
      this.loading = false;
      this.error = 'ID de jugador inválido';
      return;
    }

    this.players.get(id).subscribe({
      next: (p) => {
        this.player = p;
        this.loading = false;
        // Asegura que el canvas ya esté en el DOM
        queueMicrotask(() => this.renderChart());
      },
      error: () => {
        this.loading = false;
        this.error = 'No se pudo cargar el jugador';
      },
    });
  }

  private renderChart() {
    if (!this.player?.radar || !this.player.radar.length || !this.radarCanvas) {
      return;
    }

    const labels = this.player.radar.map(r => r.label);
    const data   = this.player.radar.map(r => r.value ?? 0);

    this.chart?.destroy();

    this.chart = new Chart(this.radarCanvas.nativeElement, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: this.player.name,
          data,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            suggestedMax: 100,
            ticks: { stepSize: 20 },
            pointLabels: { font: { size: 12 } },
          }
        },
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true },
        },
        elements: {
          line: { tension: 0.2 },
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
