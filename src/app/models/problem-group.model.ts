import { Problem } from './problem.model';

export interface ProblemGroup {
  size: number;
  problems: Problem[];
  solution?: any[][] | null;
}
