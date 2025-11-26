#!/bin/bash

# ============================================================================
# Book Library API - Comprehensive Health Check Script
# ============================================================================
# This script performs a complete health check on the Book Library API
# Based on the routine health check commands documented in README.md
# 
# Usage: ./routine-health-check.sh [--verbose] [--json-pretty]
# Options:
#   --verbose      Show detailed responses
#   --json-pretty  Format JSON responses (requires jq or npx json)
# ============================================================================

# Note: Removed 'set -e' for better error handling and debugging
# We handle errors explicitly in each function

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="http://localhost:3001"
VERBOSE=false
JSON_PRETTY=false
NON_INTERACTIVE=false
ERRORS=0
WARNINGS=0
CHECKS_PASSED=0
TOTAL_CHECKS=0

# Parse command line arguments
for arg in "$@"; do
    case $arg in
        --verbose)
            VERBOSE=true
            ;;
        --json-pretty)
            JSON_PRETTY=true
            ;;
        --non-interactive)
            NON_INTERACTIVE=true
            ;;
        --help)
            echo "Usage: $0 [--verbose] [--json-pretty] [--non-interactive]"
            echo "Options:"
            echo "  --verbose          Show detailed responses"
            echo "  --json-pretty      Format JSON responses (requires jq or npx json)"
            echo "  --non-interactive  Don't prompt to start server, just exit if not running"
            exit 0
            ;;
    esac
done

# Helper functions
print_header() {
    echo -e "\n${BLUE}================================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================================${NC}\n"
}

print_step() {
    echo -e "${CYAN}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((CHECKS_PASSED++))
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

print_info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# Function to make API calls and handle responses
make_api_call() {
    local endpoint="$1"
    local description="$2"
    local expected_success="${3:-true}"
    
    ((TOTAL_CHECKS++))
    
    print_step "Testing $description..."
    
    # Make the API call
    local response
    local http_code
    
    response=$(curl -s -w "%{http_code}" "$API_BASE_URL$endpoint" || echo "000CURL_ERROR")
    http_code="${response: -3}"
    response="${response%???}"
    
    # Handle curl errors
    if [[ "$response" == *"CURL_ERROR" ]]; then
        print_error "$description - Connection failed"
        return 1
    fi
    
    # Check HTTP status code
    if [[ "$http_code" -ge 200 && "$http_code" -lt 300 ]]; then
        # Parse JSON to check success field
        local success_field
        success_field=$(echo "$response" | grep -o '"success":[^,]*' | cut -d: -f2 | tr -d ' "' || echo "unknown")
        
        if [[ "$success_field" == "$expected_success" ]]; then
            print_success "$description - HTTP $http_code"
        else
            print_error "$description - Unexpected success field: $success_field"
            return 1
        fi
    elif [[ "$http_code" -ge 400 && "$http_code" -lt 500 && "$expected_success" == "false" ]]; then
        print_success "$description - Expected error HTTP $http_code"
    else
        print_error "$description - HTTP $http_code"
        return 1
    fi
    
    # Show response if verbose mode
    if [[ "$VERBOSE" == true ]]; then
        echo "Response:"
        if [[ "$JSON_PRETTY" == true ]]; then
            if command -v jq >/dev/null 2>&1; then
                echo "$response" | jq . || echo "$response"
            elif command -v npx >/dev/null 2>&1; then
                echo "$response" | npx json || echo "$response"
            else
                echo "$response"
            fi
        else
            echo "$response"
        fi
        echo ""
    fi
    
    return 0
}

# Function to extract count from pagination response
extract_count() {
    local response="$1"
    echo "$response" | grep -o '"totalItems":[0-9]*' | cut -d: -f2 || echo "0"
}

# Function to check if a number is reasonable
check_count() {
    local count="$1"
    local entity="$2"
    local min_expected="$3"
    
    if [[ "$count" -ge "$min_expected" ]]; then
        print_success "$entity: $count total (≥ $min_expected expected)"
    else
        print_warning "$entity: $count total (< $min_expected expected)"
    fi
}

# Main health check function
run_health_check() {
    print_header "🏥 BOOK LIBRARY API - COMPREHENSIVE HEALTH CHECK"
    
    # Step 1: Basic Health Check
    print_header "1️⃣ BASIC HEALTH CHECK"
    make_api_call "/health" "Health endpoint"
    
    # Step 2: Core Endpoints
    print_header "2️⃣ CORE ENDPOINTS TESTING"
    
    # Authors endpoint
    local authors_response
    authors_response=$(curl -s "$API_BASE_URL/api/authors?limit=1" || echo '{"pagination":{"totalItems":0}}')
    make_api_call "/api/authors?limit=5" "Authors endpoint"
    local authors_count
    authors_count=$(extract_count "$authors_response")
    check_count "$authors_count" "Authors" 10
    
    # Books endpoint
    local books_response
    books_response=$(curl -s "$API_BASE_URL/api/books?limit=1" || echo '{"pagination":{"totalItems":0}}')
    make_api_call "/api/books?limit=5" "Books endpoint"
    local books_count
    books_count=$(extract_count "$books_response")
    check_count "$books_count" "Books" 20
    
    # Users endpoint
    local users_response
    users_response=$(curl -s "$API_BASE_URL/api/users?limit=1" || echo '{"pagination":{"totalItems":0}}')
    make_api_call "/api/users?limit=3" "Users endpoint"
    local users_count
    users_count=$(extract_count "$users_response")
    check_count "$users_count" "Users" 5
    
    # Borrow records endpoint
    local borrows_response
    borrows_response=$(curl -s "$API_BASE_URL/api/borrow-records?limit=1" || echo '{"pagination":{"totalItems":0}}')
    make_api_call "/api/borrow-records?limit=2" "Borrow records endpoint"
    local borrows_count
    borrows_count=$(extract_count "$borrows_response")
    check_count "$borrows_count" "Borrow Records" 0
    
    # Step 3: Advanced Features
    print_header "3️⃣ ADVANCED FEATURES TESTING"
    
    # Search functionality
    make_api_call "/api/books?search=chimamanda&limit=3" "Search functionality (African authors)"
    make_api_call "/api/books?search=dream&limit=2" "Search functionality (specific book)"
    make_api_call "/api/authors?search=achebe" "Author search functionality"
    
    # Filtering
    make_api_call "/api/books?genre=Literary%20Fiction&limit=5" "Genre filtering"
    make_api_call "/api/books?available=true&limit=3" "Availability filtering"
    
    # Pagination
    make_api_call "/api/books?page=2&limit=5" "Pagination (page 2)"
    make_api_call "/api/authors?page=1&limit=10&sort=name" "Sorting and pagination"
    
    # Step 4: Statistics and Analytics
    print_header "4️⃣ STATISTICS & ANALYTICS"
    
    make_api_call "/api/borrow-stats" "Borrow statistics"
    make_api_call "/api/overdue-books" "Overdue books check" || print_info "Overdue books endpoint may not be available"
    
    # Step 5: Error Handling
    print_header "5️⃣ ERROR HANDLING TESTING"
    
    make_api_call "/api/books/invalid-id" "Invalid ObjectId validation" "false"
    make_api_call "/api/authors/nonexistent123456789012345678901234" "Non-existent resource (valid ObjectId)" "false"
    make_api_call "/api/nonexistent-endpoint" "Non-existent endpoint" "false"
    
    # Step 6: Individual Resource Testing
    print_header "6️⃣ INDIVIDUAL RESOURCE TESTING"
    
    # Get first author and test individual fetch
    local first_author_id
    first_author_id=$(curl -s "$API_BASE_URL/api/authors?limit=1" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4 || echo "")
    if [[ -n "$first_author_id" ]]; then
        make_api_call "/api/authors/$first_author_id" "Individual author fetch"
    else
        print_warning "Could not extract author ID for individual resource test"
    fi
    
    # Get first book and test individual fetch
    local first_book_id
    first_book_id=$(curl -s "$API_BASE_URL/api/books?limit=1" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4 || echo "")
    if [[ -n "$first_book_id" ]]; then
        make_api_call "/api/books/$first_book_id" "Individual book fetch"
    else
        print_warning "Could not extract book ID for individual resource test"
    fi
    
    # Step 7: Database Summary
    print_header "7️⃣ DATABASE SUMMARY"
    
    print_info "Current database state:"
    echo "   📚 Authors: $authors_count total"
    echo "   📖 Books: $books_count total"
    echo "   👥 Users: $users_count total"
    echo "   📋 Borrow Records: $borrows_count total"
    
    # Calculate some basic metrics
    if [[ "$authors_count" -gt 0 && "$books_count" -gt 0 ]]; then
        local books_per_author
        books_per_author=$((books_count / authors_count))
        print_info "Average books per author: ~$books_per_author"
    fi
    
    if [[ "$users_count" -gt 0 && "$borrows_count" -gt 0 ]]; then
        local borrows_per_user
        borrows_per_user=$((borrows_count / users_count))
        print_info "Average borrow records per user: ~$borrows_per_user"
    fi
}

# Function to show final summary
show_summary() {
    print_header "📊 HEALTH CHECK SUMMARY"
    
    echo -e "Total checks performed: ${BLUE}$TOTAL_CHECKS${NC}"
    echo -e "Checks passed: ${GREEN}$CHECKS_PASSED${NC}"
    echo -e "Errors: ${RED}$ERRORS${NC}"
    echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
    
    local pass_rate
    if [[ "$TOTAL_CHECKS" -gt 0 ]]; then
        pass_rate=$((CHECKS_PASSED * 100 / TOTAL_CHECKS))
        echo -e "Success rate: ${GREEN}$pass_rate%${NC}"
    fi
    
    echo ""
    
    if [[ "$ERRORS" -eq 0 ]]; then
        print_success "OVERALL STATUS: HEALTHY ✨"
        echo -e "${GREEN}All critical checks passed. API is functioning correctly.${NC}"
    elif [[ "$ERRORS" -le 2 ]]; then
        print_warning "OVERALL STATUS: MOSTLY HEALTHY ⚠️"
        echo -e "${YELLOW}Minor issues detected. Review errors above.${NC}"
    else
        print_error "OVERALL STATUS: UNHEALTHY ❌"
        echo -e "${RED}Multiple issues detected. Immediate attention required.${NC}"
    fi
    
    echo ""
    
    # Recommendations
    if [[ "$ERRORS" -gt 0 ]]; then
        print_info "Recommendations:"
        echo "   • Check server logs: tail -f server.log"
        echo "   • Verify MongoDB connection"
        echo "   • Ensure all required environment variables are set"
        echo "   • Check if server is running: curl $API_BASE_URL/health"
    fi
    
    if [[ "$WARNINGS" -gt 0 ]]; then
        print_info "Warnings noted:"
        echo "   • Some data counts may be lower than expected"
        echo "   • Consider running: npm run seed (if needed)"
        echo "   • Optional endpoints may not be implemented"
    fi
}

# Function to check server status and provide guidance
check_server_status() {
    print_info "Checking server status..."
    
    # Check if process is running on port 3001
    local port_check
    port_check=$(lsof -i :3001 2>/dev/null | grep LISTEN || echo "")
    
    if [[ -n "$port_check" ]]; then
        print_warning "Port 3001 is in use but API not responding properly:"
        echo "$port_check"
        print_info "The server might be starting up or experiencing issues."
    else
        print_info "Port 3001 is available - no server process detected."
    fi
    
    # Check if there are any Node.js processes that might be our server
    local node_processes
    node_processes=$(ps aux | grep -E "(npm start|node.*server)" | grep -v grep || echo "")
    
    if [[ -n "$node_processes" ]]; then
        print_info "Found potential server processes:"
        echo "$node_processes"
    fi
    
    # Check if server.log exists and show recent logs
    if [[ -f "server.log" ]]; then
        print_info "Recent server logs (last 10 lines):"
        tail -n 10 server.log | sed 's/^/   /'
    fi
}

# Function to check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check if curl is available
    if ! command -v curl >/dev/null 2>&1; then
        print_error "curl is required but not installed"
        exit 1
    fi
    
    # Check if JSON formatter is available (optional)
    if [[ "$JSON_PRETTY" == true ]]; then
        if command -v jq >/dev/null 2>&1; then
            print_success "jq available for JSON formatting"
        elif command -v npx >/dev/null 2>&1; then
            print_success "npx available for JSON formatting"
        else
            print_warning "JSON formatting requested but neither jq nor npx available"
            JSON_PRETTY=false
        fi
    fi
    
    # Check if server is reachable
    if curl -s "$API_BASE_URL/health" >/dev/null 2>&1; then
        print_success "Server is reachable at $API_BASE_URL"
    else
        print_error "Server is not reachable at $API_BASE_URL"
        print_info "The server needs to be started before running health checks."
        echo ""
        
        # Get more detailed server status
        check_server_status
        echo ""
        
        print_info "Options to start the server:"
        echo "   1. npm start                    # Start in production mode"
        echo "   2. npm run dev                  # Start in development mode"  
        echo "   3. nohup npm start > server.log 2>&1 &  # Start in background"
        echo ""
        print_info "After starting the server, run this script again:"
        echo "   ./routine-health-check.sh"
        echo ""
        
        # Ask if user wants to try starting the server (only in interactive mode)
        if [[ "$NON_INTERACTIVE" == true ]]; then
            print_info "Non-interactive mode: Exiting without prompting to start server."
            exit 1
        fi
        
        read -p "Would you like to start the server now? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Starting server in background..."
            nohup npm start > server.log 2>&1 &
            local server_pid=$!
            print_info "Server started with PID: $server_pid"
            print_info "Waiting 5 seconds for server to initialize..."
            sleep 5
            
            # Check again if server is now reachable
            if curl -s "$API_BASE_URL/health" >/dev/null 2>&1; then
                print_success "Server is now reachable! Continuing with health check..."
                echo ""
            else
                print_error "Server still not reachable after startup attempt"
                print_info "Check server logs: tail -f server.log"
                print_info "You can also try:"
                echo "   • Check if port 3001 is already in use: lsof -i :3001"
                echo "   • Check environment variables: cat .env"
                echo "   • Try manual start: npm start"
                exit 1
            fi
        else
            print_info "Health check cancelled. Start the server manually and try again."
            exit 1
        fi
    fi
}

# Main execution
main() {
    # Set start time
    START_TIME=$(date +%s)
    
    print_header "🚀 STARTING COMPREHENSIVE HEALTH CHECK"
    echo "Timestamp: $(date)"
    echo "API Base URL: $API_BASE_URL"
    echo "Verbose mode: $VERBOSE"
    echo "JSON formatting: $JSON_PRETTY"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Run the health check
    run_health_check
    
    # Calculate duration
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    # Show summary
    show_summary
    
    print_info "Health check completed in ${DURATION}s"
    
    # Exit with appropriate code
    if [[ "$ERRORS" -eq 0 ]]; then
        exit 0
    elif [[ "$ERRORS" -le 2 ]]; then
        exit 1
    else
        exit 2
    fi
}

# Handle script interruption
trap 'echo -e "\n${RED}Health check interrupted${NC}"; exit 130' INT TERM

# Run main function
main "$@"
