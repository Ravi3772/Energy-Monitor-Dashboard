import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeterService } from '../../services/meter.service';
import { LineService } from '../../services/line.service';
import { EnergyReadingService } from '../../services/energy-reading.service';
import { AuthService } from '../../services/auth.service';
import { OperatorMonitorIconComponent } from '../../components/operator-monitor-icon/operator-monitor-icon';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, OperatorMonitorIconComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  
  @ViewChild('demandChart') demandChartElement: ElementRef | undefined;

  stats = { totalMeters: 0, activeMeters: 0, totalLines: 0, totalEnergyToday: 0 };
  linesData: any[] = [];
  selectedLine: any = null;
  lines: any[] = [];
  chart: any;
  
  private pendingChartData: any = null;

  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [];

  pagedMeters: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;

  constructor(
    private meterService: MeterService,
    private lineService: LineService,
    private readingService: EnergyReadingService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.initializeYearRange();
    await this.calculateDashboardStats();
  }

  initializeYearRange() {
    const currentYear = new Date().getFullYear();
    this.availableYears = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
  }

  async calculateDashboardStats() {
    try {
      const lineRes = await this.lineService.getAllLines();
      this.lines = lineRes || [];
      const linePromises = this.lines.map(async (line: any) => {
        const consumption = await this.readingService.getLineTotals(line.lineId);
        return {
          ...line,
          totalConsumption: Number(consumption || 0).toFixed(2),
          meters: line.meters || []
        };
      });

      this.linesData = await Promise.all(linePromises);

      const allMeters = this.linesData.flatMap(l => l.meters);
      this.stats.totalMeters = allMeters.length;
      this.stats.activeMeters = allMeters.filter((m: any) => m.status === 'Active').length;
      this.stats.totalLines = this.lines.length;
      this.stats.totalEnergyToday = this.linesData.reduce((sum, l) => sum + parseFloat(l.totalConsumption), 0);

      // Auto-select first line if available
      if (this.linesData.length > 0) {
        const firstLine = this.linesData[0];
        this.selectedLine = firstLine;
        this.currentPage = 1;
        
        // Trigger change detection to render the selectedLine in view
        this.cdr.detectChanges();

        // Now fetch and render chart after view is updated
        try {
          const dailyData = await this.lineService.getDailyTotalsPerLine(firstLine.lineId, this.selectedMonth, this.selectedYear);
          // Use setTimeout to ensure DOM is fully updated
          setTimeout(() => {
            this.renderChart(dailyData);
          }, 100);
        } catch (e) {
          console.error("Chart data fetch failed", e);
        }

        const meterPromises = firstLine.meters.map(async (m: any) => {
          try {
            const peakData = await this.readingService.getPeakHour(m.meterId);
            if (peakData) {
              const isEntry = 'key' in peakData;
              const hour = isEntry ? peakData.key : Object.keys(peakData)[0];
              const value = isEntry ? peakData.value : peakData[hour];
              m.peakHour = hour !== undefined ? `${String(hour).padStart(2, '0')}:00` : 'N/A';
              m.peakValue = value !== undefined ? Number(value).toFixed(2) : '0.00';
            }
          } catch (e) {
            m.peakHour = 'N/A';
            m.peakValue = '0.00';
          }
          return m;
        });

        await Promise.all(meterPromises);
        this.updateMeterPage();
      }
    } catch (error) {
      console.error("Dashboard calculation failed", error);
    }
  }

  async selectLine(event: any) {
    const lineId = event.target.value;
    const line = this.linesData.find(l => l.lineId == lineId);
    if (!line) return;

    this.selectedLine = line;
    this.currentPage = 1;

    try {
      const dailyData = await this.lineService.getDailyTotalsPerLine(lineId, this.selectedMonth, this.selectedYear);
      this.renderChart(dailyData);
    } catch (e) {
      console.error("Chart data fetch failed", e);
    }

    const meterPromises = this.selectedLine.meters.map(async (m: any) => {
      try {
        const peakData = await this.readingService.getPeakHour(m.meterId);
        if (peakData) {
          const isEntry = 'key' in peakData;
          const hour = isEntry ? peakData.key : Object.keys(peakData)[0];
          const value = isEntry ? peakData.value : peakData[hour];
          m.peakHour = hour !== undefined ? `${String(hour).padStart(2, '0')}:00` : 'N/A';
          m.peakValue = value !== undefined ? Number(value).toFixed(2) : '0.00';
        }
      } catch (e) {
        m.peakHour = 'N/A';
        m.peakValue = '0.00';
      }
      return m;
    });

    await Promise.all(meterPromises);
    this.updateMeterPage();
  }

  async onDateChange() {
    if (!this.selectedLine) return;

    try {
      const dailyData = await this.lineService.getDailyTotalsPerLine(
        this.selectedLine.lineId,
        this.selectedMonth,
        this.selectedYear
      );
      this.renderChart(dailyData);
    } catch (e) {
      console.error("Chart data fetch failed for new date", e);
    }
  }

  renderChart(dailyData: any) {
  if (this.chart) this.chart.destroy();

  const labels = Object.keys(dailyData).sort().map(d => new Date(d).toLocaleDateString());
  const values = labels.map((_, i) => dailyData[Object.keys(dailyData).sort()[i]]);

  this.chart = new Chart("demandChart", {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Daily Energy (kWh)',
        data: values,
        borderColor: '#2563eb',                  
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 4    
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f1f5f9' } , title: { display: true, text: 'Energy (kWh)' }},
        x: { grid: { display: false }, title: { display: true, text: 'Date (DD/MM/YYYY)' } }
      }
    }
  });
}

  onPageSizeChange() {
    if (this.pageSize < 1) this.pageSize = 1;
    if (this.pageSize > 10) this.pageSize = 10;
    this.currentPage = 1;
    this.updateMeterPage();
  }

  changePage(delta: number) {
    const next = this.currentPage + delta;
    if (next >= 1 && next <= this.totalPages) {
      this.currentPage = next;
      this.updateMeterPage();
    }
  }

  updateMeterPage() {
    if (!this.selectedLine?.meters) {
      this.pagedMeters = [];
      this.totalPages = 0;
      return;
    }
    this.totalPages = Math.ceil(this.selectedLine.meters.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedMeters = this.selectedLine.meters.slice(start, start + this.pageSize);
    this.cdr.detectChanges();
  }
}