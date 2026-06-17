# Dunelect

Dunelect is a full-stack application with a Spring Boot backend and Angular frontend, designed to manage electricity usage in utility company. 

## Project Structure

```
Dunelect/
├── Backend/          # Spring Boot REST API
├── Frontend/         # Angular web application
└── README.md         # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Backend**: Java 11+, Maven 3.6+, MySQL 8.0+
- **Frontend**: Node.js 16+, npm 8+

## Getting Started

### Backend Setup

1. **Navigate to the Backend directory:**
   ```bash
   cd Backend
   ```

2. **Configure the database:**
   - Ensure MySQL is running on `localhost:3306`
   - Create a database named `dunelect`
   - Default credentials are set in [src/main/resources/application.properties](Backend/src/main/resources/application.properties)

3. **Set environment variables (optional):**
   ```bash
   export DUNELECT_JWT_SECRET=your-secret-key-min-32-chars
   export DUNELECT_JWT_EXPIRATION_MS=86400000
   export DUNELECT_ADMIN_USER=admin
   export DUNELECT_ADMIN_PASSWORD=your-password
   export DUNELECT_OPERATOR_USER=operator
   export DUNELECT_OPERATOR_PASSWORD=your-password
   ```

4. **Build and run:**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

   The API will be available at `http://localhost:8081`

### Frontend Setup

1. **Navigate to the Frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:4200`

## Configuration

### Backend Configuration

Key properties in [application.properties](Backend/src/main/resources/application.properties):

| Property | Default | Description |
|----------|---------|-------------|
| `server.port` | 8081 | Backend server port |
| `spring.datasource.url` | jdbc:mysql://localhost:3306/dunelect | Database URL |
| `dunelect.seed-mock-data` | true | Load sample data on startup |
| `dunelect.jwt.secret` | dunelect-local-jwt-secret-... | JWT secret key |
| `dunelect.jwt.expiration-ms` | 86400000 | JWT token expiration (24 hours) |

### Frontend Configuration

- **Angular config**: [angular.json](Frontend/angular.json)
- **TypeScript config**: [tsconfig.json](Frontend/tsconfig.json)
- **Code formatting**: [.prettierrc](Frontend/.prettierrc)

## Build & Deployment

### Backend Build
```bash
cd Backend
./mvnw clean package
```

Output WAR/JAR file will be in `target/` directory.

### Frontend Build
```bash
cd Frontend
npm run build
```

Output files will be in `dist/` directory.

## Technologies

### Backend
- **Framework**: Spring Boot
- **Database**: MySQL
- **Security**: JWT authentication
- **ORM**: JPA/Hibernate

### Frontend
- **Framework**: Angular
- **Language**: TypeScript
- **Build Tool**: Angular CLI

## Key Features

- User authentication with JWT tokens
- Role-based access control (Admin, Operator)
- Mock data seeding for development
- RESTful API architecture
- Responsive Angular UI

## Git Configuration

The project uses a [.gitignore](Backend/.gitignore) file to exclude:
- Build artifacts (`target/`, `dist/`)
- IDE configurations (`.vscode/`, `.idea/`)
- Application properties with sensitive data
- Dependency folders (`node_modules/`, `.mvn/`)

## Development Notes

- **Mock Data**: Enabled by default via `dunelect.seed-mock-data=true`
- **SQL Logging**: Enabled with `spring.jpa.show_sql=true` and `spring.jpa.format_sql=true`
- **Database Migration**: Automatic via Hibernate with `spring.jpa.hibernate.ddl-auto=update`

## Troubleshooting

### Backend Issues
- Ensure MySQL is running: `mysql -u root -p`
- Check Java version: `java -version`
- Clear Maven cache: `./mvnw clean`

### Frontend Issues
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules`: `rm -rf node_modules && npm install`

