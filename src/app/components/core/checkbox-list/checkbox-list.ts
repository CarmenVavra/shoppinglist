import { Component, inject, input, output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CheckboxItem } from './models/checkbox-list.model';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from "@angular/material/select";
import { MatInput } from '@angular/material/input';
import { DeleteButton } from '../buttons/delete-button/delete-button';
import { SaveButton } from '../buttons/save-button/save-button';
import { PlusButton } from '../buttons/plus-button/plus-button';

@Component({
  selector: 'app-checkbox-list',
  imports: [MatCheckboxModule, DeleteButton, SaveButton, FormsModule, ReactiveFormsModule,
    MatFormField, MatInput, PlusButton, MatFormField],
  templateUrl: './checkbox-list.html',
  styleUrl: './checkbox-list.css'
})
export class CheckboxList {
  readonly items = input.required<CheckboxItem[]>();

  readonly saveAction = output<FormArray>();
  readonly toggleCheckedAction = output<CheckboxItem[]>();
  readonly deleteItemAction = output<CheckboxItem>();
  readonly deleteNewEntryAction = output<CheckboxItem>();

  #fb = inject(FormBuilder);

  toggleCbxForm = this.#fb.group({
    itemControl: this.#fb.array([]),
  });

  newEntriesForm = this.#fb.group({
    newEntries: this.#fb.array([]),
  });

  get newEntries() {
    return this.newEntriesForm.get('newEntries')! as FormArray;
  }

  get itemControl() {
    return this.toggleCbxForm.get('itemControl')! as FormArray;
  }

  protected update(isChecked: boolean, index: number) {
    this.items()[index].checked = isChecked;
  }

  protected deleteItem(index: number) {
    this.deleteItemAction.emit(this.items()[index]);
  }

  protected deleteNewEntry(index: number) {
    this.newEntries.removeAt(index);
  }

  protected save() {
    this.saveAction.emit(this.newEntries);
    this.newEntries.clear();
  }

  protected toggleChecked() {
    this.toggleCheckedAction.emit(this.items());
  }

  /**
   * Adds a new entry to the list.
   */
  protected add() {
    const newEntryForm = this.#fb.group({
      name: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      unit: new FormControl('', Validators.required),
    });

    this.newEntries.push(newEntryForm);
  }
}
