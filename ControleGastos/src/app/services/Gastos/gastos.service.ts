import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { GastoModel } from '../../models/Gasto/Gasto';
import { GastoDto } from '../../models/Gasto/GastoDto';
import { CategoriaModel } from '../../models/Categoria/CategoriaModel';

export interface ResumoPeriodoResponse {
  gastos: GastoModel[];
  total: number;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  private http = inject(HttpClient);
  private apiUrl = '/api/gastos';
  private categoriasApiUrl = '/api/categorias';


  getGastos(): Observable<GastoModel[]> {
    return this.http.get<GastoModel[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.error('Erro na API: ', error)
        return of([]);
      })
    )
  }

  getGastosPorTipo(tipo: string): Observable<GastoModel[]> {
    return this.http.get<GastoModel[]>(`${this.apiUrl}/tipo/${encodeURIComponent(tipo)}`).pipe(
      catchError(error => {
        console.error('Erro ao filtrar gastos por tipo: ', error);
        return of([]);
      })
    );
  }

  getTotalGastos(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar total de gastos: ', error);
        return of(0);
      })
    );
  }

  getTotalGastosPorTipo(tipo: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total/tipo/${encodeURIComponent(tipo)}`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar total por tipo: ', error);
        return of(0);
      })
    );
  }

  getGastosDoDia(): Observable<ResumoPeriodoResponse> {
    return this.http.get<ResumoPeriodoResponse>(`${this.apiUrl}/periodo/dia`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar gastos do dia: ', error);
        return of({ gastos: [], total: 0, quantidade: 0 });
      })
    );
  }

  getGastosDaSemana(): Observable<ResumoPeriodoResponse> {
    return this.http.get<ResumoPeriodoResponse>(`${this.apiUrl}/periodo/semana`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar gastos da semana: ', error);
        return of({ gastos: [], total: 0, quantidade: 0 });
      })
    );
  }

  getGastosDoMes(): Observable<ResumoPeriodoResponse> {
    return this.http.get<ResumoPeriodoResponse>(`${this.apiUrl}/periodo/mes`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar gastos do mes: ', error);
        return of({ gastos: [], total: 0, quantidade: 0 });
      })
    );
  }

  getGastosDosUltimos6Meses(): Observable<ResumoPeriodoResponse> {
    return this.http.get<ResumoPeriodoResponse>(`${this.apiUrl}/periodo/6meses`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar gastos dos ultimos 6 meses: ', error);
        return of({ gastos: [], total: 0, quantidade: 0 });
      })
    );
  }

  getCategorias(): Observable<CategoriaModel[]> {
    return this.http.get<CategoriaModel[]>(`${this.categoriasApiUrl}`).pipe(
      catchError(error => {
        console.error('Erro ao carregar categorias: ', error);
        return of([]);
      })
    );
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
        return throwError(() => error);
      })
    );
  }

  updateGasto(id: string, gasto: GastoDto): Observable<GastoModel> {
    return this.http.put<GastoModel>(`${this.apiUrl}/${id}`, gasto).pipe(
      catchError((error) => {
        console.error('Erro ao editar gasto:', error);
        return throwError(() => error);
      })
    );
  }

  deleteGasto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro ao excluir gasto:', error);
        return throwError(() => error);
      })
    );
  }
}
