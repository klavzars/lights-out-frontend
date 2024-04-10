import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-primary',
  standalone: true,
  imports: [],
  templateUrl: './button-primary.component.html',
  styleUrl: './button-primary.component.scss',
})
export class ButtonPrimaryComponent {
  @Output() buttonClick = new EventEmitter<void>();
  @Input() text: string = '';
  @Input() isDisabled = false;

  onClick() {
    this.buttonClick.emit();
  }
}
