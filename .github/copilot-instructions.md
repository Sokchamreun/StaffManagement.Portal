# Staff Management Portal - AI Coding Instructions

## Project Overview
This is a Next.js frontend application for employee management with full CRUD operations. It uses PrimeReact UI components and connects to a backend API at `http://localhost:5042/api/employee`.

## Architecture & Key Patterns

### Component Structure
- **Layout-first approach**: All pages are wrapped in `components/Layout.js` via `_app.js`
- **Service layer**: API calls centralized in `services/employeeService.js` (not Next.js API routes)
- **PrimeReact conventions**: Uses PrimeReact components exclusively with their specific patterns

### Critical Dependencies
```json
"primereact": "^10.9.2",     // UI components
"primeflex": "^3.3.1",      // CSS utilities
"primeicons": "^6.0.1"      // Icons
```

### Data Flow Pattern
1. **Frontend-only**: `/pages/api/` contains only demo routes - real API is external
2. **Service pattern**: All API calls go through `employeeService.js` 
3. **State management**: React hooks only (no Redux/Context)
4. **Error handling**: Toast notifications for all operations

## Development Workflows

### Build & Run Commands
```bash
npm run dev     # Development server (port 3000)
npm run build   # Production build
npm run start   # Production server
npm run lint    # ESLint check
```

### Environment Setup
- **Node.js**: Required for Next.js development
- **Backend API**: Must run external API on `localhost:5042` for full functionality
- **Git**: `.gitignore` configured for Next.js with PrimeReact-specific exclusions
- **Docker**: Multi-stage builds available (`Dockerfile`, `Dockerfile.prod`)
- **CI/CD**: GitHub Actions pipeline for testing, building, and deployment

### Key File Relationships
- `_app.js` → `Layout.js` → All pages get consistent navigation
- `employees.js` → `employeeService.js` → External API at localhost:5042
- All styles loaded globally in `_app.js` (PrimeReact theme + custom CSS)

## Project-Specific Conventions

### PrimeReact Integration
- **Theme setup**: Uses saga-blue theme loaded in `_app.js`
- **Form validation**: Uses `submitted` state + `p-invalid` CSS classes
- **Toast pattern**: All feedback via `toast.current.show()`
- **Dialog pattern**: CRUD operations use PrimeReact Dialog component

### Employee Data Structure
```javascript
{
  id: number,           // Auto-generated, immutable
  staffId: string,      // Auto-generated, display-only in edit mode  
  fullName: string,     // Required
  gender: 1|2,          // 1=Male, 2=Female (not string)
  dateOfBirth: Date|ISO string
}
```

### API Service Patterns
- **Error handling**: All service methods throw on HTTP errors
- **Date handling**: Convert Date objects to ISO strings before API calls
- **Update method**: Uses PUT with full object (including ID)
- **No authentication**: Direct API calls without auth headers

## Critical Integration Points

### External API Dependency
- **Backend URL**: `http://localhost:5042/api/employee` (hardcoded)
- **Expected to be running**: Frontend assumes backend is available
- **No fallback/mock data**: Application fails gracefully with toast errors

### Navigation Structure
- Simple two-page app: Home (`/`) and Employees (`/employees`)
- Navigation via PrimeReact Menubar in Layout component
- Uses Next.js router for programmatic navigation

## Common Development Tasks

### Docker Operations
- **Development**: `docker-compose up` for full stack with API
- **Production build**: `docker build -f Dockerfile.prod -t staff-portal .`
- **Local testing**: `docker run -p 3000:3000 staff-portal`

### Adding New Pages
1. Create in `/pages/` directory
2. Navigation auto-included via Layout wrapper
3. Add menu item to `Layout.js` items array if needed

### Working with Forms
- Follow PrimeReact Dialog + validation pattern from `employees.js`
- Use `submitted` state for validation timing
- Handle dates carefully (Date object ↔ ISO string conversion)

### Styling Approach
- PrimeFlex for layout (`grid`, `col-12`, `p-4`, etc.)
- PrimeReact component classes for styling
- Minimal custom CSS in `globals.css`

## Codebase Analysis Guidelines

### Key Files to Analyze for Understanding
- `README.md` - Project overview, setup instructions, and development guidelines
- `_app.js` - Global app configuration and theme setup
- `components/Layout.js` - Navigation structure and app branding
- `pages/employees.js` - Complete CRUD implementation example
- `services/employeeService.js` - API integration patterns
- `package.json` - Dependencies and available scripts

### Analysis Patterns
- **Component Dependencies**: Trace PrimeReact component imports to understand UI patterns
- **Data Flow**: Follow state management from UI components → service layer → external API
- **Error Handling**: Examine try/catch blocks and toast notification usage
- **Form Patterns**: Study validation logic using `submitted` state and `p-invalid` classes

### Testing the Application
1. Ensure backend API is running on `localhost:5042`
2. Run `npm run dev` to start development server
3. Test CRUD operations on `/employees` page
4. Check browser console for API connection issues
