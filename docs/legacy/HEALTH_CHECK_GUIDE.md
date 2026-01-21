# Book Library API - Routine Health Check Script

## Overview

This comprehensive health check script (`routine-health-check.sh`) performs automated testing of all Book Library API endpoints and functionality. It's designed to quickly verify system health and identify any issues.

## Features

- ✅ **Complete API Coverage** - Tests all major endpoints
- 🎨 **Colored Output** - Easy-to-read status indicators
- 📊 **Detailed Statistics** - Success rates and performance metrics
- 🔍 **Error Detection** - Identifies and categorizes issues
- 📈 **Database Metrics** - Shows current data counts and ratios
- 🛡️ **Error Handling** - Tests validation and error responses
- ⚡ **Performance Tracking** - Execution time monitoring

## Usage

### Basic Usage

```bash
# Simple health check
./routine-health-check.sh

# Verbose output with detailed responses
./routine-health-check.sh --verbose

# Pretty JSON formatting (requires jq or npx)
./routine-health-check.sh --json-pretty

# Combined options
./routine-health-check.sh --verbose --json-pretty
```

### Prerequisites

```bash
# Install jq for JSON formatting (optional)
sudo apt install jq        # Ubuntu/Debian
brew install jq            # macOS

# Or use npx (requires Node.js)
npm install -g npx
```

## What It Tests

### 1. Basic Health Check ✅

- Server connectivity
- Health endpoint response
- Basic service status

### 2. Core Endpoints ✅

- **Authors**: List, pagination, individual fetch
- **Books**: List, pagination, individual fetch
- **Users**: List, pagination, individual fetch
- **Borrow Records**: List, pagination

### 3. Advanced Features ✅

- **Search Functionality**: Text search across entities
- **Filtering**: Genre, availability, status filters
- **Pagination**: Multiple pages, sorting
- **Relationships**: Author-book, user-borrow links

### 4. Statistics & Analytics ✅

- Borrow statistics
- System metrics
- Data integrity checks

### 5. Error Handling ✅

- Invalid ObjectId validation
- Non-existent resource handling
- Malformed request responses
- HTTP status code verification

### 6. Database Summary ✅

- Entity counts verification
- Data relationships analysis
- Performance metrics

## Output Examples

### Successful Run

```bash
$ ./routine-health-check.sh

================================================================
🚀 STARTING COMPREHENSIVE HEALTH CHECK
================================================================

Timestamp: Tue Nov 26 10:30:00 UTC 2025
API Base URL: http://localhost:3001
Verbose mode: false
JSON formatting: false

✅ Server is reachable at http://localhost:3001

================================================================
1️⃣ BASIC HEALTH CHECK
================================================================

Testing Health endpoint...
✅ Health endpoint - HTTP 200

================================================================
2️⃣ CORE ENDPOINTS TESTING
================================================================

Testing Authors endpoint...
✅ Authors endpoint - HTTP 200
✅ Authors: 15 total (≥ 10 expected)

Testing Books endpoint...
✅ Books endpoint - HTTP 200
✅ Books: 33 total (≥ 20 expected)

Testing Users endpoint...
✅ Users endpoint - HTTP 200
✅ Users: 12 total (≥ 5 expected)

================================================================
📊 HEALTH CHECK SUMMARY
================================================================

Total checks performed: 25
Checks passed: 25
Errors: 0
Warnings: 0
Success rate: 100%

✅ OVERALL STATUS: HEALTHY ✨
All critical checks passed. API is functioning correctly.

ℹ️  Health check completed in 3s
```

### Error Detection

```bash
================================================================
📊 HEALTH CHECK SUMMARY
================================================================

Total checks performed: 25
Checks passed: 22
Errors: 2
Warnings: 1
Success rate: 88%

⚠️  OVERALL STATUS: MOSTLY HEALTHY ⚠️
Minor issues detected. Review errors above.

ℹ️  Recommendations:
   • Check server logs: tail -f server.log
   • Verify MongoDB connection
   • Ensure all required environment variables are set
```

## Exit Codes

- `0`: All checks passed (healthy)
- `1`: Minor issues detected (mostly healthy)
- `2`: Major issues detected (unhealthy)
- `130`: Script interrupted by user

## Integration

### Manual Testing

```bash
# Run before deployments
./routine-health-check.sh

# Debug with verbose output
./routine-health-check.sh --verbose --json-pretty
```

### Automated Monitoring

```bash
# Add to cron for regular checks
0 */6 * * * /path/to/routine-health-check.sh >> /var/log/api-health.log 2>&1

# CI/CD Pipeline integration
script:
  - ./routine-health-check.sh
```

### Development Workflow

```bash
# After making changes
npm start &
sleep 3
./routine-health-check.sh
```

## Troubleshooting

### Common Issues

1. **Server Not Running**

   ```bash
   # Start the server
   npm start
   # Then run health check
   ./routine-health-check.sh
   ```

2. **Connection Refused**

   - Check if port 3001 is available
   - Verify MongoDB connection
   - Check environment variables

3. **JSON Formatting Not Working**

   ```bash
   # Install jq
   sudo apt install jq
   # Or use without formatting
   ./routine-health-check.sh --verbose
   ```

4. **Permission Denied**

   ```bash
   chmod +x routine-health-check.sh
   ```

## Customization

The script can be easily customized by modifying these variables:

```bash
# API configuration
API_BASE_URL="http://localhost:3001"

# Expected minimum counts
check_count "$authors_count" "Authors" 10    # Expect ≥10 authors
check_count "$books_count" "Books" 20        # Expect ≥20 books
check_count "$users_count" "Users" 5         # Expect ≥5 users
```

---

**This health check script provides comprehensive monitoring for the Book Library API, ensuring all functionality works correctly and helping identify issues quickly.**
