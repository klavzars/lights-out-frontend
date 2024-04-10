import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  initialGrid: boolean[][];
  grid: boolean[][];
  solution: boolean[][] | null;
  showSolution: boolean;
  isGameWon: boolean;
  isNoSolution: boolean | null;
  gridSizeError: boolean;
  inputProblemError: boolean;

  constructor() {
    this.initialGrid = this.initializeEmptyGrid(3); // Default grid size
    this.grid = this.initialGrid.map((row) => [...row]);
    this.showSolution = false;
    this.solution = null;
    this.isGameWon = false;
    this.isNoSolution = null;
    this.gridSizeError = false;
    this.inputProblemError = false;
  }

  resetGame(defaultInitialGridSize: number = 3): void {
    this.grid = this.initializeEmptyGrid(defaultInitialGridSize);
    this.solution = null;
    this.isGameWon = false;
    this.isNoSolution = null;
    this.showSolution = false;
    this.gridSizeError = false;
    this.inputProblemError = false;
  }

  initializeEmptyGrid(size: number): boolean[][] {
    return Array(size)
      .fill(null)
      .map(() => Array(size).fill(false));
  }

  createEmptyGrid(size: number): void {
    this.solution = null;
    this.showSolution = false;
    this.grid = this.initializeEmptyGrid(size);
    this.initialGrid = this.grid.map((row) => [...row]);
  }

  createGridFromSpec(spec: boolean[][]): void {
    this.grid = spec.map((row) => [...row]);
    this.initialGrid = this.grid.map((row) => [...row]);
  }

  changeGridSize(size: number): void {
    // Error handling for invalid grid sizes
    if (size < 3 || size > 8) {
      this.gridSizeError = true;
      return;
    } else {
      this.gridSizeError = false;
    }

    this.resetGame(size);
    this.initialGrid = this.grid.map((row) => [...row]);
  }

  // In 'solve problem' mode, the grid should be reset to the initial state
  addAndShowSolutionSolveMode(solution: boolean[][] | null): void {
    this.addSolution(solution);
    // grid should be reset to initial state
    this.grid = this.initialGrid.map((row) => [...row]);
  }

  // In 'create problem' mode, the grid should remain as is
  addAndShowSolutionCreateMode(solution: boolean[][] | null): void {
    this.addSolution(solution);
  }

  addSolution(solution: boolean[][] | null): void {
    this.solution = solution;
    this.showSolution = true;
    if (solution === null) {
      this.isNoSolution = true;
    }
  }

  toggleCellAndNeighbors(row: number, column: number): void {
    this.toggleCell(row, column);

    const neighbors = [
      { row: row - 1, column: column },
      { row: row + 1, column: column },
      { row: row, column: column - 1 },
      { row: row, column: column + 1 },
    ];

    neighbors.forEach((neighbor) => {
      if (
        neighbor.row >= 0 &&
        neighbor.row < this.grid.length &&
        neighbor.column >= 0 &&
        neighbor.column < this.grid[0].length
      ) {
        this.toggleCell(neighbor.row, neighbor.column);
      }
    });

    // Checks if the game is won
    if (this.isGridEmpty()) {
      this.isGameWon = true;
      this.showSolution = false;
    }
  }

  // Used for 'create problem' mode
  toggleCell(row: number, column: number): void {
    this.grid[row][column] = !this.grid[row][column];
  }

  resetProblem(): void {
    this.grid = this.initialGrid.map((row) => [...row]);
    this.isGameWon = false;
    this.isNoSolution = null;
    this.showSolution = false;
    this.inputProblemError = false;
  }

  raiseInputProblemError(): void {
    this.inputProblemError = true;
  }

  isGridEmpty(): boolean {
    for (let row = 0; row < this.grid.length; row++) {
      for (let column = 0; column < this.grid[row].length; column++) {
        if (this.grid[row][column]) {
          return false;
        }
      }
    }
    return true;
  }
}
