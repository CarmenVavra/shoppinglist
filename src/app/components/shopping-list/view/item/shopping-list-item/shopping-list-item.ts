import { Component, input } from '@angular/core';
import { ListItem } from '../../../models/shopping-list-model';

@Component({
  selector: 'app-shopping-list-item',
  imports: [],
  templateUrl: './shopping-list-item.html',
  styleUrl: './shopping-list-item.css',
})
export class ShoppingListItem {
  readonly listItem = input<ListItem>();


}
