# Lights Out Game

This is a web app for the Lights Out Game, built using [Angular](https://angular.io/). This document goes over some of the design decisions and implementation details of the application.

The backend repository for this app can be accessed [here](https://github.com/klavzars/lights-out-game).

## Running the application

To run the application in dev mode, use:

```shell script
./mvnw ng serve
```

## Architecture

### Pages

From a user standpoint, the application consists of 3 pages:

- **All Problems** Page: Lists all problems retrieved from the REST API. Each problem can be selected and solved by clicking on it.
- **Solve Problem** Page: Displays the problem and allows the user to solve it. Also allows user to see the solution.
- **Create Problem** Page: Allows the user to create a new problem and get its solution.

### Services

I tried to keep the application modular and loosely coupled, which resulted in 3 Angular services:

- **FetchDataService**: Fetches and sends data from/to the REST API.
- **ProblemDataService**: Stores the fetched data in a format that is easy to use with individual components. Communicates with FetchDataService and provides data to the components.
- **GameService**: Handles the Lights Out Game logic for both solving and creating problems.

### Components

The key components are already mentioned in the Pages section (the corresponding components to the pages are **AllProblemsComponent, SolveProblemComponent, CreateProblem**). Additionally, the **GridComponent** is used to display the Lights Out grid, handle user interaction and display errors regarding the grid.

### Error Handling

The application handles user input errors as well as server errors by displaying error messages to the user. Not all errors are handled, but the most common ones should be handled, such as:

- Invalid grid size input when creating a new problem.
- Invalid problem ID when trying to access a non-existing problem by specifying its ID in the URL.
- Duplicate problem error when trying to create a problem with the same grid configuration as an existing one.
- Internal server errors or network errors when communicating with the REST API.

**Note**: The URL for accessing the API is currently hardcoded in the FetchDataService as `http://localhost:8080/`. This should be changed to a more flexible solution in a production environment.

### Comments

As with the Quarkus application, my Angular experience is also somewhat limited (although I have worked with Angular in the past). I tried to keep the structure modular and the UI clean and simple. Further work could be done on error handling and better user feedback, more elegant communication with the backend, and other enhancements.

Once again, thank you for the opportunity and looking forward to the feedback.

For any additional information, feel free to contact me at [klavzar.simon@gmail.com](mailto:klavzar.simon@gmail.com).
