import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LineService } from '../../services/line.service';
import { MeterService } from '../../services/meter.service';
import { EnergyReadingService } from '../../services/energy-reading.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { getApiErrorMessage } from '../../services/api.service';

@Component({
  selector: 'app-line-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BaseChartDirective],
  templateUrl: './line-detail.html',
  styleUrls: ['./line-detail.css'],
})
export class LineDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly lineService = inject(LineService);
  private readonly meterService = inject(MeterService);
  private readonly energyService = inject(EnergyReadingService);
  private readonly cdr = inject(ChangeDetectorRef);

  lineId!: number;
  lineMeta: { lineId: number; lineName: string; location: string } | null = null;
  loadError: string | null = null;
  loading = true;

  metersOnLine: any[] = [];
  totalKwhDisplay = '—';
  activeMeterCount = 0;

  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  availableYears: number[] = [];
  readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  chartLoading = false;
  public chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
        title: { display: true, text: 'Energy (kWh)', color: '#64748b', font: { size: 12 } },
        ticks: { color: '#64748b' },
      },
      x: {
        grid: { display: false },
        title: { display: true, text: 'Day', color: '#64748b', font: { size: 12 } },
        ticks: { maxRotation: 45, minRotation: 0, color: '#64748b' },
      },
    },
  };

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.lineId = Number(idParam);
    if (!Number.isFinite(this.lineId) || this.lineId < 1) {
      this.loadError = 'Invalid line id.';
      this.loading = false;
      return;
    }

    const y = new Date().getFullYear();
    this.availableYears = [y - 2, y - 1, y, y + 1];

    await this.loadAll();
  }

  private meterLineId(m: any): number | null {
    const lid = m?.lineId ?? m?.line?.lineId;
    return lid != null ? Number(lid) : null;
  }

  async loadAll() {
    this.loading = true;
    this.loadError = null;
    try {
      const [meta, allMeters, totalRaw] = await Promise.all([
        this.lineService.getLineMeta(this.lineId),
        this.meterService.getAllMeters(),
        this.energyService.getLineTotals(this.lineId),
      ]);

      this.lineMeta = meta;
      this.metersOnLine = (allMeters || []).filter((m: any) => this.meterLineId(m) === this.lineId);
      this.metersOnLine.sort((a, b) => String(a.meterCode ?? '').localeCompare(String(b.meterCode ?? '')));

      const total = totalRaw != null ? Number(totalRaw) : NaN;
      this.totalKwhDisplay = Number.isFinite(total) ? total.toFixed(2) : '0.00';
      this.activeMeterCount = this.metersOnLine.filter(
        (m: any) => String(m.status ?? '').toLowerCase() === 'active',
      ).length;

      await this.loadChartData();
    } catch (e) {
      this.lineMeta = null;
      this.loadError = getApiErrorMessage(e, 'Could not load this line.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async onPeriodChange() {
    if (!this.lineMeta) return;
    await this.loadChartData();
  }

  async loadChartData() {
    this.chartLoading = true;
    this.cdr.detectChanges();
    try {
      const dailyData = await this.lineService.getDailyTotalsPerLine(
        this.lineId,
        this.selectedMonth,
        this.selectedYear,
      );
      const sortedKeys = Object.keys(dailyData || {}).sort();
      const labels = sortedKeys.map((k) => {
        const d = new Date(k);
        return Number.isNaN(d.getTime()) ? k : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      });
      const values = sortedKeys.map((k) => Number(dailyData[k]) || 0);

      this.chartData = {
        labels,
        datasets: [
          {
            data: values,
            label: 'Daily energy (kWh)',
            borderColor: '#0891B2',
            backgroundColor: 'rgba(8, 145, 178, 0.12)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#0891B2',
            pointBorderWidth: 2,
          },
        ],
      };
    } catch {
      this.chartData = { labels: [], datasets: [] };
    } finally {
      this.chartLoading = false;
      this.cdr.detectChanges();
    }
  }

  backToLines() {
    this.router.navigate(['/lines']);
  }
}
