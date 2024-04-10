import { Injectable } from '@angular/core';
import { FetchDataService } from './fetch-data.service';
import { Problem } from '../models/problem.model';
import { ProblemGroup } from '../models/problem-group.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProblemDataService {
  problemGroupsChanged = new Subject<ProblemGroup[]>();
  solutionChanged = new Subject<boolean[][] | null>();
  solutionToNewProblem = new Subject<boolean[][] | null>();
  loadedProblemChanged = new Subject<Problem>();
  errorMessage = new Subject<string>();

  constructor(private fetchDataService: FetchDataService) {}

  problemGroups: ProblemGroup[] = [];
  solutionToNewProblemGrid: boolean[][] | null = null;

  problems: Problem[] = [];

  // ------------------------------------------------------------------
  // Methods for loading problems from backend (using FetchDataService)
  // ------------------------------------------------------------------

  loadAllProblems() {
    this.fetchDataService.fetchProblems().subscribe({
      next: (problems) => {
        this.problems = problems;
        this.problemGroups = this.groupProblemsByGridSize(problems);
        this.problemGroupsChanged.next(this.problemGroups.slice());
      },
      error: (error) => {
        this.errorMessage.next(error.message);
      },
    });
  }

  loadProblemById(id: number) {
    this.fetchDataService.fetchProblemById(id).subscribe({
      next: (problem) => {
        // Adds problem to problemGroups
        const group = this.problemGroups.find(
          (group) => group.size === problem.grid.length
        );
        if (group) {
          group.problems.push(problem);
        } else {
          this.problemGroups.push({
            size: problem.grid.length,
            problems: [problem],
          });
        }

        this.loadedProblemChanged.next({ ...problem });
      },
      error: (error) => {
        this.errorMessage.next(error.message);
      },
    });
  }

  loadSolutionByProblemId(id: number) {
    this.fetchDataService.fetchSolutionById(id).subscribe({
      next: (solution) => {
        // add solution to problem object
        const problem = this.getProblemById(id);
        if (problem !== null) {
          if (solution.grid === null) {
            problem.solution = null;
            this.solutionChanged.next(null);
          } else {
            problem.solution = solution.grid;
            this.solutionChanged.next([...solution.grid]);
          }
        }
      },
      error: (error) => {
        this.errorMessage.next(error.message);
      },
    });
  }

  // Currently I'm not adding the created problem to the list of problems
  // this should be done in the future
  sendProblemAndLoadSolution(problem: boolean[][]) {
    this.fetchDataService.sendProblem(problem).subscribe({
      next: (solution) => {
        if (solution.grid === null) {
          this.solutionToNewProblemGrid = null;
          this.solutionToNewProblem.next(null);
        } else {
          this.solutionToNewProblemGrid = solution.grid;
          this.solutionToNewProblem.next([...solution.grid]);
        }
      },
      error: (error) => {
        this.errorMessage.next(error.message);
      },
    });
  }

  // -------------------------------
  // Methods for use with components
  // -------------------------------

  getAllProblems() {
    return this.problemGroups;
  }

  getProblemById(id: number) {
    for (const group of this.problemGroups) {
      for (const problem of group.problems) {
        if (problem.id === id) {
          return problem;
        }
      }
    }
    return null;
  }

  // ---------------
  // Utility methods
  // ---------------

  groupProblemsByGridSize(problems: Problem[]): ProblemGroup[] {
    const groups: { [key: number]: Problem[] } = {};

    problems.forEach((problem) => {
      const size = problem.grid.length;

      if (size >= 3 && size <= 8) {
        if (!groups[size]) {
          groups[size] = [];
        }
        groups[size].push(problem);
      }

      // Sort problems by id (just a precaution, should already be sorted by backend)
      groups[size] = groups[size].sort((a, b) => a.id - b.id);
    });

    // TODO This is a bit unnecessary, might refactor later
    const problemGroups: ProblemGroup[] = Object.keys(groups).map((key) => ({
      size: parseInt(key),
      problems: groups[parseInt(key)],
    }));

    return problemGroups;
  }
}
