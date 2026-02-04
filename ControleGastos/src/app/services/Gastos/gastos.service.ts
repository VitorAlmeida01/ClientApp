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
  private apiUrl = 'http://localhost:8080/api/gastos';


  getGastos(): Observable<GastoModel[]> {
    return this.http.get<GastoModel[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.error('Erro na API: ', error)
        return of([]);
      })
    )
  }

  setGastos(gastos: GastoDto): Observable<GastoModel>{
    return this.http.post<GastoModel>(`${this.apiUrl}`, gastos)
  }
}
