# Lab Manager

This is an app to book free lab slots at UnivAQ.

## Built using

- Framework: [SvelteKit](https://kit.svelte.dev/)
- UI: [FlyonUI](https://www.flyonui.com/)
- ORM: [Drizzle](https://drizzle-orm.com/)
- Database: [PostgreSQL](https://www.postgresql.org/)

## How to run

### Prerequisites

- Docker and Docker Compose installed on your machine
- Git for cloning the repository

<details>
<summary>Production Environment 🚀</summary>

### Production Environment

This setup runs an optimized production build.

1. Clone the repository

   ```bash
   git clone https://github.com/vinaysanga/lab-man.git
   cd lab-man
   ```

2. Start production environment

   ```bash
   docker compose up --build
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000)

</details>

<details>
<summary>Development Environment 🔧</summary>

### Development Environment

This setup includes hot reloading and others. For your dev needs.

#### Using Docker (Recommended)

1. Clone the repository

   ```bash
   git clone https://github.com/vinaysanga/lab-man.git
   cd lab-man
   ```
2. Install dev dependencies (so that your IDE doesn't complain)

   ```bash
   npm install
   ```
   OR
   ```bash
   pnpm install
   ```

3. Start development environment with watch mode

   ```bash
   docker compose -f compose.dev.yml up --build --watch
   ```

4. Access the application at [http://localhost:5173](http://localhost:5173)

#### Features

- Hot reload enabled for both frontend and backend
- Source files are synced with containers
- Show logs for containers in the terminal
- Database runs on port 5432 (accessible within Docker network only)

#### Database Access

For development purposes, you can connect to the database using your preferred database tool with these credentials (defined in [`.env.example`](./.env.example)):

- Host: `localhost`
- Port: `5432`
- Database: `lab-man`
- Username: `postgres`
- Password: `14bM4n25`

Example connection string: `postgres://postgres:14bM4n25@localhost:5432/lab-man`

The development setup uses [`compose.dev.yml`](./compose.dev.yml) which includes:

#### Local Development (Without Docker)

```
WIP - Coming soon
```

### Development Setup

1. Clone the repository
   ```bash
   git clone https://github.com/vinaysanga/lab-man.git
   cd lab-man
   ```

2. Install dev dependencies (so that your IDE doesn't complain)
   ```bash
   npm install
   ```
   OR
   ```bash
   pnpm install
   ```

3. Start development environment with watch mode
   ```bash
   docker compose -f compose.dev.yml up --build --watch
   ```

4. Access the application at [http://localhost:5173](http://localhost:5173)

### Debugging

The project is configured for VS Code debugging. To debug the application:

1. Start the application in debug mode (it's already configured in [compose.dev.yml](./compose.dev.yml) and a VS Code launch configuration is already defined at [launch.json](./.vscode/launch.json)
2. In VS Code:
   - Set your breakpoints
   - Go to Run and Debug (Ctrl/Cmd + Shift + D)
   - Select "Docker: Attach to Node" from the dropdown.
3. The debugger should automatically attach to the running container and will stop at your breakpoints.

</details>

### Bulk User Upload

The application supports bulk user upload via Excel files. A template file is provided at [`extras/demo-users.xlsx`](./extras/demo-users.xlsx) which shows the required format:

- Each row represents a user
- Required columns:
  - Matriculation Number
  - Name
  - Surname
  - Academic Year (format: YYYY-YYYY)
  - Email

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
