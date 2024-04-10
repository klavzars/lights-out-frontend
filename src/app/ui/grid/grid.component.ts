import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle, NgClass],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent {
  @Input() grid!: boolean[][];
  @Input() solution!: boolean[][] | null;
  @Input() showSolution!: boolean;
  @Input() isGameWon!: boolean;
  @Input() isNoSolution!: boolean | null;
  @Input() gridSizeError!: boolean;
  @Input() inputProblemError!: boolean;
  @Input() errorMessage!: string | null;
  @Input() isCreateProblemMode: boolean = false;
  @Input() isLoading: boolean = false;
  @Output() cellClicked = new EventEmitter<{ row: number; column: number }>();

  onCellClick(row: number, column: number): void {
    this.cellClicked.emit({ row, column });
  }

  calculateCellWidth(): string {
    return `calc(100% / ${this.grid[0].length})`;
  }
}
