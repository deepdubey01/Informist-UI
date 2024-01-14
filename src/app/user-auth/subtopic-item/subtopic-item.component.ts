import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-subtopic-item',
  template: `
    <li>{{ subtopic.subtopic_name }}
      <ul>
        <app-subtopic-item
          *ngFor="let childSubtopic of subtopic.subtopics"
          [subtopic]="childSubtopic"
        ></app-subtopic-item>
      </ul>
    </li>
  `,
})
export class SubtopicItemComponent {
  @Input() subtopic: any; // Replace 'any' with your subtopic type
}
