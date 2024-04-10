import { Routes } from '@angular/router';
import { AllProblemsComponent } from './all-problems/all-problems.component';
import { SolveProblemComponent } from './solve-problem/solve-problem.component';
import { CreateProblemComponent } from './create-problem/create-problem.component';

export const routes: Routes = [
  { path: '', component: AllProblemsComponent },
  { path: 'solve/:id', component: SolveProblemComponent },
  { path: 'create-problem', component: CreateProblemComponent },
  { path: '**', redirectTo: '' },
];
