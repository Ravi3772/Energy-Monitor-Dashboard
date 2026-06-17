import { Injectable } from '@angular/core';
import { api } from './api.service';

@Injectable({ providedIn: 'root' })
export class MeterService {
  async getAllMeters() {
    const res = await api.get('/meters');
    return res.data;
  }
  async getMeterById(id: number) {
  const res = await api.get(`/meters/${id}`);
  return res.data;
}
  async createMeter(data: any) {
    const payload = {
      meterCode: data.meterCode,
      status: data.status,
      line: { lineId: data.lineId }, 
      createdAt: new Date().toISOString()
    };
    return (await api.post('/meters', payload)).data;
  }

  async updateMeter(id: number, data: any) {
    const payload = {
      meterId: id,
      meterCode: data.meterCode,
      status: data.status,
      line: { lineId: data.lineId },
      createdAt: data.createdAt 
    };
    return (await api.put(`/meters/${id}`, payload)).data;
  }

  async deleteMeter(id: number) {
    return (await api.delete(`/meters/${id}`)).data;
  }
}