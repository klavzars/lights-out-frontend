import { Component, OnInit } from '@angular/core';
import { GridComponent } from '../ui/grid/grid.component';
import { GameService } from '../game/game.service';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProblemDataService } from '../data/problem-data.service';
import { Subscription } from 'rxjs';
import { ButtonPrimaryComponent } from '../ui/button-primary/button-primary.component';

@Component({
  selector: 'app-create-problem',
  standalone: true,
  imports: [GridComponent, ButtonPrimaryComponent, FormsModule, RouterModule],
  templateUrl: './create-problem.component.html',
  styleUrl: './create-problem.component.scss',
})
export class CreateProblemComponent implements OnInit {
  numberValue: number = 3; // Initially loaded grid size
  newSolutionSubscription: Subscription | null = null;
  errorMessage: string | null = null;
  errorMessageSubscription: Subscription | null = null;
  isLoading = false;

  constructor(
    public gameService: GameService,
    private problemDataService: ProblemDataService
  ) {}

  ngOnInit() {
    this.gameService.createEmptyGrid(this.numberValue);
  }

  handleCellClick(event: { row: number; column: number }): void {
    this.gameService.toggleCell(event.row, event.column);
  }

  onGridSizeChange(): void {
    // Error handling is done in the gameService.changeGridSize method
    this.gameService.changeGridSize(this.numberValue);
    this.errorMessage = null;
  }

  sendProblem() {
    // Handles empty grid error
    if (this.gameService.isGridEmpty()) {
      this.gameService.raiseInputProblemError();
      return;
    }

    // Sends problem to the server
    this.problemDataService.sendProblemAndLoadSolution(this.gameService.grid);
    this.isLoading = true;

    this.errorMessageSubscription =
      this.problemDataService.errorMessage.subscribe((error: string) => {
        this.errorMessage = error;
        this.isLoading = false;
      });

    this.newSolutionSubscription =
      this.problemDataService.solutionToNewProblem.subscribe(
        (solution: boolean[][] | null) => {
          this.gameService.addAndShowSolutionCreateMode(solution);
          this.isLoading = false;
        }
      );
  }

  resetProblem() {
    this.gameService.resetProblem();
    this.errorMessage = null;
  }

  // Cleanups
  ngOnDestroy(): void {
    this.newSolutionSubscription?.unsubscribe();
    this.errorMessageSubscription?.unsubscribe();
    this.gameService.resetGame();
  }
}
