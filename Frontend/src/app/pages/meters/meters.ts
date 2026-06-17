import { Component, OnInit, ChangeDetectorRef, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MeterService } from '../../services/meter.service';
import { LineService } from '../../services/line.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-meters',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule 
  ],
  templateUrl: './meters.html',
  styleUrls: ['./meters.css']
})
export class MetersComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  readonly isAdmin = computed(() => this.auth.role() === 'admin');

  meters: any[] = [];
  lines: any[] = []; 
  displayMeters: any[] = []; 

  searchId: number | null = null;
  currentMeter: any = { meterCode: '', lineId: null, status: 'Active' };
  isEditMode: boolean = false;

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;

  constructor(
    private meterService: MeterService,
    private lineService: LineService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadInitialData();
  }

 
  async loadInitialData() {
    try {
      const [meterRes, lineRes] = await Promise.all([
        this.meterService.getAllMeters(),
        this.lineService.getAllLines()
      ]);
      this.meters = [...meterRes];
      this.lines = [...lineRes];
      this.refreshTable();
    } catch (error) {
      console.error("Initialization failed", error);
    }
  }

  refreshTable() {
    this.totalPages = Math.ceil(this.meters.length / this.pageSize);
    
    if (this.currentPage < 1) this.currentPage = 1;
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayMeters = this.meters.slice(start, end);
    
    this.cdr.detectChanges();
  }


  changePage(delta: number) {
    const targetPage = this.currentPage + delta;
    if (targetPage >= 1 && targetPage <= this.totalPages) {
      this.currentPage = targetPage;
      this.refreshTable();
    }
  }

 
  onPageSizeChange() {
    if (this.pageSize < 1) this.pageSize = 1;
    if (this.pageSize > 10) this.pageSize = 10;
    
    this.currentPage = 1; 
    this.refreshTable();
  }

 
  async fetchSingleMeter() {
    if (!this.searchId) {
      this.currentPage = 1;
      this.refreshTable();
      return;
    }
    try {
      const meter = await this.meterService.getMeterById(this.searchId);
      this.displayMeters = meter ? [meter] : [];
      this.totalPages = meter ? 1 : 0;
      this.currentPage = 1;
      this.cdr.detectChanges();
    } catch (error) {
      this.displayMeters = [];
      this.totalPages = 0;
    }
  }

  
  async saveMeter() {
    try {
      let result: any;
      if (this.isEditMode) {
        result = await this.meterService.updateMeter(this.currentMeter.meterId, this.currentMeter);
        this.meters = this.meters.map(m => m.meterId === result.meterId ? result : m);
      } else {
        result = await this.meterService.createMeter(this.currentMeter);
        this.meters = [...this.meters, result];
      }
      this.resetForm();
      this.refreshTable();
    } catch (error) {
      alert("Save failed. Check console for details.");
    }
  }

  async deleteMeter(id: number) {
    if (confirm("Are you sure you want to delete this meter?")) {
      try {
        await this.meterService.deleteMeter(id);
        this.meters = this.meters.filter(m => m.meterId !== id);
        this.refreshTable();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  }

  editMeter(meter: any) {
    this.isEditMode = true;
    this.currentMeter = { 
      ...meter, 
      lineId: meter.line?.lineId || meter.lineId || null 
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm() {
    this.currentMeter = { meterCode: '', lineId: null, status: 'Active' };
    this.isEditMode = false;
  }

  /** Line name from API (lineName) or resolved from loaded lines list. */
  lineLabel(m: any): string {
    if (m?.lineName) {
      return m.lineName;
    }
    const lid = m?.lineId ?? m?.line?.lineId;
    if (lid == null) {
      return '—';
    }
    const line = this.lines.find((l) => l.lineId === lid);
    return line?.lineName ?? `Line #${lid}`;
  }
}