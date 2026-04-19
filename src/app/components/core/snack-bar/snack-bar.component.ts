import { Component, Inject, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  imports: [MatButtonModule, MatSnackBarModule],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css'
})
export class SnackBarComponent {
  readonly text = input<string>('');
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }
}


