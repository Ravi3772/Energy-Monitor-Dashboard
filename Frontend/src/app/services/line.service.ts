import { Injectable } from '@angular/core';
import { api } from './api.service';

@Injectable({ providedIn: 'root' })
export class LineService {

  async getAllLines() {
    const res = await api.get('/lines');
    return res.data;
  }

  async getDailyTotals(lineId: number, date: string) {
    const res = await api.get(`/lines/${lineId}/${date}/daily-totals`);
    return res.data;
  }

  async createLine(data: any) {
    const res = await api.post('/lines', data);
    return res.data;
  }

  async updateLine(id: number, data: any) {
    const res = await api.put(`/lines/${id}`, data);
    return res.data;
  }

  async deleteLine(id: number) {
    const res = await api.delete(`/lines/${id}`);
    return res.data;
  }

  async getDailyTotalsPerLine(lineId: number, month: number, year: number) {
    const res = await api.get(`/lines/${lineId}/${year}/${month}/daily-totals-per-line`);
    return res.data;
  }

  async getLineById(lineId: number) {
    const res = await api.get(`/lines/${lineId}`);
    return res.data;
  }

  /** Line id, name, and location only — fast, no nested meters/readings. */
  async getLineMeta(lineId: number) {
    const res = await api.get(`/lines/${lineId}/meta`);
    return res.data;
  }
}