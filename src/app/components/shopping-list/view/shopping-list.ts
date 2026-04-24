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

  /**
   * Initializes the component by loading the shopping list for the user ID obtained from the route parameters. 
   */
  ngOnInit(): void {
    this.userId.set(Number(this.#activatedRoute.snapshot.paramMap.get('userId')));
    if (this.userId() > 0) {
      this.loadShoppingList(this.userId());
    }
  }

  /**
   * Loads the shopping list for a given user ID.
   * @param userId - The ID of the user whose shopping list is to be loaded.
   */
  private loadShoppingList(userId: number) {
    this.#shoppingListService.getAllByUserId(userId).pipe(takeUntil(this.unsubscribe$)).subscribe((shoppingList) => {
      this.shoppingList.set(shoppingList);
    });
  }

  /**
   * Saves a new entry to the shopping list.
   * @param entryFormArray - The form array containing the new entry data.
   */
  protected saveEntry(entryFormArray: FormArray) {
    entryFormArray.value.forEach((item: ListItem) => {
      item.userId = this.userId();
      this.#shoppingListService.create(item).subscribe((entry) => {
        this.shoppingList().push(entry);
        this.loadShoppingList(item.userId!);
      });
    });
  }

  /**
   * Prompts the user for confirmation before deleting a shopping list item.
   * @param item - The item to be deleted.
   */
  protected deleteItem(item: CheckboxItem) {
    this.#coreService.openConfirmationDialog().subscribe((confirmationResult) => {
      if (true == confirmationResult) {
        this.delete(item);
      }
    });
  }

  /**
   * Deletes a shopping list item.
   * @param item - The item to be deleted.
   */
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

  /**
   * Checks a shopping list item.
   * @param item - The item to be checked.
   */
  private checkItem(item: CheckboxItem) {
    this.#shoppingListService.check(item).subscribe((item) => {
      this.loadShoppingList(item.userId!);
    });
  }

  /**
   * Logs the user out of the application.
   * If the AuthService is not available, the method returns early.
   * It removes the user from local storage and redirects to the application's origin after logout.
   */
  logout(): void {
    if (!this.auth) return;
    this.#myAuthService.removeUserFromLocalStorage();
    const returnTo = this.window?.location.origin ?? 'http://localhost:4200';
    this.auth.logout({ logoutParams: { returnTo } });
  }
}
