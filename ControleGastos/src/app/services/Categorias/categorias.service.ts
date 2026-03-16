import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { CategoriaModel } from '../../models/Categoria/CategoriaModel';
import { CategoriaRequestDto } from '../../models/Categoria/CategoriaRequestDto';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private categoriasApiUrl = '/api/categorias';

  constructor(private http: HttpClient) {}


  getCategorias(): Observable<CategoriaModel[]> {
    return this.http.get<CategoriaModel[]>(`${this.categoriasApiUrl}`).pipe(
      catchError(error => {
        console.error('Erro na API: ', error)
        return of([])
      })
    )
  }

  setCategorias(categoria: CategoriaRequestDto): Observable<CategoriaModel> {
    return this.http.post<CategoriaModel>(`${this.categoriasApiUrl}`, categoria).pipe(
      catchError((error) => {
        console.error('Erro ao cadastrar categoria: ', error);
        return throwError(() => error);
      })
    );
  }

  updateCategoria(id: string, categoria: CategoriaRequestDto): Observable<CategoriaModel> {
    return this.http.put<CategoriaModel>(`${this.categoriasApiUrl}/${id}`, categoria).pipe(
      catchError((error) => {
        console.error('Erro ao editar categoria: ', error);
        return throwError(() => error);
      })
    );
  }

  deleteCategoria(id: string): Observable<void> {
    return this.http.delete<void>(`${this.categoriasApiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro ao excluir categoria: ', error);
        return throwError(() => error);
      })
    );
  }

}
