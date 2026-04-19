import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-plus-button',
  imports: [],
  templateUrl: './plus-button.html',
  styleUrl: './plus-button.css'
})
export class PlusButton {
  readonly showText = input<boolean>(true);
  readonly openCreateAction = output();

  protected openCreate() {
    this.openCreateAction.emit();
  }
}
