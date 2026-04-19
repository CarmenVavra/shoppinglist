import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor() { }

  openConfirmationDialog(enterAnimationDuration: string = '50ms', exitAnimationDuration: string = '50ms'): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    return dialogRef.afterClosed().pipe(
      map(result => result === true)
    );
  }

  openSnackBar(message: string) {
    setTimeout(() => {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 3000,
        data: message,
      });
    }, 300);
  }
}
