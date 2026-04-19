import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-save-button',
  imports: [MatButtonModule, FontAwesomeModule],
  templateUrl: './save-button.html',
  styleUrl: './save-button.css'
})
export class SaveButton {

  readonly saveAction = output();

  protected save() {
    this.saveAction.emit();
  }
}
