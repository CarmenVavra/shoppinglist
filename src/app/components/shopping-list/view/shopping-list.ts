import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { ListItem } from "./../models/shopping-list-model";
import { ShoppingListService } from '../services/shopping-list-service';
import { Subject, takeUntil } from 'rxjs';
import { CheckboxList } from "../../core/checkbox-list/checkbox-list";
import { FormArray } from '@angular/forms';
import { CheckboxItem } from '../../core/checkbox-list/models/checkbox-list.model';
import { CoreService } from '../../core/services/core.service';
import { SNACKBAR_MESSAGES } from '../../core/models/core.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService as MyAuthService } from '../../auth/services/auth-service.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { MatAnchor, MatButton } from "@angular/material/button";

@Component({
  selector: 'app-shopping-list',
  imports: [CheckboxList, MatAnchor, MatButton],
  templateUrl: './shopping-list.html',
  styleUrl: './shopping-list.css',
})
export class ShoppingList {
  readonly shoppingList = signal<ListItem[]>([]);
  readonly userId = signal<number>(0);
  readonly unsubscribe$ = new Subject();

  protected auth: AuthService | null = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(AuthService) : null;
  protected readonly window = isPlatformBrowser(inject(PLATFORM_ID)) ? window : undefined;

  #shoppingListService = inject(ShoppingListService);
  #coreService = inject(CoreService);
  #activatedRoute = inject(ActivatedRoute);
  #myAuthService = inject(MyAuthService);

  ngOnInit(): void {
    this.userId.set(Number(this.#activatedRoute.snapshot.paramMap.get('userId')));
    if (this.userId() > 0) {
      this.loadShoppingList(this.userId());
    }
  }

  private loadShoppingList(userId: number) {
    this.#shoppingListService.getAllByUserId(userId).pipe(takeUntil(this.unsubscribe$)).subscribe((shoppingList) => {
      this.shoppingList.set(shoppingList);
    });
  }

  protected saveEntry(entryFormArray: FormArray) {
    // Create each item individually
    entryFormArray.value.forEach((item: ListItem) => {
      item.userId = this.userId();
      this.#shoppingListService.create(item).subscribe((entry) => {
        this.shoppingList().push(entry);
        this.loadShoppingList(item.userId!);
      });
    });
  }

  protected deleteItem(item: CheckboxItem) {
    this.#coreService.openConfirmationDialog().subscribe((confirmationResult) => {
      if (true == confirmationResult) {
        this.delete(item);
      }
    });
  }

  private delete(item: CheckboxItem) {
    this.#shoppingListService.delete(item.id!).pipe(takeUntil(this.unsubscribe$)).subscribe((response) => {
      this.loadShoppingList(item.userId!);
      this.#coreService.openSnackBar(SNACKBAR_MESSAGES.DELETE);
    });
  }

  protected checkItems(items: CheckboxItem[]) {
    items.forEach((item) => {
      this.checkItem(item);
    });
  }

  private checkItem(item: CheckboxItem) {
    this.#shoppingListService.check(item).subscribe((item) => {
      this.loadShoppingList(item.userId!);
    });
  }

  logout(): void {
    if (!this.auth) return;
    this.#myAuthService.removeUserFromLocalStorage();
    const returnTo = this.window?.location.origin ?? 'http://localhost:4200';
    this.auth.logout({ logoutParams: { returnTo } });
  }
}
