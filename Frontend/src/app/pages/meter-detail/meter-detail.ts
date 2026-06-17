import { Component, OnInit, ChangeDetectorRef, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MeterService } from '../../services/meter.service';
import { EnergyReadingService } from '../../services/energy-reading.service';
import { AuthService } from '../../services/auth.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
 
@Component({
  selector: 'app-meter-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BaseChartDirective],
  templateUrl: './meter-detail.html',
  styleUrls: ['./meter-detail.css']
})
export class MeterDetailComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  readonly isAdmin = computed(() => this.auth.role() === 'admin');

  meterId!: number;
  meterObj: any = null;
  allReadings: any[] = [];
  filteredReadings: any[] = [];
 
  selectedDate: string = new Date().toISOString().split('T')[0];
 
  timeSlots: string[] = [];
  injection = { kwh: 0, date: new Date().toISOString().split('T')[0], time: '' };
 
  public chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Energy (kWh)' } },
      x: { title: { display: true, text: 'Time (HH:mm)' } }
    }
  };
 
  constructor(
    private route: ActivatedRoute,
    private meterService: MeterService,
    private energyService: EnergyReadingService,
    private cdr: ChangeDetectorRef
  ) {}
 
  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.meterId = Number(idParam);
    await this.loadData();
 
    for (let h = 0; h < 24; h++) {
      this.timeSlots.push(`${String(h).padStart(2, '0')}:00`);
      this.timeSlots.push(`${String(h).padStart(2, '0')}:30`);
    }
  }
 
  async loadData() {
    try {
      this.meterObj = await this.meterService.getMeterById(this.meterId);
 
      if (this.meterObj && this.meterObj.readings) {
        this.allReadings = this.meterObj.readings;
        console.log(`Successfully loaded ${this.allReadings.length} readings from Meter object.`);
      } else {
        console.warn("No readings found nested in Meter object. Checking fallback...");
        const res = await this.energyService.getAll();
        this.allReadings = res.filter((r: any) => r.meterId == this.meterId);
      }
 
      this.applyDateFilter();
    } catch (e) {
      console.error("Data load failed", e);
    }
  }
 
  applyDateFilter() {
    if (!this.allReadings) return;
 
    this.filteredReadings = this.allReadings.filter(r => {
      if (!r.timeStamp) return false;
      const rDate = r.timeStamp.split('T')[0];
      return rDate === this.selectedDate;
    });
 
    this.filteredReadings.sort((a, b) => a.timeStamp.localeCompare(b.timeStamp));
 
    this.updateGraph();
    this.cdr.detectChanges();
  }
 
  updateGraph() {
    const labels = this.filteredReadings.map(r => r.timeStamp.substring(11, 16));
    const values = this.filteredReadings.map(r => r.kwh);
 
    this.chartData = {
      labels,
      datasets: [{
        data: values,
        label: `Usage on ${this.selectedDate}`,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4
      }]
    };
  }
 
  async injectSpike() {
    if (this.injection.kwh <= 0) return alert("Enter a valid value.");
 
    if (!this.meterObj || this.meterObj.status?.toLowerCase() !== "active") {
      return alert("Cannot inject spike. Meter is not active.");
    }
 
    const timestamp = `${this.injection.date}T${this.injection.time}:00`;
 
    try {
      await this.energyService.injectSpike(this.meterId, this.injection.kwh, timestamp);
      this.injection.kwh = 0;
      await this.loadData();
      alert("Spike injected successfully");
    } catch (e) {
      alert("Injection failed");
    }
  }
}