import { Injectable } from '@angular/core';
import { api } from './api.service';

@Injectable({ providedIn: 'root' })
export class EnergyReadingService {

  async getAll() {
    const res = await api.get('/energyReadings');
    return res.data;
  }

  async getDailyTotals(lineId: number, date: string) {
    const res = await api.get(`/lines/${lineId}/${date}/daily-totals`);
    return res.data;
  }

  async getPeakHour(meterId: number) {
    const res = await api.get(`/meters/${meterId}/peak-hour`);
    return res.data;
  }

  async create(data: any) {
    const res = await api.post('/energyReadings', data);
    return res.data;
  }

  async getLineTotals(lineId: number) {
    const res = await api.get(`/energyReadings/lineTotal/${lineId}`);
    return res.data;
  }

  async injectSpike(meterId: number, value: number, timestamp: string) {
    const res = await api.put(
      `/meters/${meterId}/inject-spike?value=${value}&timestamp=${timestamp}`
    );
    return res.data;
  }

}