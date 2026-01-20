# AGENTS.md - Multi-Page RBAC Web Apps with Google Apps Script

**Specialized Instructions for AI Agents Building Construction Project Management & Enterprise Apps**

---

## TECHNOLOGY STACK

### Backend (Google Apps Script Ecosystem)
- **Runtime**: Google Apps Script (GAS)
- **Database**: Google Sheets
- **File Storage**: Google Drive API
- **Notifications**: Gmail API
- **Language**: JavaScript (ES6+)

### Frontend (Web UI)
- **Markup**: HTML5
- **Styling**: CSS3 + Bootstrap 5 + Bootstrap Icons
- **Interactivity**: JavaScript + jQuery
- **Tables**: DataTables.js
- **Visualization**: Chart.js
- **Alerts/Modals**: SweetAlert2
- **Service**: HtmlService (Google Apps Script)

### AI/LLM Integration
- **Model**: Google Gemini 3 Pro (via Generative AI API)
- **Use Cases**: 
  - Data analysis and insights
  - Form validation and suggestions
  - Report generation
  - Documentation auto-complete
  - Trend analysis

---

## PROJECT STRUCTURE

```
/rbac-web-app
  /backend
    Code.gs                    # Main entry point, routing, server-side logic
    Config.gs                  # Configuration, constants, API keys
    Auth.gs                    # Authentication, session management, role-based access
    Database.gs                # Google Sheets operations, CRUD queries
    FileHandler.gs             # Google Drive operations, file management
    Utils.gs                   # Utility functions, validators, helpers
    GeminiIntegration.gs       # AI/LLM integration (optional, separate if large)
  
  /frontend
    Index.html                 # Main app container with tab navigation
    Styles.html                # All CSS (Bootstrap 5 + custom styles)
    Scripts.html               # jQuery, DataTables, Chart.js initialization
    
    # Page Components
    Header.html                # Navigation bar, user menu
    Footer.html                # Footer with version, links
    Sidebar.html               # Side navigation (if used)
    Login.html                 # Login form
    Register.html              # Registration form
    
    # Feature Pages
    Dashboard.html             # Main dashboard (consolidate into Index.html)
    Users.html                 # User management, roles assignment
    Settings.html              # App settings, configurations
    DataEntry.html             # Main data entry form
    Reports.html               # Report generation, filtering, export
    Profile.html               # User profile, password change
    
    # Modals/Components (optional separate files)
    Modals.html                # Common modal dialogs
    Charts.html                # Chart components
  
  /docs
    README.md                  # Features, quick links, overview
    SHEET_SCHEMA.md            # Google Sheets database structure
    DEPLOYMENT_GUIDE.md        # Setup, Google Cloud configuration
    QUICK_START.md             # API reference, common tasks
    FILES_SUMMARY.md           # Detailed file descriptions
    START_HERE.md              # Orientation for first-time setup
    ARCHITECTURE.md            # System design, data flow (optional)
  
  # Project-level files
  AGENTS.md                    # This file - agent instructions
  PACKAGE_CONTENTS.txt         # Inventory of all deliverables
  DELIVERY_SUMMARY.md          # Completion checklist
  .env.example                 # Required credentials template
  CHANGELOG.md                 # Version history and updates
```

---

## BACKEND FILES - DETAILED SPECIFICATIONS

### Code.gs
**Purpose**: Main entry point, HTTP request routing, server-side request handling

**Must Include**:
- `doGet()` - Serves HTML UI (main container)
- `doPost()` - Handles AJAX requests from frontend
- Router function to dispatch requests by action
- Session/user context initialization
- Error handling and logging

**Structure**:
```javascript
function doGet(e) {
  // Serve main UI container
  // Load user session
  // Pass user data to frontend
  // Return HtmlService.createHtmlOutput()
}

function doPost(e) {
  // Parse request: action, data, method
  // Route to appropriate handler
  // Return JSON response with status, data, message
}

function handleRequest(action, data, userEmail) {
  // Dispatch to Auth, Database, FileHandler, Utils
  // Catch errors and return safe error messages
}
```

### Config.gs
**Purpose**: Centralized configuration, constants, API keys, environment variables

**Must Include**:
```javascript
// Database Configuration
const SHEET_IDS = {
  users: 'SHEET_ID_USERS',
  data: 'SHEET_ID_DATA',
  logs: 'SHEET_ID_LOGS',
  config: 'SHEET_ID_CONFIG'
};

const SHEET_NAMES = {
  users: 'Users',
  data: 'DataEntries',
  logs: 'Logs',
  config: 'Configuration'
};

// API Configuration
const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
const OPENAI_API_KEY = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');

// Role Configuration
const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  VIEWER: 'viewer'
};

const PERMISSIONS = {
  admin: ['create', 'read', 'update', 'delete', 'export', 'admin'],
  manager: ['create', 'read', 'update', 'export'],
  user: ['create', 'read', 'update'],
  viewer: ['read']
};

// Validation Rules
const VALIDATORS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10}$/,
  // Add project-specific validators
};

// Email Configuration
const SENDER_EMAIL = 'noreply@yourcompany.com';
const NOTIFICATION_RECIPIENTS = ['admin@yourcompany.com'];

// Feature Flags
const FEATURES = {
  geminiEnabled: true,
  reportExportEnabled: true,
  fileUploadEnabled: true,
  auditLoggingEnabled: true
};
```

### Auth.gs
**Purpose**: User authentication, role-based access control (RBAC), session management

**Must Include**:
```javascript
function authenticateUser(email, password) {
  // Hash password, verify against database
  // Return { success, user, token, message }
}

function registerUser(email, password, name, role) {
  // Validate input
  // Check email not already registered
  // Hash password
  // Create user record in Google Sheets
  // Send welcome email
}

function hasPermission(userEmail, action, resource) {
  // Get user role from database
  // Check if role has permission for action on resource
  // Return boolean
}

function generateSessionToken(userEmail) {
  // Create JWT or random token
  // Store in cache with expiration
  // Return token
}

function validateSessionToken(token) {
  // Check token in cache
  // Check expiration
  // Return userEmail or null
}

function getCurrentUser() {
  // Get from Session.getActiveUser() or parsed token
  // Return { email, name, role, permissions }
}

function checkAdminAccess(userEmail) {
  // Verify user is admin
  // Throw error if not
}

function logout(token) {
  // Clear session from cache
}
```

### Database.gs
**Purpose**: All Google Sheets CRUD operations, queries, data validation

**Must Include**:
```javascript
function getSheet(sheetName) {
  // Get sheet by name from config
  // Return Sheet object
}

function getAllData(sheetName) {
  // Get all rows (skip header)
  // Return array of objects
}

function getDataById(sheetName, id) {
  // Find row by ID column
  // Return object or null
}

function createRecord(sheetName, data) {
  // Validate data against schema
  // Add timestamp, ID
  // Append to sheet
  // Log activity
  // Return { success, id, message }
}

function updateRecord(sheetName, id, data) {
  // Find row by ID
  // Update cells
  // Log change
  // Return { success, message }
}

function deleteRecord(sheetName, id, softDelete = true) {
  // If softDelete: mark with flag
  // If hard delete: remove row
  // Log activity
  // Return { success, message }
}

function queryData(sheetName, filters, sortBy, limit) {
  // Filter records: { column: value, operator: '=', '>=' }
  // Sort by column(s)
  // Apply limit
  // Return array
}

function bulkInsert(sheetName, records) {
  // Validate all records
  // Insert multiple rows at once
  // Log bulk operation
  // Return { success, count, message }
}

function exportData(sheetName, format = 'json') {
  // Get all data
  // Format as JSON, CSV, or Excel
  // Return formatted string
}

function validateData(sheetName, data) {
  // Check required fields
  // Type validation
  // Custom validators
  // Return { valid, errors }
}
```

### FileHandler.gs
**Purpose**: Google Drive file operations, uploads, downloads, storage management

**Must Include**:
```javascript
function uploadFile(folderId, fileName, fileData, mimeType) {
  // Create blob from data
  // Save to Google Drive folder
  // Create metadata in database
  // Return { success, fileId, url, message }
}

function downloadFile(fileId) {
  // Get file from Drive
  // Return as blob/bytes
}

function deleteFile(fileId, permanent = false) {
  // Move to trash or permanently delete
  // Update database metadata
  // Log activity
  // Return { success, message }
}

function listFiles(folderId, filters = {}) {
  // List files in folder
  // Apply filters (type, date range, owner)
  // Return array of file objects
}

function shareFile(fileId, email, permission = 'reader') {
  // Grant access to user
  // Create activity log
  // Return { success, message }
}

function generateFileLink(fileId, type = 'view') {
  // type: 'view', 'download', 'preview'
  // Generate appropriate link
  // Return URL
}

function backupDatabase() {
  // Export all sheets as files
  // Store in dated backup folder
  // Log backup
  // Return { success, backupId, message }
}

function createFolderStructure(rootFolderId) {
  // Create subfolders: uploads, exports, backups, etc.
  // Return folder IDs
}
```

### Utils.gs
**Purpose**: Utility functions, common operations, validators, formatters

**Must Include**:
```javascript
// Validators
function validateEmail(email) { }
function validatePhone(phone) { }
function validateURL(url) { }
function validatePassword(password) { }

// Formatters
function formatDate(date, format = 'DD-MM-YYYY') { }
function formatCurrency(amount, currency = 'INR') { }
function formatPhoneNumber(phone) { }
function slugify(text) { }

// Data Transformations
function arrayToObject(array, keyField) { }
function objectToArray(object) { }
function groupBy(array, key) { }
function sortBy(array, field, order = 'asc') { }

// Hashing & Encryption
function hashPassword(password) { }
function verifyPassword(plain, hashed) { }
function encryptData(data, key) { }
function decryptData(encrypted, key) { }

// Logging & Monitoring
function logActivity(action, userEmail, details, status = 'success') {
  // Write to audit log sheet
  // Include timestamp, user, action, status, details
}

function logError(error, context) {
  // Write to error log
  // Include stack trace, context
}

function sendNotification(email, subject, body) {
  // Send via Gmail API
  // Include unsubscribe link
}

// ID Generation
function generateId(prefix = '') { }
function generateToken(length = 32) { }

// Array & Object Operations
function findIndex(array, condition) { }
function filterObject(object, condition) { }
function mergeDeep(target, source) { }

// Time Operations
function daysAgo(days) { }
function daysUntil(date) { }
function getCurrentIST() { }  // For Mumbai timezone
```

### GeminiIntegration.gs (Optional - Create if using AI features)
**Purpose**: Google Gemini API integration for data analysis, suggestions, reports

**Must Include**:
```javascript
function callGeminiAPI(prompt, context = {}) {
  // Call Google Generative AI API
  // Handle rate limiting
  // Return response
}

function analyzeData(dataSet, analysisType) {
  // Pass data to Gemini with specific prompt
  // Gemini analyzes patterns, anomalies, trends
  // Return structured response
}

function generateReport(data, reportType) {
  // Gemini generates formatted report
  // Include insights, recommendations
  // Return markdown or formatted text
}

function suggestForm(formData, userRole) {
  // Gemini suggests next steps based on form
  // Provide autocomplete suggestions
  // Return suggestions array
}

function validateWithAI(data, validationRules) {
  // Use Gemini for complex validation
  // Return validation result with explanation
}

function chat(message, context) {
  // Interactive Gemini chat
  // Maintain context across messages
  // Return response
}
```

---

## FRONTEND FILES - DETAILED SPECIFICATIONS

### Index.html
**Purpose**: Main application container, tab/page router, layout manager

**Must Include**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RBAC Web App</title>
  <?!= include('Styles') ?>
</head>
<body>
  <div id="app-container">
    <!-- Header Navigation -->
    <?!= include('Header') ?>
    
    <!-- Main Content Area -->
    <div id="content-area">
      <!-- Pages load here dynamically -->
    </div>
    
    <!-- Footer -->
    <?!= include('Footer') ?>
    
    <!-- Global Modals -->
    <div id="modals-container"></div>
  </div>
  
  <?!= include('Scripts') ?>
</body>
</html>
```

**Key Responsibilities**:
- Load Header, Footer, Scripts, Styles
- Initialize app state and user session
- Implement page/tab routing
- Handle authentication state
- Global error handling

### Styles.html
**Purpose**: All CSS styling, Bootstrap 5 customization, responsive design

**Must Include**:
```html
<style>
  /* Bootstrap 5 Variables Override */
  :root {
    --bs-primary: #0d6efd;
    --bs-secondary: #6c757d;
    --bs-success: #198754;
    --bs-danger: #dc3545;
    --bs-warning: #ffc107;
    --bs-info: #0dcaf0;
    --bs-light: #f8f9fa;
    --bs-dark: #212529;
  }
  
  /* Custom Theme Variables */
  :root {
    --color-primary: #0d6efd;
    --color-border: #dee2e6;
    --color-text: #212529;
    --color-muted: #6c757d;
    --spacing-unit: 1rem;
  }
  
  /* Global Styles */
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
  
  /* Header Styles */
  .navbar { background-color: #fff; border-bottom: 1px solid var(--color-border); }
  
  /* Sidebar Navigation */
  .sidebar { background-color: #f8f9fa; border-right: 1px solid var(--color-border); }
  
  /* Main Content */
  .main-content { flex: 1; padding: 2rem; }
  
  /* Cards & Components */
  .card { border: 1px solid var(--color-border); }
  
  /* Tables - DataTables Custom */
  .dataTables_wrapper { font-size: 0.875rem; }
  .dataTables_paginate { margin-top: 1rem; }
  
  /* Forms */
  .form-control:focus { border-color: var(--color-primary); box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25); }
  
  /* Alerts & Status */
  .alert { border-left: 4px solid; }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .main-content { padding: 1rem; }
  }
</style>

<!-- Bootstrap 5 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">

<!-- DataTables CSS -->
<link href="https://cdn.datatables.net/1.13.0/css/dataTables.bootstrap5.min.css" rel="stylesheet">

<!-- SweetAlert2 CSS -->
<link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
```

### Scripts.html
**Purpose**: JavaScript libraries, initialization, event handlers, business logic

**Must Include**:
```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.datatables.net/1.13.0/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.0/js/dataTables.bootstrap5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js"></script>

<script>
  // Global App Configuration
  const APP = {
    baseUrl: '<?= getCurrentUrl() ?>',
    user: <?= JSON.stringify(user) ?>,
    config: <?= JSON.stringify(config) ?>
  };
  
  // Server Communication
  function callServer(action, data = {}) {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .handleRequest(action, data);
    });
  }
  
  // Initialize on page load
  $(document).ready(function() {
    initializeApp();
    setupEventHandlers();
  });
  
  function initializeApp() {
    // Load user data
    // Initialize components
    // Setup routing
  }
  
  function setupEventHandlers() {
    // Attach global event listeners
  }
</script>
```

### Header.html, Footer.html, Sidebar.html
**Purpose**: Reusable layout components

**Header.html - Navigation bar with user menu**:
```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">App Name</a>
    <button class="navbar-toggler">...</button>
    <div class="navbar-collapse">
      <ul class="navbar-nav ms-auto">
        <li><a class="nav-link" href="#" onclick="navigateTo('dashboard')">Dashboard</a></li>
        <li><a class="nav-link" href="#" onclick="navigateTo('users')">Users</a></li>
        <li class="dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="userMenu">
            <i class="bi bi-person-circle"></i> <?= user.name ?>
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" onclick="navigateTo('profile')">Profile</a></li>
            <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

### Login.html, Register.html
**Purpose**: Authentication forms

**Login.html**:
```html
<div class="container mt-5">
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Login</h5>
          <form id="loginForm">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" name="email" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
            <a href="#" onclick="navigateTo('register')" class="ms-2">Register</a>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  $('#loginForm').on('submit', async function(e) {
    e.preventDefault();
    const data = $(this).serializeObject();
    try {
      const result = await callServer('authenticate', data);
      if (result.success) {
        APP.user = result.user;
        navigateTo('dashboard');
      } else {
        Swal.fire('Error', result.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Login failed', 'error');
    }
  });
</script>
```

### Users.html
**Purpose**: User management page with role assignment, table display

```html
<div class="container-fluid">
  <h2>User Management</h2>
  
  <button class="btn btn-primary mb-3" onclick="openAddUserModal()">
    <i class="bi bi-plus"></i> Add User
  </button>
  
  <table id="usersTable" class="table table-striped">
    <thead>
      <tr>
        <th>Email</th>
        <th>Name</th>
        <th>Role</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>

<script>
  let usersTable;
  
  async function loadUsers() {
    try {
      const users = await callServer('getUsers', {});
      $('#usersTable tbody').html('');
      users.forEach(user => {
        $('#usersTable tbody').append(`
          <tr>
            <td>${user.email}</td>
            <td>${user.name}</td>
            <td>${user.role}</td>
            <td><span class="badge bg-${user.active ? 'success' : 'danger'}">${user.active ? 'Active' : 'Inactive'}</span></td>
            <td>
              <button class="btn btn-sm btn-warning" onclick="editUser('${user.id}')"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')"><i class="bi bi-trash"></i></button>
            </td>
          </tr>
        `);
      });
      
      if (!usersTable) {
        usersTable = $('#usersTable').DataTable({
          language: { search: 'Filter users:', searchPlaceholder: 'Search...' }
        });
      } else {
        usersTable.draw();
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }
  
  $(document).ready(function() {
    loadUsers();
  });
</script>
```

### Reports.html
**Purpose**: Report generation, filtering, export functionality

```html
<div class="container-fluid">
  <h2>Reports</h2>
  
  <div class="row mb-3">
    <div class="col-md-3">
      <label class="form-label">Report Type</label>
      <select id="reportType" class="form-select">
        <option value="summary">Summary</option>
        <option value="detailed">Detailed</option>
        <option value="export">Export</option>
      </select>
    </div>
    <div class="col-md-3">
      <label class="form-label">Date Range</label>
      <input type="date" id="startDate" class="form-control">
    </div>
    <div class="col-md-3">
      <label class="form-label">To Date</label>
      <input type="date" id="endDate" class="form-control">
    </div>
    <div class="col-md-3">
      <label>&nbsp;</label>
      <button class="btn btn-primary w-100" onclick="generateReport()">
        <i class="bi bi-file-text"></i> Generate
      </button>
    </div>
  </div>
  
  <div id="reportContainer"></div>
</div>

<script>
  async function generateReport() {
    const type = $('#reportType').val();
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    
    try {
      const report = await callServer('generateReport', { type, startDate, endDate });
      displayReport(report);
    } catch (error) {
      Swal.fire('Error', 'Failed to generate report', 'error');
    }
  }
  
  function displayReport(report) {
    let html = '<div class="card"><div class="card-body">';
    html += `<h5>${report.title}</h5>`;
    html += `<p>${report.summary}</p>`;
    
    if (report.chart) {
      html += `<canvas id="reportChart"></canvas>`;
      $('#reportContainer').html(html);
      
      // Initialize Chart.js
      new Chart($('#reportChart')[0].getContext('2d'), report.chart);
    } else {
      html += `<table class="table">${report.table}</table>`;
      html += `<button class="btn btn-success" onclick="exportReport('${report.id}')">
        <i class="bi bi-download"></i> Export
      </button>`;
      $('#reportContainer').html(html + '</div></div>');
    }
  }
</script>
```

### DataEntry.html
**Purpose**: Main data entry form with validation and submission

```html
<div class="container-fluid">
  <h2>Data Entry</h2>
  
  <form id="dataEntryForm">
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Project Name</label>
        <input type="text" class="form-control" name="projectName" required>
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">Client</label>
        <input type="text" class="form-control" name="client" required>
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Start Date</label>
        <input type="date" class="form-control" name="startDate" required>
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">End Date</label>
        <input type="date" class="form-control" name="endDate" required>
      </div>
    </div>
    
    <button type="submit" class="btn btn-primary">
      <i class="bi bi-save"></i> Save
    </button>
  </form>
</div>

<script>
  $('#dataEntryForm').on('submit', async function(e) {
    e.preventDefault();
    const data = $(this).serializeObject();
    
    try {
      const result = await callServer('createDataEntry', data);
      if (result.success) {
        Swal.fire('Success', 'Data saved successfully', 'success');
        this.reset();
      } else {
        Swal.fire('Error', result.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to save data', 'error');
    }
  });
</script>
```

---

## DOCUMENTATION FILES - DETAILED SPECIFICATIONS

### README.md
**Purpose**: Quick overview, features, setup quick links

**Must Include**:
```markdown
# RBAC Multi-Page Web App

## Features
- ✅ Role-Based Access Control (RBAC)
- ✅ User Management
- ✅ Project Management
- ✅ Data Entry & Validation
- ✅ Report Generation
- ✅ File Management
- ✅ Audit Logging
- ✅ Google Gemini AI Integration
- ✅ Responsive UI (Bootstrap 5)

## Quick Start
1. [Setup Guide](DEPLOYMENT_GUIDE.md)
2. [Database Schema](SHEET_SCHEMA.md)
3. [API Reference](QUICK_START.md)
4. [File Structure](FILES_SUMMARY.md)

## System Requirements
- Google Account with Gmail, Drive, Sheets
- Google Apps Script project
- Modern browser (Chrome, Firefox, Safari)

## Deployment
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## Support
For issues, see [START_HERE.md](START_HERE.md)
```

### SHEET_SCHEMA.md
**Purpose**: Detailed database schema for all Google Sheets

**Must Include**:
```markdown
# Google Sheets Database Schema

## Sheet: Users
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| ID | String | Yes | Unique identifier (UUID) |
| Email | String | Yes | User email (unique) |
| Password | String | Yes | Hashed password |
| Name | String | Yes | Full name |
| Role | String | Yes | admin, manager, user, viewer |
| Department | String | No | Department/team |
| Active | Boolean | Yes | Is user active |
| LastLogin | Date | No | Last login timestamp |
| CreatedAt | Date | Yes | Account creation date |
| UpdatedAt | Date | Yes | Last update date |

## Sheet: Projects (or DataEntries)
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| ID | String | Yes | Unique identifier |
| ProjectName | String | Yes | Project/document name |
| Client | String | No | Client name |
| StartDate | Date | Yes | Project start date |
| EndDate | Date | No | Expected end date |
| Budget | Number | No | Allocated budget (INR) |
| Status | String | Yes | Active, Completed, OnHold, Cancelled |
| Manager | String | Yes | Project manager email |
| CreatedBy | String | Yes | Creator email |
| CreatedAt | Date | Yes | Creation timestamp |
| UpdatedAt | Date | Yes | Last update timestamp |

## Sheet: FileMetadata
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| ID | String | Yes | Unique identifier |
| FileId | String | Yes | Google Drive file ID |
| FileName | String | Yes | Original file name |
| MimeType | String | Yes | File MIME type |
| Size | Number | Yes | File size in bytes |
| UploadedBy | String | Yes | Uploader email |
| UploadedAt | Date | Yes | Upload timestamp |
| Folder | String | Yes | Storage folder path |
| ProjectId | String | No | Associated project ID |

## Sheet: AuditLogs
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| ID | String | Yes | Unique identifier |
| Timestamp | Date | Yes | Event timestamp |
| UserEmail | String | Yes | User performing action |
| Action | String | Yes | Action type (create, update, delete, etc.) |
| Resource | String | Yes | Resource type (users, projects, files) |
| ResourceId | String | No | ID of resource affected |
| Status | String | Yes | success, failure |
| Details | String | No | Additional details (JSON) |

## Sheet: Configuration
| Column | Type | Description |
|--------|------|-------------|
| Key | String | Configuration key |
| Value | String | Configuration value |
| Type | String | string, number, boolean, json |
| LastModifiedBy | String | Last modifier email |
| LastModifiedAt | Date | Last modification date |
```

### DEPLOYMENT_GUIDE.md
**Purpose**: Step-by-step deployment instructions

**Must Include**:
```markdown
# Deployment Guide

## Prerequisites
- Google Account
- Google Apps Script project created
- Google Cloud Console project with APIs enabled

## Step 1: Setup Google Cloud APIs
1. Go to Google Cloud Console
2. Enable these APIs:
   - Google Drive API
   - Gmail API
   - Google Sheets API
   - Generative AI API (for Gemini)

## Step 2: Create Google Sheets Database
1. Create a new Google Sheets spreadsheet
2. Create sheets: Users, Projects, FileMetadata, AuditLogs, Configuration
3. Add headers as per SHEET_SCHEMA.md

## Step 3: Setup Google Apps Script
1. Open Google Apps Script (script.google.com)
2. Create new project
3. Copy all .gs files into the project
4. Save as project name

## Step 4: Configure Properties
1. Go to Project Settings
2. Add script properties:
   - SHEET_ID: Your Sheets ID
   - GEMINI_API_KEY: Your Gemini API key
   - APP_NAME: Application name
   - ADMIN_EMAIL: Your admin email

## Step 5: Deploy as Web App
1. Click Deploy > New Deployment
2. Type: Web app
3. Execute as: Your account
4. Who has access: Anyone (or restrict)
5. Copy deployment URL

## Step 6: Configure Authentication
1. Set up admin user initially
2. Generate API tokens for integrations
3. Test login at deployed URL

## Troubleshooting
[See START_HERE.md](START_HERE.md)
```

### QUICK_START.md
**Purpose**: API reference, common tasks, code snippets

**Must Include**:
```markdown
# Quick Start & API Reference

## Frontend API - Calling Backend

### Syntax
```javascript
google.script.run
  .withSuccessHandler(successCallback)
  .withFailureHandler(errorCallback)
  .backendFunctionName(param1, param2);
```

### Examples

**Get Current User**
```javascript
google.script.run.withSuccessHandler(function(user) {
  console.log(user.email, user.role);
}).getCurrentUser();
```

**Create Data Entry**
```javascript
google.script.run.withSuccessHandler(function(result) {
  if (result.success) alert('Saved!');
}).createDataEntry({ 
  projectName: 'Project A',
  client: 'Client B'
});
```

**Authenticate User**
```javascript
google.script.run.withSuccessHandler(function(result) {
  if (result.success) {
    window.location.reload();
  }
}).authenticateUser({
  email: 'user@example.com',
  password: 'password123'
});
```

## Backend API - Server Functions

### Authentication
- `authenticateUser(email, password)` - Login user
- `registerUser(email, password, name)` - Create account
- `getCurrentUser()` - Get session user
- `logout()` - End session

### User Management
- `getUsers()` - Get all users (admin only)
- `getUserById(userId)` - Get single user
- `updateUser(userId, data)` - Update user details
- `deleteUser(userId)` - Delete user (admin only)
- `changeUserRole(userId, newRole)` - Assign role

### Data Management
- `createDataEntry(data)` - Create new record
- `getDataEntries(filters, sortBy, limit)` - Query records
- `updateDataEntry(id, data)` - Update record
- `deleteDataEntry(id)` - Delete record
- `exportData(format)` - Export as JSON/CSV

### File Operations
- `uploadFile(fileName, fileData, mimeType)` - Upload file
- `downloadFile(fileId)` - Download file
- `deleteFile(fileId)` - Delete file
- `listFiles(filters)` - List files
- `shareFile(fileId, email, permission)` - Share file

### Reports
- `generateReport(type, filters)` - Generate report
- `exportReport(reportId, format)` - Export report
- `getReportList()` - List available reports

### Gemini AI (if enabled)
- `analyzeData(dataSet, analysisType)` - AI analysis
- `generateInsights(dataSet)` - Generate insights
- `suggestForm(formData)` - Suggest next steps

## Common Tasks

### Display a data table
```javascript
$(document).ready(function() {
  $('#myTable').DataTable({
    processing: true,
    serverSide: false,
    language: { search: 'Filter:' }
  });
});
```

### Show alert
```javascript
Swal.fire({
  title: 'Success',
  text: 'Operation completed',
  icon: 'success',
  confirmButtonText: 'OK'
});
```

### Make form submission
```javascript
$('#myForm').on('submit', function(e) {
  e.preventDefault();
  const data = $(this).serializeObject();
  
  google.script.run
    .withSuccessHandler(handleSuccess)
    .withFailureHandler(handleError)
    .createRecord(data);
});
```

## Error Handling
All API responses have this structure:
```javascript
{
  success: true/false,
  data: {...},
  message: "Success or error message",
  error: {
    code: "ERROR_CODE",
    details: "Additional details"
  }
}
```

Always check `success` before using `data`.
```

### FILES_SUMMARY.md
**Purpose**: Detailed description of each file

**Must Include**:
```markdown
# File Summary & Descriptions

## Backend Files (Google Apps Script)

### Code.gs (Main Entry Point)
- **Purpose**: HTTP request router, main application logic
- **Key Functions**: doGet(), doPost(), handleRequest()
- **Size**: 300-500 lines typical
- **Dependencies**: Config.gs, Auth.gs, Database.gs, FileHandler.gs, Utils.gs

### Config.gs (Configuration)
- **Purpose**: Constants, configuration, API keys, roles/permissions
- **Size**: 100-150 lines
- **Maintenance**: Update when adding new roles, sheets, API keys

### Auth.gs (Authentication & RBAC)
- **Purpose**: User login, role checking, permissions management
- **Key Functions**: authenticateUser(), hasPermission(), validateSessionToken()
- **Size**: 200-300 lines
- **Security**: Handles password hashing, token generation

### Database.gs (Sheets Operations)
- **Purpose**: CRUD operations on Google Sheets
- **Key Functions**: getSheet(), createRecord(), updateRecord(), queryData()
- **Size**: 400-600 lines (typically largest file)
- **Dependencies**: Google Sheets API, Utils.gs

### FileHandler.gs (Drive Operations)
- **Purpose**: Google Drive file management, uploads, downloads
- **Key Functions**: uploadFile(), downloadFile(), shareFile()
- **Size**: 200-300 lines
- **Dependencies**: Google Drive API, Utils.gs

### Utils.gs (Utility Functions)
- **Purpose**: Common operations, validators, formatters, loggers
- **Key Functions**: validateEmail(), formatDate(), logActivity(), hashPassword()
- **Size**: 300-400 lines
- **Reusability**: Used by all other .gs files

### GeminiIntegration.gs (Optional - AI)
- **Purpose**: Google Gemini API integration
- **Key Functions**: callGeminiAPI(), analyzeData(), generateReport()
- **Size**: 150-250 lines
- **Dependencies**: Generative AI API, Config.gs

## Frontend Files (HTML/CSS/JavaScript)

### Index.html (Main Container)
- **Purpose**: Application root, page routing, layout container
- **Size**: 50-100 lines (most content in includes)
- **Includes**: Header.html, Scripts.html, Styles.html, Footer.html

### Styles.html (All CSS)
- **Purpose**: Bootstrap 5 customization, responsive design, theme variables
- **Size**: 300-400 lines (includes external CSS imports)
- **Key Sections**: Variables, layout, components, responsive design

### Scripts.html (JavaScript Initialization)
- **Purpose**: Library imports, global functions, app initialization
- **Size**: 150-250 lines (mostly imports, minimal local code)
- **Loads**: jQuery, Bootstrap, DataTables, Chart.js, SweetAlert2

### Header.html (Navigation)
- **Purpose**: Top navigation bar, user menu, branding
- **Size**: 50-80 lines
- **Includes**: Navbar with dropdown for user menu

### Footer.html (Footer Section)
- **Purpose**: Footer with copyright, links, version
- **Size**: 30-50 lines

### Sidebar.html (Side Navigation - Optional)
- **Purpose**: Left sidebar with menu (if using sidebar layout)
- **Size**: 50-100 lines
- **Alternative**: Can use Bootstrap navbar collapse instead

### Login.html (Login Form)
- **Purpose**: User authentication form
- **Size**: 80-120 lines
- **Validates**: Email, password
- **Action**: Calls authenticateUser() backend function

### Register.html (Registration Form)
- **Purpose**: New user registration
- **Size**: 100-150 lines
- **Validates**: Email uniqueness, password strength
- **Action**: Calls registerUser() backend function

### Users.html (User Management)
- **Purpose**: Admin user management, role assignment
- **Size**: 150-200 lines
- **Requires**: Admin role
- **Features**: DataTables display, inline edit/delete

### DataEntry.html (Main Form)
- **Purpose**: Primary data entry form for projects/records
- **Size**: 150-250 lines
- **Validates**: Required fields, data types
- **Action**: Calls createDataEntry() backend function

### Reports.html (Report Generation)
- **Purpose**: Report builder with filters, export
- **Size**: 200-300 lines
- **Features**: DataTables, Chart.js graphs, export to PDF/Excel
- **Requires**: Manager+ role

### Settings.html (Application Settings)
- **Purpose**: Configuration page for app settings
- **Size**: 100-150 lines
- **Requires**: Admin role
- **Features**: Edit configuration values

### Profile.html (User Profile)
- **Purpose**: User profile, password change
- **Size**: 100-150 lines
- **Features**: Edit name, change password, logout

### Modals.html (Shared Modal Dialogs - Optional)
- **Purpose**: Common modal templates (add user, confirm delete, etc.)
- **Size**: 200-300 lines
- **Includes**: Add User, Confirm Delete, Edit Record modals

## Documentation Files

### README.md (Overview)
- **Purpose**: Project overview, features, quick links
- **Audience**: End users, developers
- **Length**: 1-2 pages

### SHEET_SCHEMA.md (Database Schema)
- **Purpose**: Detailed schema for all Google Sheets
- **Content**: Sheet names, column definitions, data types
- **Length**: 2-3 pages
- **Update**: Whenever schema changes

### DEPLOYMENT_GUIDE.md (Setup Instructions)
- **Purpose**: Step-by-step deployment guide
- **Content**: Prerequisites, Google Cloud setup, Apps Script config
- **Length**: 3-5 pages
- **Audience**: DevOps, administrators

### QUICK_START.md (API Reference)
- **Purpose**: API reference, code examples, common tasks
- **Content**: Function list, example code, error handling
- **Length**: 2-3 pages
- **Audience**: Developers

### FILES_SUMMARY.md (This File)
- **Purpose**: Detailed file descriptions and purposes
- **Content**: File purpose, size, key functions, dependencies
- **Length**: 4-6 pages
- **Audience**: Developers, maintainers

### START_HERE.md (Orientation)
- **Purpose**: First-time setup, common issues, FAQ
- **Content**: Initial setup, login troubleshooting, debugging
- **Length**: 2-3 pages
- **Audience**: First-time users

### AGENTS.md (Agent Instructions)
- **Purpose**: AI agent instructions for building this app type
- **Audience**: Coding agents, AI assistants
- **Length**: 20+ pages

## Supporting Files

### PACKAGE_CONTENTS.txt
- **Purpose**: Inventory of all deliverables
- **Format**: Simple text list with file counts
- **Update**: When adding/removing files

### DELIVERY_SUMMARY.md
- **Purpose**: Completion checklist, quality assurance
- **Sections**: Frontend complete, Backend complete, Docs complete, Testing done

### CHANGELOG.md
- **Purpose**: Version history, update log
- **Format**: Date-based, feature/fix/known-issues sections
- **Update**: With each deployment

### .env.example
- **Purpose**: Template for required environment variables
- **Content**: SHEET_ID, GEMINI_API_KEY, ADMIN_EMAIL, etc.
- **Note**: Never commit actual secrets, use this as template
```

### START_HERE.md
**Purpose**: Orientation for first-time users and deployment

**Must Include**:
```markdown
# START HERE - First Time Setup Guide

## For First-Time Users

### 1. Initial Login
- Default admin account: (provide email/password or setup instructions)
- Change password immediately
- Go to Profile to add your details

### 2. Understanding the Roles
- **Admin**: Full access, can manage users and system settings
- **Manager**: Can create projects, view reports, manage team
- **User**: Can enter data, view own projects
- **Viewer**: Read-only access, cannot make changes

### 3. First Actions
1. Go to Users page (Admin only)
2. Add your team members
3. Assign appropriate roles
4. Go to DataEntry to start entering projects
5. Check Reports for insights

## For Administrators

### Setup Checklist
- [ ] Deploy web app to Google Apps Script
- [ ] Configure Google Sheets with correct IDs in Config.gs
- [ ] Setup initial admin user
- [ ] Enable necessary Google APIs
- [ ] Configure Gemini API key (optional)
- [ ] Test login functionality
- [ ] Create initial team users
- [ ] Test key features (create, read, update, delete)

### Common Tasks

**Add a New User**
1. Go to Users page
2. Click "Add User" button
3. Enter email, name, password, select role
4. User receives welcome email

**Reset User Password**
1. Contact admin or use password reset link
2. User creates new password
3. User logs in with new password

**Change User Role**
1. Go to Users page
2. Click edit icon next to user
3. Select new role
4. Save changes

**View Audit Log**
1. Go to Settings
2. Click "Audit Logs"
3. Filter by date, user, action
4. Review activity history

## Troubleshooting

### "Login failed" error
- Check email address is correct
- Verify password (case-sensitive)
- Ensure user account is active
- Check if user has assigned role

### "Permission denied" error
- Verify your role has required permissions
- Contact admin to request higher access level
- Check if resource belongs to your team

### "Google API error" 
- Verify Google APIs are enabled in Google Cloud Console
- Check API key/credentials are correct
- Review API quota limits

### "Files not uploading"
- Check file size limit
- Verify Google Drive has storage space
- Ensure you have upload permission
- Try clearing browser cache

### "Reports not generating"
- Verify data exists for selected date range
- Check if Gemini AI is properly configured
- Try with smaller date range first
- Check error logs in Settings

## Getting Help

1. Check [QUICK_START.md](QUICK_START.md) for API reference
2. Review error messages in browser console (F12)
3. Check audit logs for detailed activity
4. Contact admin or system support

## Useful Links
- [Quick Start Reference](QUICK_START.md)
- [Database Schema](SHEET_SCHEMA.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
```

### PACKAGE_CONTENTS.txt
**Purpose**: Simple inventory of deliverables

```
RBAC WEB APP - PACKAGE CONTENTS

BACKEND FILES (Google Apps Script)
=====================================
✓ Code.gs                 - Main entry point and router
✓ Config.gs               - Configuration and constants
✓ Auth.gs                 - Authentication and RBAC
✓ Database.gs             - Google Sheets CRUD operations
✓ FileHandler.gs          - Google Drive file management
✓ Utils.gs                - Utility functions and helpers
✓ GeminiIntegration.gs    - Optional AI integration

FRONTEND FILES (HTML/CSS/JavaScript)
=====================================
✓ Index.html              - Main application container
✓ Styles.html             - Bootstrap 5 CSS and custom styles
✓ Scripts.html            - JavaScript libraries and initialization
✓ Header.html             - Navigation bar component
✓ Footer.html             - Footer component
✓ Sidebar.html            - Sidebar navigation (optional)
✓ Login.html              - Login form
✓ Register.html           - Registration form
✓ Dashboard.html          - Main dashboard (optional)
✓ Users.html              - User management page
✓ Settings.html           - Application settings page
✓ DataEntry.html          - Main data entry form
✓ Reports.html            - Report generation page
✓ Profile.html            - User profile page

DOCUMENTATION FILES
====================================
✓ README.md               - Project overview and quick links
✓ SHEET_SCHEMA.md         - Database schema documentation
✓ DEPLOYMENT_GUIDE.md     - Step-by-step deployment guide
✓ QUICK_START.md          - API reference and code examples
✓ FILES_SUMMARY.md        - Detailed file descriptions
✓ START_HERE.md           - First-time setup guide
✓ AGENTS.md               - AI agent instructions
✓ CHANGELOG.md            - Version history and updates
✓ ARCHITECTURE.md         - System design and data flow
✓ API_REFERENCE.md        - Complete API documentation

SUPPORTING FILES
====================================
✓ PACKAGE_CONTENTS.txt    - This file
✓ DELIVERY_SUMMARY.md     - Completion checklist
✓ .env.example            - Environment variables template

TOTAL FILES: 27+
BACKEND: 6-7 .gs files
FRONTEND: 14 .html files  
DOCUMENTATION: 9-10 .md files
CONFIGURATION: 3 supporting files

DEPLOYMENT STATUS
====================================
[ ] Pre-deployment checklist complete
[ ] Google Cloud APIs enabled
[ ] Google Sheets configured
[ ] Environment variables set
[ ] Testing passed
[ ] Ready for production deployment
```

### DELIVERY_SUMMARY.md
**Purpose**: Final completion checklist

```markdown
# DELIVERY SUMMARY - Project Completion Checklist

**Project**: RBAC Multi-Page Web App with Google Apps Script  
**Created**: [Date]  
**Version**: 1.0.0  
**Status**: [PENDING/COMPLETE]

## Backend Development
- [ ] Code.gs - Main entry point and routing complete
- [ ] Config.gs - All configuration values set
- [ ] Auth.gs - Authentication, login, RBAC implemented
- [ ] Database.gs - All CRUD operations functional
- [ ] FileHandler.gs - File upload/download working
- [ ] Utils.gs - All utility functions implemented
- [ ] GeminiIntegration.gs - AI features (if applicable)
- [ ] Error handling comprehensive
- [ ] Logging and audit trails working
- [ ] Security: Passwords hashed, tokens generated

## Frontend Development
- [ ] Index.html - Main container and routing
- [ ] Styles.html - Bootstrap 5 customized
- [ ] Scripts.html - All libraries loaded
- [ ] Header.html - Navigation working
- [ ] Footer.html - Footer complete
- [ ] Login.html - Authentication UI functional
- [ ] Register.html - Registration flow working
- [ ] Users.html - User management complete
- [ ] DataEntry.html - Data entry form functional
- [ ] Reports.html - Report generation working
- [ ] Settings.html - Admin settings page
- [ ] Profile.html - User profile management
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] Browser compatibility tested
- [ ] Error messages clear and helpful

## Database & Infrastructure
- [ ] Google Sheets created with all required sheets
- [ ] Schema matches SHEET_SCHEMA.md
- [ ] Initial data (admin user) populated
- [ ] Google Drive folders structured
- [ ] Backup mechanism in place
- [ ] Audit logging functional

## Documentation
- [ ] README.md - Complete with features and links
- [ ] SHEET_SCHEMA.md - All sheets documented
- [ ] DEPLOYMENT_GUIDE.md - Setup steps clear
- [ ] QUICK_START.md - API reference complete
- [ ] FILES_SUMMARY.md - All files described
- [ ] START_HERE.md - First-time setup guide
- [ ] AGENTS.md - Agent instructions comprehensive
- [ ] CHANGELOG.md - Version history
- [ ] .env.example - All variables listed

## Testing & QA
- [ ] Unit testing - Core functions tested
- [ ] Integration testing - APIs tested
- [ ] User acceptance testing - Features verified
- [ ] Security testing - RBAC verified
- [ ] Performance testing - Load times acceptable
- [ ] Browser testing - Chrome, Firefox, Safari
- [ ] Mobile testing - Responsive design works
- [ ] Error scenarios - Edge cases handled

## Security
- [ ] Passwords encrypted using bcrypt/similar
- [ ] Session tokens with expiration
- [ ] HTTPS enabled for deployment
- [ ] Google APIs properly scoped
- [ ] No hardcoded secrets in code
- [ ] Input validation comprehensive
- [ ] SQL injection prevention (if applicable)
- [ ] XSS protection in place
- [ ] CSRF tokens on forms

## Deployment
- [ ] Google Apps Script deployed as web app
- [ ] Deployment URL working
- [ ] Environment variables configured
- [ ] Initial admin user created
- [ ] Test login successful
- [ ] All core features tested on production

## Performance & Optimization
- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] Database queries optimized
- [ ] Frontend code minified
- [ ] Images optimized
- [ ] No console errors in browser

## Post-Deployment
- [ ] Monitoring setup (error logging)
- [ ] Backup schedule configured
- [ ] Support documentation created
- [ ] Team trained on system
- [ ] User feedback collected
- [ ] Known issues documented

## Sign-Off
**Project Manager**: _________________  Date: _______  
**QA Lead**: _________________  Date: _______  
**Client**: _________________  Date: _______  

## Known Issues / Future Improvements
- [List any known issues or future enhancement requests]

## Support Contact
- Primary: [Name] - [Email] - [Phone]
- Secondary: [Name] - [Email] - [Phone]
- Documentation: [Link to docs]

---
**Approved for Production Deployment**: [ ] YES  [ ] NO  
**Deployment Date**: [Date]  
**Deployed By**: [Name]  
```

---

## PLANNING & EXECUTION WORKFLOW

### Phase 1: Requirements & Planning
1. **Understand the specific use case**
   - Construction project management
   - Financial tracking (budgets, billing)
   - Document management
   - Team collaboration
   
2. **Define data schema**
   - Identify all Google Sheets needed
   - Define columns, data types, validation rules
   - Document relationships between sheets

3. **Define roles and permissions**
   - Admin: Full system access
   - Manager: Can create projects, view reports
   - User: Can enter data, view own projects
   - Viewer: Read-only access
   - (Add project-specific roles as needed)

### Phase 2: Backend Development
**Sequence**: Config.gs → Auth.gs → Database.gs → Utils.gs → FileHandler.gs → Code.gs

1. **Setup Config.gs first**
   - All other files depend on configuration
   - Don't proceed until Config has all required constants
   
2. **Implement Auth.gs**
   - User authentication
   - Role-based permissions
   - Session management
   - Critical for security

3. **Build Database.gs**
   - CRUD operations for all sheets
   - Query builder
   - Data validation
   - Largest file, takes most time

4. **Create Utils.gs**
   - Reusable functions
   - Validators
   - Formatters
   - Loggers

5. **Implement FileHandler.gs**
   - Google Drive operations
   - File uploads/downloads
   - Sharing and permissions

6. **Integrate into Code.gs**
   - Wire up all functions
   - Test routing
   - Add error handling

### Phase 3: Frontend Development
**Sequence**: Styles.html → Scripts.html → Header.html → Login.html → Index.html → Feature Pages

1. **Design theme in Styles.html**
   - Bootstrap 5 customization
   - Color scheme (professional)
   - Responsive breakpoints
   - Component styles

2. **Setup Scripts.html**
   - Library imports
   - Global functions
   - Communication with backend

3. **Build authentication pages**
   - Login.html
   - Register.html
   - Password reset (optional)

4. **Create header/footer**
   - Navigation structure
   - User menu
   - Branding

5. **Build feature pages**
   - Users.html (RBAC management)
   - DataEntry.html (main form)
   - Reports.html (data visualization)
   - Settings.html (admin config)

### Phase 4: Integration & Testing
1. **Wire up frontend to backend**
   - Test all API calls
   - Verify RBAC at UI layer

2. **Test user flows**
   - Login → Dashboard → Data Entry → Reports
   - Admin → User Management → Permission assignment
   - File upload → Download → Share

3. **Test edge cases**
   - Invalid inputs
   - Permission denials
   - Network errors
   - Large datasets

### Phase 5: Documentation & Deployment
1. **Write documentation**
   - README with quick links
   - DEPLOYMENT_GUIDE with step-by-step setup
   - API reference in QUICK_START
   - User guide in START_HERE

2. **Deploy to Google Apps Script**
   - Create deployment
   - Test deployed URL
   - Configure properties

3. **Post-deployment**
   - Create admin user
   - Onboard initial users
   - Monitor for errors

---

## BUILD COMMANDS & TESTING

### Manual Testing Checklist

**Authentication**
```javascript
// Test login
function testLogin() {
  const result = authenticateUser('admin@company.com', 'password');
  console.log('Login result:', result);
}

// Test RBAC
function testRBAC() {
  const hasAccess = hasPermission('user@company.com', 'delete', 'projects');
  console.log('Has delete access:', hasAccess);
}
```

**Database Operations**
```javascript
// Test data creation
function testCreate() {
  const data = {
    projectName: 'Test Project',
    client: 'Test Client',
    startDate: new Date()
  };
  const result = createRecord('Projects', data);
  console.log('Create result:', result);
}

// Test data query
function testQuery() {
  const results = queryData('Projects', { status: 'Active' });
  console.log('Query results:', results);
}
```

### Deployment Steps
1. Open Apps Script project
2. Press Ctrl+S to save all files
3. Click Deploy > New Deployment
4. Select type: Web app
5. Execute as: Your Google account
6. Who has access: Specific users or Anyone
7. Click Deploy
8. Test the deployment URL

---

## CODE QUALITY & STYLE GUIDELINES

### JavaScript Conventions
```javascript
// Use ES6+ syntax
const user = { name: 'John', role: 'admin' };
const [firstName, ...rest] = name.split(' ');

// Use meaningful variable names
const userPermissions = getRolePermissions(userRole);
// NOT: const p = getRolePermissions(r);

// Use arrow functions for callbacks
data.map(item => ({ ...item, processed: true }))

// Add JSDoc comments for functions
/**
 * Creates a new user record
 * @param {string} email - User email address
 * @param {string} password - User password (will be hashed)
 * @param {string} role - User role (admin, manager, user, viewer)
 * @returns {Object} { success: boolean, userId: string, message: string }
 */
function createUser(email, password, role) { }

// Use consistent error handling
try {
  const result = performAction();
  return { success: true, data: result };
} catch (error) {
  logError(error, { context: 'actionName' });
  return { success: false, message: 'Action failed', error: error.message };
}
```

### Google Sheets Range Naming
```javascript
// Use named ranges for important data
// Database > Named ranges > Create range
// Users!A:K → "USERS_DATA"
// Projects!A:M → "PROJECTS_DATA"

// Reference named ranges
const usersData = SpreadsheetApp.getActiveSpreadsheet()
  .getRangeByName('USERS_DATA').getValues();
```

### HTML/CSS Best Practices
```html
<!-- Use semantic HTML -->
<main>
  <article>
    <header>
      <h1>Page Title</h1>
    </header>
    <section>
      <!-- Content -->
    </section>
  </article>
</main>

<!-- Use data attributes for JS hooks -->
<button class="btn" data-action="delete" data-id="123">
  Delete
</button>

<!-- CSS organization -->
/* Variables first */
:root { --color-primary: #0d6efd; }

/* Reset/Global */
* { box-sizing: border-box; }

/* Components */
.btn { }

/* Utilities */
.text-center { }

/* Responsive */
@media (max-width: 768px) { }
```

---

## TROUBLESHOOTING & COMMON ISSUES

### Issue: Google API "Quota Exceeded"
**Cause**: Too many API calls in short time
**Solution**: 
- Implement request batching
- Use Sheets batch operations
- Add delays between bulk operations
- Cache frequently accessed data

### Issue: Frontend not communicating with backend
**Cause**: Deployment URL not updated, or function not exposed
**Solution**:
```javascript
// Ensure function is at script scope (not nested)
// Called from HTML: google.script.run.myFunction()
function myFunction(param) { }

// Not inside another function!
```

### Issue: Password hashing failing
**Cause**: Using unsupported algorithm
**Solution**:
```javascript
// Use Google Apps Script's built-in Utilities
function hashPassword(password) {
  return Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, 
    password
  );
}
```

### Issue: Large file uploads slow/failing
**Cause**: File size too large, chunking needed
**Solution**:
```javascript
// Implement chunked uploads
function uploadLargeFile(fileData, chunkSize = 1000000) {
  const chunks = [];
  for (let i = 0; i < fileData.length; i += chunkSize) {
    chunks.push(fileData.slice(i, i + chunkSize));
  }
  // Upload each chunk separately
  chunks.forEach(chunk => uploadChunk(chunk));
}
```

### Issue: Gemini API calls failing
**Cause**: API key invalid, quota exceeded, or malformed request
**Solution**:
```javascript
function callGeminiAPI(prompt) {
  const API_KEY = PropertiesService.getScriptProperties()
    .getProperty('GEMINI_API_KEY');
  
  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };
  
  const options = {
    method: 'post',
    payload: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
    options
  );
  
  if (response.getResponseCode() !== 200) {
    throw new Error(`Gemini API error: ${response.getContentText()}`);
  }
  
  return JSON.parse(response.getContentText());
}
```

---

## SUCCESS CRITERIA & COMPLETION

### Functional Requirements Met
- ✅ Multi-page RBAC app fully functional
- ✅ Role-based access control working
- ✅ User management complete
- ✅ Data entry forms validated
- ✅ Reports generate correctly
- ✅ File management working
- ✅ Authentication secure

### Code Quality Met
- ✅ No console errors
- ✅ Error handling comprehensive
- ✅ Code follows style guidelines
- ✅ Functions have JSDoc comments
- ✅ No hardcoded secrets

### Documentation Complete
- ✅ All files documented
- ✅ API reference complete
- ✅ Deployment guide provided
- ✅ First-time setup guide provided
- ✅ Troubleshooting guide included

### Performance Met
- ✅ Page loads < 3 seconds
- ✅ API responses < 1 second
- ✅ Reports generate within reasonable time
- ✅ No memory leaks

### Security Met
- ✅ Passwords hashed
- ✅ Session tokens with expiration
- ✅ RBAC enforced at backend
- ✅ Input validation comprehensive
- ✅ No sensitive data in logs

---

## END OF AGENTS.md

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Maintained By**: [Development Team]  
**For Issues or Updates**: [Contact/Issue Link]
