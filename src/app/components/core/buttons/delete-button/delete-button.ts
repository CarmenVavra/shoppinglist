import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-button',
  imports: [MatButtonModule],
  templateUrl: './delete-button.html',
  styleUrl: './delete-button.css'
})
export class DeleteButton {

  readonly deleteAction = output();

  protected delete() {
    this.deleteAction.emit();
  }
}
