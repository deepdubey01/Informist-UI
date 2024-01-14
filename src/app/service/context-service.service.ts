// context-menu.service.ts

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
  private contextMenuTrigger = new Subject<MouseEvent>();

  contextMenuTrigger$ = this.contextMenuTrigger.asObservable();

  triggerContextMenu(event: MouseEvent) {
    this.contextMenuTrigger.next(event);
  }
}
