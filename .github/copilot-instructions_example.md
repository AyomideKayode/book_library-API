<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Book Library API - Copilot Instructions

This is a RESTful Book Library API built with Node.js and Express.js following industry best practices.

## Project Context

- **Language**: JavaScript (Node.js)
- **Framework**: Express.js
- **Architecture**: Layered architecture (Routes → Controllers → Services → Models)
- **Data Storage**: In-memory storage (Maps)
- **Documentation**: OpenAPI/Swagger 3.0
- **Validation**: express-validator
- **Error Handling**: Centralized error handling with consistent response format

## Code Standards

- Follow REST principles strictly
- Use consistent HTTP status codes
- Implement comprehensive input validation
- Provide meaningful error messages
- Use UUID for all entity IDs
- Follow consistent naming conventions (camelCase for variables, PascalCase for classes)

## API Design Patterns

- All responses should follow the format: `{ success: boolean, data: any, message: string }`
- Error responses should include: `{ success: false, error: string, code: string, details?: any }`
- Use proper HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)
- Implement pagination for list endpoints
- Support search and filtering
- Include comprehensive Swagger documentation

## Business Rules

- Books must have unique ISBNs
- Authors must have unique emails
- Users must have unique emails
- Books can only be borrowed if available
- Users cannot borrow the same book multiple times simultaneously
- Default borrow period is 14 days
- Overdue books are automatically marked when accessed

## File Organization

- Controllers handle HTTP requests/responses only
- Services contain business logic
- Models define data structures and validation
- Routes define endpoints with validation middleware
- Middleware handles cross-cutting concerns

When making changes, ensure all related files are updated consistently and follow the established patterns.
