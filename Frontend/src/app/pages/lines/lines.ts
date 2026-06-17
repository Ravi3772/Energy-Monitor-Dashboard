import { Component, OnInit, ChangeDetectorRef, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LineService } from '../../services/line.service';
import { MeterService } from '../../services/meter.service';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-lines',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lines.html',
  styleUrls: ['./lines.css']
})
export class LinesComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  readonly isAdmin = computed(() => this.auth.role() === 'admin');

  lines: any[] = [];
  pagedLines: any[] = [];
  searchId: number | null = null;
 
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
 
  currentLine: any = { lineName: '', location: '' };
  isEditMode: boolean = false;
 
  constructor(
    private lineService: LineService,
    private meterService: MeterService,
    private cdr: ChangeDetectorRef,
  ) {}
 
  async ngOnInit() {
    await this.loadLines();
  }
 
  async loadLines() {
    try {
      const [linesRes, metersRes] = await Promise.all([
        this.lineService.getAllLines(),
        this.meterService.getAllMeters(),
      ]);
      const countByLine = new Map<number, number>();
      for (const m of metersRes) {
        const lid = m.lineId ?? m.line?.lineId;
        if (lid != null) {
          countByLine.set(lid, (countByLine.get(lid) ?? 0) + 1);
        }
      }
      this.lines = linesRes.map((l: any) => ({
        ...l,
        meterCount: countByLine.get(l.lineId) ?? 0,
      }));
      this.updatePage();
    } catch (error) {
      console.error('Load failed', error);
    }
  }
 
  async fetchSingleLine() {
    if (!this.searchId) {
      await this.loadLines();
      return;
    }
    try {
      const line = await this.lineService.getLineById(this.searchId);
      if (!line) {
        this.pagedLines = [];
        this.totalPages = 0;
        this.currentPage = 1;
        this.cdr.detectChanges();
        return;
      }
      const meters = await this.meterService.getAllMeters();
      const meterCount = meters.filter(
        (m: any) => (m.lineId ?? m.line?.lineId) === line.lineId,
      ).length;
      this.pagedLines = [{ ...line, meterCount }];
      this.totalPages = 1;
      this.currentPage = 1;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Search failed', error);
      this.pagedLines = [];
      this.totalPages = 0;
      this.cdr.detectChanges();
    }
  }
 
  updatePage() {
    if (!this.lines || this.lines.length === 0) {
      this.pagedLines = [];
      this.totalPages = 0;
      return;
    }
    this.totalPages = Math.ceil(this.lines.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedLines = this.lines.slice(start, start + this.pageSize);
    this.cdr.detectChanges();
  }
 
  onPageSizeChange() {
    if (this.pageSize < 1) this.pageSize = 1;
    this.currentPage = 1;
    this.updatePage();
  }
 
  changePage(delta: number) {
    const next = this.currentPage + delta;
    if (next >= 1 && next <= this.totalPages) {
      this.currentPage = next;
      this.updatePage();
    }
  }
 
  async saveLine() {
    try {
      if (this.isEditMode) {
        await this.lineService.updateLine(this.currentLine.lineId, this.currentLine);
      } else {
        await this.lineService.createLine(this.currentLine);
      }
      this.resetForm();
      await this.loadLines();
    } catch (error) {
      alert("Save failed");
    }
  }
 
  async deleteLine(id: number) {
    if (confirm("Are you sure you want to delete this line?")) {
      try {
        await this.lineService.deleteLine(id);
        await this.loadLines();
      } catch (error) {
        alert("Delete failed");
      }
    }
  }
 
  editLine(line: any) {
    this.isEditMode = true;
    this.currentLine = { ...line };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  resetForm() {
    this.currentLine = { lineName: '', location: '' };
    this.isEditMode = false;
  }
}