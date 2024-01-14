import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent {
  @Input() positionX: number = 0;
  @Input() positionY: number = 0;
  @Input() display: 'block' | 'none' = 'none';

  @Output() menuItemClicked = new EventEmitter<string>();

  onMenuItemClick(action: string) {
    this.menuItemClicked.emit(action);
  }
}
