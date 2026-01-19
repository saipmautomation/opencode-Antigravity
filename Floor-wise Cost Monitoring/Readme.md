<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Create a professional, production-ready web application for Floor-Wise Cost Monitoring of a high-rise building construction site in Mumbai. The application must enable real-time budget tracking, cost variance analysis, and financial forecasting across multiple floors of a multi-story construction project.

Target Users
Project Managers - Monitor overall project budget health and floor-wise performance
Cost Engineers - Track detailed cost variances, analyze spending patterns, and generate forecasts
Site Supervisors - View floor-specific costs and progress updates
Finance Teams - Access comprehensive reporting and budget-to-actual comparisons
Senior Management - Review executive dashboards with KPIs and cost analytics
Deployment Context
Location: Mumbai (high-rise building construction site)
Access: Desktop (primary), Mobile devices (secondary - full functionality)
Data Source: Initial data via CSV import; later extensible to backend APIs
Audience: Internal construction team (5-15 concurrent users estimated)
Core Features \& Functionality

1. Dashboard Module
Primary Purpose: Provide executive-level overview of project cost health
Key Elements:
Project Summary Card: Display total project budget, total spent, remaining budget, budget utilization percentage, and completion status
Cost Variance Indicator: Show variance amount (budgeted vs actual) with color coding:
Green: Within budget (0-5% variance)
Yellow: Minor overrun (5-15% variance)
Red: Significant overrun (>15% variance)
Key Performance Indicators (KPIs):
Cost Performance Index (CPI) - Earned Value Management metric
Schedule Performance Index (SPI) - Project progress against timeline
Projected Final Cost (EAC) - Estimated cost at project completion
Cost Trend Indicator - Upward/downward trend visualization
Monthly Burn Rate Chart: Line chart showing cumulative spending trend month-over-month with budget baseline overlay
Top 5 Floors by Variance: Table highlighting floors with largest cost deviations
Cost Distribution Pie Chart: Break down costs by category (Labor, Materials, Equipment, Services, Permits/Compliance)
Alerts Widget: Display active alerts (budget exceeded, upcoming milestones, pending approvals)
2. Floor-Wise Cost Tracking Module
Primary Purpose: Enable detailed tracking of costs at individual floor level
Data Table with DataTables Integration:
Columns:
Floor Number/Name (searchable)
Phase/Stage (Foundation, Structure, MEP, Finishing, etc.)
Progress % (visual progress bar)
Budgeted Cost (currency formatted)
Actual Spent (currency formatted)
Committed Cost (includes pending invoices, orders)
Variance Amount and % (with conditional color coding)
Remaining Budget (calculated)
Cost Status (On Track / Warning / Critical)
Actions (View Details, Edit Budget, View Transactions)
Features:
Sorting \& Filtering: Sort by any column; filter by phase, status, or variance range
Search Functionality: Quick search by floor name or number
Pagination: Handle 50+ floors with efficient pagination (25 rows per page default)
Column Visibility Toggle: Allow users to show/hide columns based on preference
Export Capability: Export filtered/sorted data to CSV or Excel format
Responsive Design: Table scrolls horizontally on mobile; columns adjust based on screen size
3. Detailed Floor Analysis Module
Primary Purpose: Deep-dive into individual floor cost breakdown
Triggered by: Clicking "View Details" action in Floor-Wise table
Content:
Floor Header: Floor name, phase, completion %, last updated timestamp
Budget vs Actual Comparison Chart: Horizontal bar chart comparing budgeted vs actual costs
Cost Breakdown by Category:
Tabular view with: Category, Budgeted, Actual, Variance, % of Floor Budget
Categories: Labor, Materials, Equipment, Subcontractor Services, Permits \& Compliance, Contingency, Other
Transaction History:
DataTable with: Date, Transaction Type (Invoice, Purchase Order, Timesheet), Description, Amount, Category, Status, Approver
Searchable and filterable
Option to view/download supporting documents (PDFs, receipts)
Cost Trend Chart: Line chart showing cumulative cost progression from project start to current date vs budgeted trend line
Variance Analysis:
Visual breakdown showing which categories contributed to variance
Root cause notes (editable for authorized users)
Corrective actions logged with dates and responsible parties
4. Budget Management Module
Primary Purpose: Create, modify, and approve budget allocations
Features:
Add New Floor Budget: Form to input floor number, phase, initial budget allocation, start/end dates
Edit Floor Budget:
Modify budgeted amounts (with change history logged)
Add contingency allocation
Update phase timeline
Change request workflow (with approval gates for >5% changes)
Budget Reallocation: Move funds between floors/categories with justification and approval tracking
Budget Templates: Save and reuse budget structures for similar floors/phases
Approval Workflow:
Budget changes exceeding threshold require manager approval
Notification system to approvers
Audit trail of all modifications
5. Reporting Module
Primary Purpose: Generate comprehensive reports for stakeholders
Report Types:
Monthly Cost Summary: Aggregate costs by floor, category, and phase with variance analysis
Budget vs Actual Report: Detailed comparison across all dimensions
Cost Forecast Report: Project final costs based on current spending trends (EAC)
Variance Analysis Report: Identify outliers and trends in cost overruns
Cash Flow Projection: Forecast cash outflows for upcoming months
Contingency Status Report: Track contingency fund usage and remaining reserves
Progress Report: Floor completion % with associated costs
Custom Reports: Allow users to select metrics, dimensions, and date ranges for custom analysis
Report Features:
PDF Export: Generate downloadable PDF reports with charts and tables
Scheduled Reports: Set up automated report generation (daily, weekly, monthly)
Comparison: Compare current period with previous periods
Data Visualization: Charts, graphs, and visual summaries included in reports
Signature Block: Space for project manager and finance lead approvals (PDF only)
6. Data Management Module
Primary Purpose: Handle data import, validation, and maintenance
Features:
CSV Import: Upload floor cost data with validation
Supported format: Floor Number, Phase, Budgeted Amount, Actual Spent, Category
Validation rules: Duplicate checks, currency format validation, missing field detection
Preview before import with error reporting
Batch import capability
Data Validation Rules: Automatic checks for data integrity
Backup \& Restore: Option to backup current data and restore previous versions
User Audit Trail: Log all data modifications with user, timestamp, and change details
7. User Roles \& Permissions
Role Hierarchy:
Admin: Full access - manage users, system settings, data management, approval authority
Project Manager: View all floors, approve budget changes, access all reports, manage floor details
Cost Engineer: View/analyze costs, generate reports, flag variances, cannot approve budgets >10K
Site Supervisor: View only assigned floors, update progress/actual costs, log transactions
Finance: View-only access to financial data, can export reports, cannot modify budgets
Viewer: Read-only dashboard and basic reports
Permission Matrix: Define read/write/delete/approve permissions for each role across all modules
Technical Specifications
Technology Stack (As Specified)
HTML5: Semantic markup for accessibility and SEO
CSS3: Responsive design with modern layout techniques (Flexbox, CSS Grid)
JavaScript (ES6+): Core application logic, state management, DOM manipulation
jQuery: DOM manipulation and event handling (leverage jQuery for Bootstrap integration)
DataTables: Advanced table management with sorting, filtering, pagination, search
Bootstrap 5: Responsive grid system, pre-built components, responsive utilities
Bootstrap Icons: Consistent iconography throughout the application
Chart.js: Data visualization (line, bar, pie, doughnut charts)
SweetAlert2: User-friendly alerts, confirmations, and modal dialogs
Architecture \& Code Organization
Single Page Application (SPA): Build using modular JavaScript with event-driven architecture
Module Pattern: Organize code into logical modules (Dashboard, FloorTracking, Reports, etc.)
State Management: Implement local state management for current user, selected floor, filters, etc.
API Simulation Layer: Create mock API functions (ready to replace with real backend calls later)
Service Layer: Encapsulate data operations (fetch, validate, transform, persist)
UI Component Layer: Reusable components for common patterns (alerts, modals, cards, buttons)
Data Structure \& Schema
Core Entities:
text
Project
├─ Project ID, Name, Location, Start Date, End Date, Total Budget
├─ Floors[] (array of floor objects)
└─ Categories[] (predefined cost categories)

Floor
├─ Floor ID, Floor Name/Number, Phase, Progress %
├─ Budget: {Budgeted Amount, Actual Spent, Committed, Remaining}
├─ Transactions[] (array of cost transactions)
└─ Timeline: {Start Date, Estimated Completion}

Transaction
├─ Transaction ID, Type (Invoice/PO/Timesheet)
├─ Date, Amount, Category, Description
├─ Status (Pending/Approved/Rejected), Approver
└─ Attachments[] (file references)

Category
├─ Category ID, Name, Description
└─ Budget Allocation Rules (min, max, flags)

User
├─ User ID, Name, Email, Role
└─ Permissions[] (based on role)

Client-Side Data Persistence
Browser LocalStorage: Store user preferences (selected floor, table columns visibility, dashboard layout)
Session Storage: Store temporary data (current filters, pagination state)
In-Memory State: Primary data (floors, transactions) managed in JavaScript objects
CSV Export/Import: Enable data portability and backup
Responsive Design Specifications
Breakpoints:
Mobile: <576px (Bootstrap SM)
Tablet: 576px - 991px (Bootstrap MD-LG)
Desktop: 992px+ (Bootstrap XL)
Mobile-First Approach:
Touch-friendly buttons (minimum 44x44px)
Vertical layout for mobile with collapsible sections
Single-column layout for small screens
Horizontal scrolling tables (with freeze first column on mobile)
Off-canvas navigation menu on mobile
Tablet Layout:
Two-column dashboard on tablets
Full DataTables with responsive extensions
Desktop Layout:
Full multi-column layouts
Side-by-side charts and tables
Floating action buttons for quick actions
Performance Optimization
Lazy Loading: Load charts and tables only when visible
Debouncing: Debounce search/filter inputs to reduce computation
Memoization: Cache computed values (totals, percentages, variance calculations)
Bundle Size: Keep CSS and JS optimized (no unnecessary libraries)
Image Optimization: Use SVG icons from Bootstrap Icons (scalable, lightweight)
UI/UX Design Guidelines
Design Principles
Professional Aesthetic: Corporate color scheme suitable for construction industry
Clear Information Hierarchy: Most important data prominent, secondary data accessible
Visual Consistency: Uniform component styling, spacing, typography throughout
Accessibility: WCAG 2.1 AA compliance (color contrast, keyboard navigation, screen reader support)
User Feedback: Every action provides visual feedback (loading states, success/error messages, confirmation dialogs)
Data-Driven Design: Charts and visualizations tell the story of project finances
Color Scheme
Primary Color: Professional teal/blue (\#2C7A7B or similar) - represents trust and stability
Accent Colors:
Green (\#22C55E): Success, within budget, positive trend
Yellow/Amber (\#F59E0B): Warning, minor variance, caution
Red (\#EF4444): Critical, budget exceeded, requires action
Gray (\#6B7280): Neutral, disabled, secondary information
Background: Clean white (\#FFFFFF) or light gray (\#F9FAFB)
Text: Dark gray (\#1F2937) for primary text, medium gray (\#6B7280) for secondary
Borders: Light gray (\#E5E7EB) for subtle boundaries
Typography
Headings: Bold, clear hierarchy (H1: 32px, H2: 24px, H3: 20px, H4: 16px)
Body Text: 14px for main content, 12px for secondary information
Monospace: For currency values, ID numbers (use Bootstrap's font stack)
Font Family: System fonts (San Francisco, Segoe UI, Roboto) for optimal readability
Component Design
Cards: Subtle shadow, rounded corners (8px), padding (16px), white background with hover lift effect
Buttons:
Primary: Solid color with white text
Secondary: Outline or ghost style
Danger: Red background for destructive actions
Minimum 44x44px touch target
Loading state with spinner
Input Fields:
Clear border, 8px border-radius
Focus state with blue outline
Helper text for validation
Error states with red border and error message
Tables:
Alternating row colors (light gray) for readability
Hover state highlighting
Action icons in last column
Responsive mode on mobile (card-like layout)
Charts:
Consistent color palette matching app theme
Legends clearly labeled
Tooltips on hover showing exact values
Responsive sizing
Navigation
Primary Navigation: Horizontal navbar at top with logo, main menu items, user profile dropdown
Secondary Navigation: Sidebar or breadcrumbs for sub-sections
Mobile Navigation: Hamburger menu collapsing to off-canvas drawer
Breadcrumbs: Show current location (Project > Floor 5 > Details)
Active States: Highlight current page in navigation
Spacing \& Layout
Grid System: Bootstrap 5 grid (12-column) for consistent layout
Whitespace: 16px base unit (8px, 16px, 24px, 32px spacing scale)
Margins: 16-24px between major sections
Padding: 12-16px inside cards and containers
Gap: 8-16px between grid items
Interactive States
Hover: Subtle color change, shadow, or background tint
Focus: Blue outline (2-3px) for keyboard navigation
Active/Selected: Bold text or background color change
Disabled: Reduced opacity (50%), no cursor pointer
Loading: Spinner animation or skeleton loaders
Empty States: Clear messaging with icon and call-to-action if no data
Accessibility Features
Semantic HTML: Proper heading structure, form labels, ARIA attributes
Keyboard Navigation: Full functionality via Tab, Enter, Escape keys
Screen Reader Support: Alt text for images, ARIA live regions for dynamic content
Color Contrast: Minimum 4.5:1 for text, visual indicators beyond color alone
Focus Management: Clear focus indicators, logical tab order
Skip Links: Option to skip navigation and jump to main content
User Workflows \& Interactions
Workflow 1: Daily Cost Entry (Site Supervisor)
Log into application
Select assigned floor from dashboard or navigation
Click "Add Transaction" button
Fill form: Transaction Type, Date, Amount, Category, Description, Attachments
Submit transaction (auto-calculates variance impact)
Receive confirmation alert
Transaction appears in Transaction History with "Pending Approval" status
Manager receives notification for approval
Once approved, actual cost updates immediately in floor summary and dashboard
Workflow 2: Weekly Variance Analysis (Cost Engineer)
Access Dashboard to review cost health
Identify floor with yellow/red variance indicator
Click "View Details" on that floor
Review Variance Analysis section to identify problem categories
Drill down into Transaction History for that category
Analyze transactions to find root causes
Document findings in Variance Analysis notes
Generate custom report for this floor's variance
Export as PDF and email to project manager
Workflow 3: Monthly Budget Reallocation (Project Manager)
Generate "Cost Forecast Report" from Reports module
Identify floors/categories where contingency is needed
Access Budget Management module
Create "Budget Reallocation" request:
Source floor/category with surplus
Destination floor/category needing funds
Justification
Impact analysis (new projected costs)
Submit for approval (if >5% change)
Finance approves in notification center
Budgeted amounts update, historical change logged
Notification sent to affected floor supervisors
Workflow 4: Executive Reporting (Senior Management)
Access Dashboard
Review KPI cards (CPI, SPI, EAC, Trend)
Check monthly burn rate trend chart
Review top 5 floors by variance
Click "Generate Report" button
Select "Monthly Cost Summary" report type
Choose date range and comparables
View generated PDF with charts and tables
Download and distribute to stakeholders
Data Validation \& Business Rules
Input Validation
Currency Fields: Positive numbers only, max 2 decimal places, format as INR (Indian Rupees)
Dates: Valid date format, end date > start date, within project timeline
Floor Numbers: Alphanumeric, unique per project
Percentages: 0-100 range
Required Fields: Flagged with asterisk, validated before submission
File Uploads: Max 5MB, supported formats (PDF, JPG, PNG, XLSX)
Business Rules
Budget Lock: Cannot modify historical budgets older than 30 days (admin override available)
Variance Alerts: Auto-trigger when floor variance exceeds 15% threshold
Commitment Visibility: Committed costs (POs not yet invoiced) included in "Remaining Budget" calculation
Contingency Rules: Contingency can only be reallocated by Project Manager or higher
Approval Thresholds:
Budget changes <5%: Supervisor approval
Budget changes 5-10%: Manager approval
Budget changes >10%: Senior Manager approval
Transaction Sequencing: Later transaction dates cannot be entered before earlier dates (within reason)
Data Integrity: No orphaned transactions (must be linked to valid floor/category)
Alerts \& Notifications
System Alerts (In-App)
Budget Exceeded: Floor actual costs > budgeted by >5%
Upcoming Milestone: Floor phase deadline within 7 days
Pending Approvals: Outstanding budget changes or transactions awaiting approval
High Contingency Usage: Contingency fund >80% consumed
Unusual Transactions: Variance >20% from average for category
Notification Center
List of all alerts with timestamps
Filter by alert type and floor
Mark as read/unread
Archive resolved alerts
Toast notifications for new high-priority alerts (appear in bottom-right)
Alert Severity Levels
Critical (Red): Immediate action required (budget exceeded, approval pending >3 days)
Warning (Yellow): Requires attention this week (threshold approaching, variance >15%)
Info (Blue): Informational updates (transaction approved, report generated)
Testing \& Quality Assurance
Functional Testing Scenarios
Data Import: CSV with various data formats, error handling, validation
Floor Tracking: Add/edit/delete floors, verify calculations, check data persistence
Transactions: Create, approve, reject transactions; verify impact on summary
Reports: Generate all report types with various filters and date ranges
User Roles: Verify permissions restrictions for each role
Mobile Responsiveness: Test on iPhone SE, iPad, Android devices
Cross-Browser: Test on Chrome, Firefox, Safari, Edge
Performance Testing
Page load time <2 seconds
DataTable operations (sort/filter/search) responsive on 1000+ rows
Chart rendering smooth with 12+ months of data
No memory leaks after extended usage (8+ hours)
Accessibility Testing
WCAG 2.1 AA compliance verification
Keyboard navigation of all features
Screen reader testing (NVDA, JAWS)
Color contrast validation
Deployment \& Maintenance
Build \& Optimization
Minify CSS and JavaScript
Combine vendor libraries efficiently
Optimize images and icons
Generate source maps for debugging
Implement service worker for offline capability (optional, future enhancement)
Browser Compatibility
Chrome 90+
Firefox 88+
Safari 14+
Edge 90+
Mobile browsers (iOS Safari 14+, Chrome Android 90+)
Documentation
User Guide: Step-by-step instructions for each workflow with screenshots
Admin Guide: User management, system settings, data backup procedures
Technical Documentation: Code comments, API layer documentation, setup instructions
Training Videos: Screen recordings of common tasks (optional)
Future Enhancement Roadmap
Phase 2 Features (Post-MVP)
Backend Integration: Replace mock API with REST/GraphQL backend (Node.js, Python, PHP)
Real-Time Collaboration: WebSocket support for live cost updates
Predictive Analytics: ML-based cost forecasting beyond simple EAC
Mobile Native App: React Native or Flutter version
Document Management: Integrated file storage (AWS S3, Google Drive)
Integration APIs: Connect with accounting software (Tally, QuickBooks), project management tools
Advanced Visualizations: 3D floor layouts with cost overlays, Gantt charts
Notifications: Email/SMS alerts for critical cost events
Multi-Project Dashboard: Portfolio view across multiple projects
Phase 3 Features (Future)
Offline Mode: Full functionality without internet (sync when online)
IoT Integration: Real-time cost tracking from site sensors
AI Chatbot: Natural language queries on cost data
Blockchain: Immutable audit trail for compliance

I've created a **production-ready, comprehensive Floor-Wise Cost Monitoring Application** for high-rise construction projects in Mumbai. Here's what you're getting:

## 🎯 **Key Features Implemented**

### **1. Executive Dashboard**

- **Project Summary Card** with budget, spent, remaining, and utilization metrics
- **KPI Cards** showing CPI (Cost Performance Index), SPI (Schedule Performance Index), EAC (Estimated at Completion), and cost trends
- **Monthly Burn Rate Chart** with budget baseline overlay
- **Cost Distribution Pie Chart** by category (Labor, Materials, Equipment, Services, Permits)
- **Top 5 Floors by Variance** table with status badges
- **Active Alerts Widget** for budget overruns and pending approvals


### **2. Floor-Wise Cost Tracking**

- **Advanced DataTable** with sorting, filtering, and pagination
- Columns: Floor, Phase, Progress %, Budgeted, Actual, Committed, Variance, Remaining, Status
- **Responsive design** with column visibility toggle
- Quick actions: View Details, Add Transaction
- Color-coded variance status (Green/Yellow/Red)


### **3. Detailed Floor Analysis**

- **Budget vs Actual Comparison** horizontal bar chart
- **Cost Trend** line chart with budgeted baseline
- **Category-wise Cost Breakdown** with variance analysis
- **Transaction History** with status tracking
- **Variance Analysis Notes** for root cause documentation


### **4. Budget Management**

- **Budget allocation summary** with pool and reserve tracking
- **Reallocation workflow** with justification
- Budget modification tracking with approval gates
- Historical change logging


### **5. Reports Module**

- **Pre-built Reports**: Monthly Summary, Budget vs Actual, Forecast, Variance Analysis
- **Custom Report Builder** with date ranges and comparable selection
- **PDF Export capability** for stakeholder distribution
- Multi-dimensional reporting (by floor, category, phase)


### **6. Data Management**

- **CSV Import** with validation and preview
- **Backup \& Restore** functionality (JSON format)
- **Data Audit Trail** logging all changes with user/timestamp
- Full data portability


### **7. User Interface**

- **Professional dark/teal color scheme** suitable for construction industry
- **Responsive design** for desktop and mobile devices
- **Bootstrap 5 + DataTables + Chart.js** for professional components
- **SweetAlert2** for user-friendly notifications
- Keyboard navigation and accessibility support


## 💾 **Data Persistence**

- **Browser LocalStorage** for data persistence across sessions
- Sample data included for immediate demonstration
- Automatic audit trail logging of all operations


## 🔐 **Role-Based Design** (Ready for backend integration)

- Admin, Project Manager, Cost Engineer, Site Supervisor, Finance, Viewer roles
- Permission matrix structure for multi-user deployments


## 📊 **Advanced Calculations**

- **Cost Performance Index (CPI)** = Earned Value / Actual Cost
- **Schedule Performance Index (SPI)** = Earned Value / Planned Value
- **Estimate at Completion (EAC)** = Total Budget / CPI
- **Variance Analysis** with percentage and absolute calculations


## 🚀 **Production-Ready Features**

✅ No external API dependencies (works offline)
✅ Responsive design for all screen sizes
✅ Error handling and validation
✅ Data import/export capabilities
✅ Complete audit trail
✅ Professional documentation in code
✅ Expandable module architecture
✅ Ready for backend API integration

## 📝 **Next Steps for Deployment**

1. Replace LocalStorage with backend database (PostgreSQL/MongoDB)
2. Add REST API endpoints for data persistence
3. Implement user authentication with role management
4. Set up real-time WebSocket for collaborative updates
5. Add email notifications for alerts
6. Integrate with accounting software (Tally, QuickBooks)
7. Deploy to server (AWS, Azure, or on-premises)

The application is **fully functional** with sample data loaded and ready for immediate use!
<span style="display:none">[^1][^10][^11][^12][^13][^14][^15][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://icmai.in/upload/Students/Syllabus2016/Inter/Paper-9-Sep-2021.pdf

[^2]: https://internshala.com/jobs/workforce-management-analyst-wfm-scheduler-rta-pla-jobs-in-mumbai/

[^3]: https://www.mod.gov.in/dod/sites/default/files/DPM2009.pdf

[^4]: https://cgda.nic.in/ifa/ifabr_manual.pdf

[^5]: https://www.icsi.edu/WebModules/Publications/FULL_BOOK_PP-CMA-2017-JULY_4.pdf

[^6]: https://outbooks.com/blog/cost-control-in-construction/

[^7]: https://wpdatatables.com/documentation/table-features/advanced-filtering/

[^8]: https://www.reddit.com/r/react/comments/1dgdr62/how_to_make_a_chartjs_chart_responsive_with_fixed/

[^9]: https://www.sail.co.in/sites/default/files/ticker/2024-09/SAIL_Annual_Report2023-24.pdf

[^10]: https://amsindia.co.in/cost-optimization-in-construction-strategies-for-2025/

[^11]: https://datatables.net/examples/plug-ins/sorting_auto.html

[^12]: https://www.chartjs.org/docs/latest/configuration/responsive.html

[^13]: https://sunpharma.com/wp-content/uploads/2024/07/SPIL-Annual-Report-2023-24.pdf

[^14]: https://www.smartsheet.com/content/construction-cost-management

[^15]: https://datatables.net/examples/plug-ins/range_filtering.html

