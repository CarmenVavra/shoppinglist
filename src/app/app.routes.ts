import { Routes } from '@angular/router';
import { ShoppingList } from './components/shopping-list/view/shopping-list';
import { Home } from './components/home/home';

export const routes: Routes = [
  { path: 'shoppinglist/:userId', component: ShoppingList },
  { path: "", component: Home },
];
