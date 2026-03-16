import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData
} from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  private dialog = inject(MatDialog);

  confirm(data: ConfirmationDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        width: '360px',
        disableClose: true,
        data
      })
      .afterClosed()
      .pipe(map((confirmado) => !!confirmado));
  }
}