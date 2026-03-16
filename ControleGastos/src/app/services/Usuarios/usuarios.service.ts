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

  constructor(private http: HttpClient) {}

  setUsuario(usuario: UsuarioCadastroRequestDto): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(`${this.usuarioUrl}`, usuario).pipe(
      catchError(error => {
        console.error('Erro na API: ', error);
        return throwError(() => error);
      })
    );
  }
}
