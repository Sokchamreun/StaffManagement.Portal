# Staff Management Portal

A modern employee management system built with Next.js and PrimeReact, providing full CRUD operations for employee data management.

## Features

- **Employee Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **Modern UI**: Built with PrimeReact components and PrimeFlex CSS utilities
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Data Validation**: Client-side form validation with user-friendly error messages
- **Search & Filter**: Global search functionality across employee data
- **Pagination**: Efficient data display with configurable page sizes

## Tech Stack

- **Frontend**: Next.js 15.2.1, React 18.2.0
- **UI Library**: PrimeReact 10.9.2
- **Styling**: PrimeFlex 3.3.1, PrimeIcons 6.0.1
- **Backend**: External API (localhost:5042)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- External API server running on `http://localhost:5042`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sokchamreun/StaffManagement.Portal.git
   cd StaffManagement.Portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Docker Support

The project includes Docker configuration for both development and production:

#### Development with Docker Compose
```bash
# Start both frontend and backend services
docker-compose up

# Build and start in detached mode
docker-compose up -d --build
```

#### Production Docker Build
```bash
# Build production image
docker build -f Dockerfile.prod -t staff-portal .

# Run production container
docker run -p 3000:3000 staff-portal
```

### CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that:

1. **Tests**: Runs on Node.js 18.x and 20.x
2. **Linting**: ESLint validation
3. **Build**: Verifies successful build
4. **Docker**: Builds and pushes to Docker Hub (on main branch)
5. **Deploy**: Placeholder for production deployment

#### Required Secrets
Set these in your GitHub repository settings:
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password/token

## Project Structure

```
├── components/
│   └── Layout.js          # Main layout with navigation
├── pages/
│   ├── _app.js           # App configuration and global styles
│   ├── index.js          # Home page
│   ├── employees.js      # Employee management page
│   └── api/              # Demo API routes (not used for real data)
├── services/
│   └── employeeService.js # API service layer
├── styles/
│   └── globals.css       # Global styles
└── public/               # Static assets
```

## API Integration

This application connects to an external backend API at `http://localhost:5042/api/employee`. The API should support:

- `GET /api/employee` - Fetch all employees
- `GET /api/employee/{id}` - Fetch employee by ID
- `POST /api/employee` - Create new employee
- `PUT /api/employee` - Update employee (expects full object with ID)
- `DELETE /api/employee/{id}` - Delete employee

### Employee Data Model

```json
{
  "id": 1,
  "staffId": "STF001",
  "fullName": "John Doe",
  "gender": 1,
  "dateOfBirth": "1990-05-15T00:00:00Z"
}
```

**Field Details:**
- `id`: Auto-generated unique identifier
- `staffId`: Auto-generated staff identifier (display-only in edit mode)
- `fullName`: Employee's full name (required)
- `gender`: 1 for Male, 2 for Female (integer, not string)
- `dateOfBirth`: ISO date string

## Development Guidelines

### Component Patterns

- All pages are wrapped in the `Layout` component via `_app.js`
- Use PrimeReact components exclusively for UI consistency
- Follow the service layer pattern for API calls
- Implement error handling with Toast notifications

### Form Validation

```javascript
// Use submitted state for validation timing
const [submitted, setSubmitted] = useState(false);

// Apply p-invalid class for validation styling
<InputText
  className={submitted && !employee.fullName ? 'p-invalid' : ''}
/>

// Show validation messages
{submitted && !employee.fullName && 
  <small className="p-error">Full Name is required.</small>
}
```

### Date Handling

```javascript
// Convert Date to ISO string for API
const employeeData = {
  ...employee,
  dateOfBirth: employee.dateOfBirth instanceof Date 
    ? employee.dateOfBirth.toISOString() 
    : employee.dateOfBirth
};

// Convert ISO string to Date for form
const employeeToEdit = {
  ...employee,
  dateOfBirth: new Date(employee.dateOfBirth)
};
```

## Styling

The project uses PrimeReact's saga-blue theme with PrimeFlex utilities:

- **Layout**: `grid`, `col-12`, `md:col-6`, etc.
- **Spacing**: `p-4`, `mb-3`, `mr-2`, etc.
- **Alignment**: `text-center`, `flex`, `align-items-center`, etc.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support or questions, please open an issue in the GitHub repository.
