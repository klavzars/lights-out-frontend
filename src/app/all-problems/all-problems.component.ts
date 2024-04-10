import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProblemDataService } from '../data/problem-data.service';
import { ProblemGroup } from '../models/problem-group.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-problems',
  standalone: true,
  imports: [NgFor, NgIf, RouterModule],
  templateUrl: './all-problems.component.html',
  styleUrl: './all-problems.component.scss',
})
export class AllProblemsComponent implements OnInit, OnDestroy {
  problemGroups!: ProblemGroup[];
  problemGroupSubscription: Subscription | null = null;
  errorMessage: string | null = null;
  errorMessageSubscription: Subscription | null = null;
  isLoading = false;

  constructor(private problemDataService: ProblemDataService) {}

  ngOnInit(): void {
    // Display currently stored problems and fetch them from the server
    // in case changes have been made

    // Note: A more elegant solution would be to update the problemGroups
    // array based on the response status/data from the server when adding new problems
    this.problemGroups = this.problemDataService.getAllProblems();

    this.problemDataService.loadAllProblems();

    if (this.problemGroups.length === 0) {
      this.isLoading = true;
    }

    this.problemGroupSubscription =
      this.problemDataService.problemGroupsChanged.subscribe(
        (newProblemGroups: ProblemGroup[]) => {
          this.problemGroups = newProblemGroups;
          this.isLoading = false;
        }
      );

    this.errorMessageSubscription =
      this.problemDataService.errorMessage.subscribe((error: string) => {
        this.errorMessage = error;
        this.isLoading = false;
      });

    this.problemGroups = this.problemDataService.getAllProblems();
  }

  // Cleanups
  ngOnDestroy(): void {
    this.problemGroupSubscription?.unsubscribe();
    this.errorMessageSubscription?.unsubscribe();
  }
}
