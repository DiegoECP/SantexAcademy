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
  @ViewChild('radarCanvas') radarCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  constructor(private route: ActivatedRoute, private players: PlayersService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.players.get(id).subscribe({
      next: (p) => {
        this.player = p;
        this.loading = false;
        queueMicrotask(() => this.renderChart()); // asegura que el canvas exista
      },
      error: () => (this.loading = false),
    });
  }

  renderChart() {
    if (!this.player?.radar || !this.radarCanvas) return;

    const labels = this.player.radar.map(r => r.label);
    const data = this.player.radar.map(r => r.value);

    this.chart?.destroy();
    this.chart = new Chart(this.radarCanvas.nativeElement, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: this.player.name,
          data,
          // (no seteamos colores específicos como regla; Chart.js elige por defecto)
          fill: true,
        }],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            suggestedMax: 100,
            ticks: { stepSize: 20 },
          }
        },
        plugins: {
          legend: { display: true }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
