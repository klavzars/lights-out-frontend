import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { Solution } from '../models/solution.model';
import { catchError, throwError } from 'rxjs';

// Should be moved to environment.ts
const PROBLEMS_URL = 'http://localhost:8080/problems';
const SOLUTIONS_URL = 'http://localhost:8080/solutions';

@Injectable({
  providedIn: 'root',
})
export class FetchDataService {
  constructor(private http: HttpClient) {}

  fetchProblems() {
    return this.http
      .get<Problem[]>(PROBLEMS_URL)
      .pipe(catchError(this.handleError));
  }

  fetchProblemById(problemId: number) {
    return this.http
      .get<Problem>(`${PROBLEMS_URL}/${problemId}`)
      .pipe(catchError(this.handleError));
  }

  fetchSolutionById(problemId: number) {
    return this.http
      .get<Solution>(`${SOLUTIONS_URL}/problem/${problemId}`)
      .pipe(catchError(this.handleError));
  }

  sendProblem(problem: boolean[][]) {
    return this.http
      .post<Solution>(PROBLEMS_URL, problem)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    // Keeping this here for debugging purposes

    // if (error.status === 0) {
    //   // A client-side or network error occurred
    //   console.error('An error occurred:', error.error);
    // } else {
    //   // The backend returned an unsuccessful response code.
    //   // This is here for debugging purposes
    //   console.error(
    //     `Backend returned code ${error.status}, body was: `,
    //     error.error.message
    //   );
    // }

    // Return an observable with a user-facing error message.
    return throwError(
      () =>
        new Error(
          error.error.message
            ? error.error.message
            : 'An error occurred; please try again later.'
        )
    );
  }
}
