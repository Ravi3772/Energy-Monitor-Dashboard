import { Injectable } from '@angular/core';
import { api } from './api.service';

export interface OperatorAccountResponse {
  username: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AdminOperatorService {
  async createOperator(username: string, password: string): Promise<OperatorAccountResponse> {
    const { data } = await api.post<OperatorAccountResponse>('/admin/operators', {
      username: username.trim(),
      password,
    });
    return data;
  }

  async listOperators(): Promise<OperatorAccountResponse[]> {
    const { data } = await api.get<OperatorAccountResponse[]>('/admin/operators');
    return data;
  }
}
