import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UsuarioModel } from '../../models/Usuario/UsuarioModel';
import { UsuarioCadastroRequestDto } from '../../models/Usuario/UsuarioCadastroRequestDto';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarioUrl = '/api/usuarios/register';
  usuariosUrl = '/api/usuarios';

  constructor(private http: HttpClient) {}

  setUsuario(usuario: UsuarioCadastroRequestDto): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(`${this.usuarioUrl}`, usuario).pipe(
      catchError(error => {
        console.error('Erro na API: ', error);
        return throwError(() => error);
      })
    );
  }

  getUsuarios(): Observable<UsuarioModel[]>{
    return this.http.get<UsuarioModel[]>(`${this.usuariosUrl}`).pipe(
      catchError(error => {
        console.error('Erro na API: ', error)
        return throwError(() => error)
      })
    )
  }

  getUsuario(): Observable<UsuarioModel[]> {
    return this.getUsuarios();
  }

  updateUsuario(id: string, usuario: Pick<UsuarioCadastroRequestDto, 'nome' | 'email'>): Observable<UsuarioModel> {
    return this.http.put<UsuarioModel>(`${this.usuariosUrl}/${id}`, usuario).pipe(
      catchError(error => {
        console.error('Erro na API: ', error);
        return throwError(() => error);
      })
    );
  }

  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.usuariosUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erro na API: ', error);
        return throwError(() => error);
      })
    );
  }
}
