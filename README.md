# SaintsBnB API

The SaintsBnB API will focus on helping saints to find Airbnbs located close to the temple. This API will target traveling saints who will need a place to stay when visiting temples around the world. Saints will also be able to create postings for their Airbnbs so others can rent them out and be able to stay closer to temples. Allowing users to stay spiritually and physically closer to temples.  

### Render URL
https://saintsbnb.onrender.com


## How to get started

1. Clone the repo to your local machine: `git clone: https://github.com/AleEGs54/saintsbnb.git` .
2. Install dependencies: `npm install` .
3. Set environment variables such as `PORT`.
4. Before creating a branch, make sure your local main is up to date: `git checkout main`
`git pull origin main`
5. Create a new branch with a descriptive name: `your-feature-name`
6. Work on your feature only in that branch.
Do not commit directly to main to avoid conflicts.
7. When done, commit your changes with a clear message: 
`git add .`
`git commit -m "Add authentication flow"`.
8. Push your branch to Github: `git push origin feature/your-feature-name`.
9. Open a pull request (PR) on GitHub to main.
Make sure another team member reviews and approves before merging.

### Common Workflow Commands

- `npm run start` to run node with nodemon
- `npm run swagger` to generate a swagger-output.json
- `npm run lint` to look for warnings across the code.
- `npm run fix` to fix most warnings.

### API Documentation

You can view the API documentation when running `npm run start` at: http://localhost:3000/api-docs

This is powered by Swagger UI and shows available routes, parameters, and responses.

## Extra info and tips for consistency

### Eslint and Prettier
These linters are used to keep code consistency all along the project. Makes code more human readable and will help preventing a huge amount of errors. For a quick fix use `Shift` + `option` + `F` for Mac users and `Shift` + `Alt` + `F`.

For more information:

[EsLint](https://eslint.org/)
[Prettier](https://prettier.io/)

### Environment Variables

Make sure to create a `.env` file in the root directory. The following variables will be needed along the way:

| Variable         | Description                         |
|------------------|-------------------------------------|
| PORT             | Port to run the server              |
| NODE_ENV         | Defines the node environment        |
| MONGODB_URI      | MongoDB connection string           |
| SESSION_SECRET   | Secret key for session encryption   |
| GITHUB_CLIENT_ID | GitHub OAuth client ID. But can be another service              |
| GITHUB_SECRET    | GitHub OAuth secret. But can be another service.                 |

Kindly share the variables so we all can use them.

### Pull Request Checklist

- [ ] The branch is based on `main` and up to date
- [ ] The feature is complete and tested
- [ ] Code follows the project's conventions
- [ ] Related `.env` changes are documented
- [ ] No `console.log` or unused code left behind
- [ ] PR description clearly explains the purpose

---

### Contributors

- Alejandro Esteves
- Gabriel Scuzziato
- Grace Ayuso
- Luis Lizano
- Trystan Jones
