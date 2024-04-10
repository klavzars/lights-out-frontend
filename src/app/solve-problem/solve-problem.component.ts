import { Component, OnDestroy, OnInit } from '@angular/core';
import { GridComponent } from '../ui/grid/grid.component';
import { GameService } from '../game/game.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProblemDataService } from '../data/problem-data.service';
import { Subscription } from 'rxjs';
import { Problem } from '../models/problem.model';
import { ButtonPrimaryComponent } from '../ui/button-primary/button-primary.component';

@Component({
  selector: 'app-solve-problem',
  standalone: true,
  templateUrl: './solve-problem.component.html',
  styleUrl: './solve-problem.component.scss',
  imports: [GridComponent, ButtonPrimaryComponent, RouterModule],
})
export class SolveProblemComponent implements OnInit, OnDestroy {
  id: string | null = null;
  solutionSubscription: Subscription | null = null;
  loadProblemSubscription: Subscription | null = null;
  errorMessage: string | null = null;
  errorMessageSubscription: Subscription | null = null;
  isLoading = false;

  constructor(
    public gameService: GameService,
    private problemDataService: ProblemDataService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
    if (this.id) {
      // Check if the problem is already loaded
      const problem = this.problemDataService.getProblemById(+this.id);

      if (problem) {
        this.gameService.createGridFromSpec(problem.grid);
      } else {
        // If problem is not loaded, this fetches it from the server
        this.problemDataService.loadProblemById(+this.id);
        this.isLoading = true;

        this.errorMessageSubscription =
          this.problemDataService.errorMessage.subscribe((error: string) => {
            this.errorMessage = error;
            this.isLoading = false;
          });

        this.loadProblemSubscription =
          this.problemDataService.loadedProblemChanged.subscribe(
            (problem: Problem) => {
              this.gameService.createGridFromSpec(problem.grid);
              this.isLoading = false;
            }
          );
      }
    }
  }

  handleCellClick(event: { row: number; column: number }): void {
    this.gameService.toggleCellAndNeighbors(event.row, event.column);
  }

  onShowSolution() {
    // Fetches solution
    this.problemDataService.loadSolutionByProblemId(+this.id!);

    this.solutionSubscription =
      this.problemDataService.solutionChanged.subscribe(
        (solution: boolean[][] | null) => {
          this.gameService.addAndShowSolutionSolveMode(solution);
        }
      );
  }

  resetProblem() {
    this.gameService.resetProblem();
  }

  // Cleanups
  ngOnDestroy(): void {
    this.solutionSubscription?.unsubscribe();
    this.loadProblemSubscription?.unsubscribe();
    this.errorMessageSubscription?.unsubscribe();
    this.gameService.resetGame();
  }
}
