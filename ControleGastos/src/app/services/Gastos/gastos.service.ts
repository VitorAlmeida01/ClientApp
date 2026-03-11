import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { GastoModel } from '../../models/Gasto/Gasto';
import { GastoDto } from '../../models/Gasto/GastoDto';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  private http = inject(HttpClient);
  private apiUrl = '/api/gastos';


  getGastos(): Observable<GastoModel[]> {
    return this.http.get<GastoModel[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.error('Erro na API: ', error)
        return of([]);
      })
    )
  }

  setGastos(gastos: GastoDto): Observable<GastoModel>{
    return this.http.post<GastoModel>(`${this.apiUrl}`, gastos).pipe(
      catchError(error => {
        console.error('❌ Erro ao cadastrar gasto:', error);
        console.error('Status:', error.status);
        console.error('Mensagem:', error.message);
        if (error.status === 403) {
          console.error('🚫 Erro 403: Token inválido, expirado ou sem permissão');
        }
        throw error;
      })
    );
  }
}
