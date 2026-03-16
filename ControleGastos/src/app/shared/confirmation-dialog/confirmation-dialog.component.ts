import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmationDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title || 'Confirmacao' }}</h2>

    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="fechar(false)">
        {{ data.cancelText || 'Cancelar' }}
      </button>
      <button mat-raised-button color="warn" type="button" (click)="fechar(true)">
        {{ data.confirmText || 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  fechar(confirmado: boolean): void {
    this.dialogRef.close(confirmado);
  }
}