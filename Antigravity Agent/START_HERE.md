# START_HERE.md - Complete Orientation & Setup Guide

**For AI Agents, Developers, and First-Time Users**

---

## 🎯 Quick Navigation

### I'm a Developer/AI Agent - Where do I start?
1. **Read this first**: [Understanding the Project](#project-overview)
2. **Setup**: [Environment Setup](#environment-setup)
3. **Build**: [Development Workflow](#development-workflow)
4. **Reference**: [AGENTS.md](AGENTS.md) - Complete agent instructions

### I'm a User - How do I use this app?
1. **Initial Setup**: [First-Time User Setup](#first-time-user-setup)
2. **Learn**: [Basic Operations](#basic-operations)
3. **Help**: [Troubleshooting](#troubleshooting--faq)

### I'm a System Admin - What's my checklist?
1. **Deploy**: [Deployment Steps](#deployment-steps)
2. **Configure**: [Post-Deployment Configuration](#post-deployment-configuration)
3. **Maintain**: [Maintenance & Monitoring](#maintenance--monitoring)

---

## 📋 Project Overview

### What is This?

**RBAC Multi-Page Web App** - A role-based access control (RBAC) enterprise application built entirely on Google Apps Script ecosystem.

**Built for**: Construction project managers, civil engineers, and construction teams in Mumbai/Thane region
**Language**: JavaScript (Google Apps Script backend) + HTML/CSS/JavaScript (Frontend)
**Database**: Google Sheets (acts as database)
**Storage**: Google Drive (file management)
**Notifications**: Gmail API (email notifications)
**AI**: Google Gemini 3 Pro (optional - data analysis & insights)

### Core Features

✅ **Role-Based Access Control (RBAC)**
- Admin: Full system access
- Manager: Create/edit projects, view reports
- User: Create entries, view own projects
- Viewer: Read-only access

✅ **User Management**
- Create/edit/delete users
- Assign roles and permissions
- Track user activity (audit logs)
- Password management

✅ **Data Entry System**
- Multi-field forms with validation
- Project/contract management
- Budget tracking (INR currency)
- Status tracking and workflows

✅ **Reporting & Analytics**
- Generate reports with filters
- Chart.js visualizations
- Export to PDF/Excel
- Optional AI-powered insights

✅ **File Management**
- Upload documents to Google Drive
- Share with team members
- Track file metadata
- Organize by projects

✅ **Audit & Security**
- Complete activity logging
- User action tracking
- Password hashing
- Session management

---

## 🛠️ Environment Setup

### Prerequisites

**For Development/Deployment**:
- Google Account (Gmail, Drive, Sheets access)
- Google Cloud Console project
- Modern web browser (Chrome, Firefox, Safari)
- Basic knowledge of:
  - Google Apps Script
  - Google Sheets structure
  - HTML/CSS/JavaScript (for frontend modifications)

**For End Users**:
- Google Account (for authentication)
- Modern web browser
- Internet connection

### Step-by-Step Setup

#### 1. Create Google Cloud Project
```
1. Go to https://console.cloud.google.com
2. Create new project: "RBAC-Web-App" (or your name)
3. Enable APIs:
   ✓ Google Drive API
   ✓ Gmail API
   ✓ Google Sheets API
   ✓ Generative AI API (optional - for Gemini)
```

#### 2. Create Google Apps Script Project
```
1. Go to https://script.google.com
2. Create new project: "RBAC-App-Backend"
3. Copy all 6-7 .gs files into the project:
   - Code.gs
   - Config.gs
   - Auth.gs
   - Database.gs
   - FileHandler.gs
   - Utils.gs
   - GeminiIntegration.gs (optional)
```

#### 3. Create Google Sheets Database
```
1. Create new Google Sheets spreadsheet: "RBAC-App-Database"
2. Create sheets with these names:
   ✓ Users (user accounts, roles)
   ✓ Projects (or DataEntries - main data)
   ✓ FileMetadata (uploaded files tracking)
   ✓ AuditLogs (activity tracking)
   ✓ Configuration (app settings)
3. See SHEET_SCHEMA.md for detailed schema
```

#### 4. Configure Google Apps Script
```
1. In Apps Script project, go to Settings
2. Add Script Properties:
   - SHEET_ID: [Your Sheets ID from URL]
   - SHEET_ID_BACKUP: [Backup Sheets ID - optional]
   - GEMINI_API_KEY: [Your Gemini API key - optional]
   - APP_NAME: [Your app name]
   - ADMIN_EMAIL: [Your email]
3. Save properties
```

#### 5. Add Initial Admin User
```
1. Open SHEET_ID spreadsheet > Users sheet
2. Manually add first row:
   - ID: 'admin-001'
   - Email: 'your-email@gmail.com'
   - Password: [Hashed - see Config.gs]
   - Name: 'Administrator'
   - Role: 'admin'
   - Active: TRUE
   - CreatedAt: [Today's date]
3. Note: Use hashed password value from Utils.gs hashPassword()
```

#### 6. Deploy as Web App
```
1. In Apps Script, click Deploy > New Deployment
2. Type: Web app
3. Execute as: Your Google Account
4. Who has access: Specific users (or Anyone)
5. Click Deploy
6. Copy the Deployment URL
7. Test URL - should load login page
```

---

## 👥 First-Time User Setup

### For Regular Users

#### Initial Login
```
1. Open deployment URL
2. You see Login page
3. Enter:
   Email: [Your Google email]
   Password: [Assigned by admin]
4. Click Login
5. You're now in Dashboard
```

#### First Actions
1. **Go to Profile** (top-right menu > Profile)
   - Update your name if needed
   - Change password if needed
   - Add department/division (optional)

2. **For Managers**: Go to Users
   - You can view your team members
   - Cannot modify (unless admin)

3. **Start Data Entry** (DataEntry menu)
   - Click "Add New Project" or "Add New Entry"
   - Fill in all required fields (marked with *)
   - Click Save
   - You'll see success message

4. **View Reports** (Reports menu)
   - Select report type (Summary/Detailed)
   - Set date range
   - Click Generate
   - See charts and tables
   - Export if needed

#### Understanding Roles

**Your Role Determines What You Can Do**:

| Feature | Admin | Manager | User | Viewer |
|---------|-------|---------|------|--------|
| View Dashboard | ✅ | ✅ | ✅ | ✅ |
| Create Entries | ✅ | ✅ | ✅ | ❌ |
| Edit Own Entries | ✅ | ✅ | ✅ | ❌ |
| Edit Others' Entries | ✅ | (team only) | ❌ | ❌ |
| Delete Entries | ✅ | (team only) | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ | ❌ |
| Generate Reports | ✅ | ✅ | ❌ | ✅ |
| View Audit Logs | ✅ | ❌ | ❌ | ❌ |
| Change App Settings | ✅ | ❌ | ❌ | ❌ |

---

## 👨‍💼 Administrator Setup Guide

### Admin-Only Tasks

#### 1. Create New Users
```
1. Login as Admin
2. Go to Users menu
3. Click "Add New User"
4. Enter:
   - Email: new-user@company.com
   - Name: User's Full Name
   - Role: Select (admin/manager/user/viewer)
   - Password: [Temporary password generated]
5. Click Create
6. User receives welcome email with login info
7. User should change password on first login
```

#### 2. Manage User Roles
```
1. Go to Users menu
2. Find user in table
3. Click Edit button
4. Change Role dropdown
5. Click Save
6. Change takes effect immediately
```

#### 3. Deactivate/Delete Users
```
1. Go to Users menu
2. Find user in table
3. Click Delete button
4. Confirm deletion
5. User account marked inactive (soft delete)
6. User cannot login
```

#### 4. Configure App Settings
```
1. Go to Settings menu (admin only)
2. Available settings:
   - App Name
   - Email notifications (on/off)
   - Report export format (PDF/Excel/CSV)
   - Feature flags (Gemini AI on/off)
   - Audit logging (on/off)
   - Session timeout (hours)
3. Update values
4. Click Save
5. Changes effective immediately
```

#### 5. View Audit Logs
```
1. Go to Settings menu
2. Click "View Audit Logs" tab
3. Filters available:
   - Date range
   - User email
   - Action type (create/update/delete)
   - Resource type (users/projects/files)
4. Review all user actions
5. Export logs if needed
```

#### 6. Backup Database
```
1. Go to Settings menu
2. Click "Backup Now" button
3. System creates backup:
   - Copies all sheets
   - Stores in /backups folder
   - Creates daily backups
4. View backup history
5. Restore if needed (manual process)
```

#### 7. Integration Testing
```
1. Create test user (role = 'user')
2. Login as test user
3. Verify permissions working:
   - Can create entries
   - Cannot delete others' entries
   - Cannot access Users menu
4. Logout as test user
5. Login as manager
6. Verify manager permissions
7. Delete test user when done
```

---

## 🔧 Development Workflow

### For AI Agents / Developers

See **[AGENTS.md](AGENTS.md)** for complete development instructions including:
- Architecture overview
- Backend .gs file specifications
- Frontend .html file specifications
- Build sequence and workflow
- Testing procedures
- Troubleshooting guide

### Quick Dev Setup

**1. Clone/Copy all project files**
```
Structure:
/rbac-web-app
  /backend         ← All .gs files
  /frontend        ← All .html files
  /docs            ← All .md documentation
  Config.gs
  Auth.gs
  ... (other .gs files)
```

**2. Update Config.gs**
```javascript
const SHEET_IDS = {
  users: 'YOUR_SHEET_ID_USERS',
  projects: 'YOUR_SHEET_ID_PROJECTS',
  // ... others
};
```

**3. Test locally in Apps Script IDE**
```javascript
// Test authentication
function testLogin() {
  const result = authenticateUser('admin@company.com', 'password');
  console.log(result);
}

// Run test: Ctrl+Enter in Apps Script IDE
```

**4. Deploy**
```
1. Save all files (Ctrl+S)
2. Deploy > New Deployment
3. Test deployment URL
4. Create admin account
5. Test core features
```

---

## 📊 Basic Operations

### Common User Tasks

#### Create a New Project Entry
```
1. Click "Data Entry" in menu
2. Fill form:
   Project Name: "Mumbai Tower Complex"
   Client: "ABC Real Estate Pvt Ltd"
   Start Date: [Select date]
   End Date: [Select date]
   Budget: 50,00,000 (INR)
   Status: Active
3. Click "Save"
4. See success message
5. Entry now in database
```

#### Edit Existing Entry
```
1. Go to "Data Entry" menu
2. Find your entry in list
3. Click Edit icon (pencil)
4. Modify fields
5. Click "Update"
6. See success message
```

#### Generate a Report
```
1. Click "Reports" menu
2. Select filters:
   Report Type: "Summary" or "Detailed"
   Date Range: [Start date] to [End date]
   Status Filter: (optional)
3. Click "Generate Report"
4. See data in table
5. Optional: Export to PDF/Excel
```

#### Upload a Document
```
1. In any page with file upload:
2. Click "Upload File" button
3. Select file from computer
4. Click "Open"
5. File uploads to Google Drive
6. Metadata saved to database
7. Confirmation message
```

#### Share Files with Team
```
1. Go to Reports > File Management
2. Find file you uploaded
3. Click Share button
4. Enter team member email
5. Select permission: Viewer or Editor
6. Click Share
7. Team member gets email with link
```

---

## 🐛 Troubleshooting & FAQ

### Login Issues

**Problem**: "Email not found" error
```
Solution:
1. Check spelling of email
2. Verify email is registered
3. Contact admin to add your account
4. Ensure email is active (not deactivated)
```

**Problem**: "Incorrect password" error
```
Solution:
1. Check CAPS LOCK is off
2. Try password again carefully
3. Click "Forgot Password" (if available)
4. Or contact admin to reset
```

**Problem**: "Permission denied" on login page
```
Solution:
1. Ensure Google account has access
2. Check if user role is "active"
3. Contact admin to verify account
```

### Data Entry Issues

**Problem**: "Required fields missing" validation error
```
Solution:
1. Check which fields marked with * (required)
2. Fill all * fields before submit
3. Special validations:
   - Email: Must be valid format
   - Date: Cannot be in future
   - Budget: Must be number (no letters)
4. Try again
```

**Problem**: "Duplicate entry" error
```
Solution:
1. You're trying to create entry that already exists
2. Either:
   a) Update existing entry (click Edit)
   b) Create new with different name/client
```

**Problem**: "Cannot save" - generic error
```
Solution:
1. Refresh browser (F5)
2. Try again
3. Check internet connection
4. Try different browser
5. Contact admin with error message
```

### File Upload Issues

**Problem**: "File too large" error
```
Solution:
File size limit: 25 MB
1. Compress the file
2. Split into multiple files
3. Or contact admin for quota increase
```

**Problem**: "Upload failed" after clicking Upload
```
Solution:
1. Check file type is allowed
2. Check file size < 25 MB
3. Try different file format
4. Try uploading via different browser
```

**Problem**: "Cannot download file"
```
Solution:
1. Check you have permission to access
2. If shared file, try accessing Drive directly
3. File may have been deleted - check with uploader
```

### Permission Issues

**Problem**: "You don't have permission to view this"
```
Solution:
1. Entry belongs to someone else (ask manager)
2. Your role doesn't allow access (ask admin)
3. Contact admin to request access
4. Changes take effect after refresh
```

**Problem**: "Cannot edit this entry"
```
Solution:
1. Only admins and managers can edit others' entries
2. You can only edit your own entries
3. Ask admin to make changes
4. Or ask manager (if manager has permission)
```

**Problem**: Cannot access Admin Settings
```
Solution:
1. Only admin role can access Settings
2. Request admin role from administrator
3. Or ask current admin to make changes
```

### Report Issues

**Problem**: "No data in report"
```
Solution:
1. Check date range - may have no entries
2. Try wider date range
3. Check filters - may be too restrictive
4. Entries may exist but status filtered out
```

**Problem**: "Report not generating / taking too long"
```
Solution:
1. Large reports take longer (5-10 seconds normal)
2. Try smaller date range
3. Refresh and try again
4. If persistently slow, contact admin
```

**Problem**: "Chart not displaying"
```
Solution:
1. Data may not support chart type
2. Too much/too little data
3. Try different report type
4. Try export instead of view
```

### Performance Issues

**Problem**: "Page loading very slowly"
```
Solution:
1. Check internet connection
2. Close other browser tabs
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try different browser
5. Try again at different time
```

**Problem**: "App keeps timing out"
```
Solution:
1. Google Apps Script has 6-minute timeout limit
2. Large operations may timeout
3. Reduce data range
4. Contact admin for optimization
```

### Browser Compatibility

**Not working in my browser?**
```
Supported Browsers:
✓ Chrome 90+
✓ Firefox 88+
✓ Safari 14+
✓ Edge 90+
✓ Mobile: Chrome, Safari

Solution:
1. Try latest version of browser
2. Clear cache and cookies
3. Disable browser extensions
4. Try different browser
5. Try private/incognito window
```

---

## 📞 Getting Help

### Support Channels

1. **Check Documentation First**
   - This file (START_HERE.md)
   - [QUICK_START.md](QUICK_START.md) - API reference
   - [SHEET_SCHEMA.md](SHEET_SCHEMA.md) - Database schema

2. **Contact Administrator**
   - Email: [Admin email address]
   - Phone: [Admin phone]
   - Available: [Business hours]

3. **Report a Bug**
   - Screenshot with error
   - Steps to reproduce
   - Your browser/OS
   - Email to admin

### Useful Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+S | Save form |
| Ctrl+F | Search/Find in page |
| Ctrl+Z | Undo (browser back) |
| Ctrl+L | Select URL bar |
| F5 | Refresh page |
| Ctrl+Shift+Delete | Clear cache |
| F12 | Open browser console |
| Tab | Next form field |
| Shift+Tab | Previous form field |
| Enter | Submit form (in form) |

---

## 📚 Documentation Reference

### Quick Links

| Document | Purpose | For Whom |
|----------|---------|----------|
| [AGENTS.md](AGENTS.md) | Complete dev guide | Developers, AI agents |
| [README.md](README.md) | Project overview | Everyone |
| [SHEET_SCHEMA.md](SHEET_SCHEMA.md) | Database structure | Developers, admins |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Setup instructions | DevOps, admins |
| [QUICK_START.md](QUICK_START.md) | API reference | Developers |
| [FILES_SUMMARY.md](FILES_SUMMARY.md) | File descriptions | Developers |
| [PACKAGE_CONTENTS.txt](PACKAGE_CONTENTS.txt) | File inventory | Everyone |
| [DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md) | QA checklist | Project managers |

---

## ✅ Verification Checklist

### After Deployment - Administrator Should Verify

- [ ] Login page loads
- [ ] Admin login works
- [ ] User creation works
- [ ] User login works
- [ ] Data entry form works
- [ ] Data displays in table
- [ ] Reports generate
- [ ] File upload works
- [ ] Logout works
- [ ] Session timeout works
- [ ] Permissions enforced
- [ ] Error messages display properly

---

## 🎓 Training Materials

### For New Admins (30 minutes)
1. User roles and permissions (5 min)
2. Creating users (5 min)
3. Managing permissions (5 min)
4. Backup and recovery (5 min)
5. Troubleshooting (5 min)
6. Hands-on practice (5 min)

### For New Users (15 minutes)
1. Login and initial setup (2 min)
2. Navigating the app (3 min)
3. Creating entries (5 min)
4. Viewing reports (3 min)
5. Help resources (2 min)

---

## 🔐 Security Tips for Users

- **Change password** after first login
- **Never share** your login credentials
- **Logout** when done (especially on shared computers)
- **Report** suspicious activity to admin
- **Don't store** passwords in plain text
- **Use strong passwords**: Mix of letters, numbers, symbols
- **Verify SSL** (https://) before entering credentials

---

## 📈 Next Steps

### Day 1 (Setup)
- ✅ Deploy app
- ✅ Create admin account
- ✅ Verify basic functionality

### Week 1 (Onboarding)
- ✅ Create initial users
- ✅ Assign roles
- ✅ Conduct user training
- ✅ Start data entry

### Month 1 (Stabilization)
- ✅ Monitor for issues
- ✅ Gather user feedback
- ✅ Create backup strategy
- ✅ Refine processes

### Ongoing (Operations)
- ✅ Regular backups
- ✅ Performance monitoring
- ✅ Security updates
- ✅ Feature enhancements

---

## 📞 Support Contacts

**Primary Administrator**
- Name: [Name]
- Email: [Email]
- Phone: [Phone]
- Availability: [Hours]

**Secondary Contact**
- Name: [Name]
- Email: [Email]
- Phone: [Phone]

**Emergency Support**
- Email: [Emergency email]
- Phone: [Emergency phone]

---

## Version Information

| Item | Details |
|------|---------|
| App Version | 1.0.0 |
| Created | January 2026 |
| Last Updated | January 20, 2026 |
| Maintained By | Development Team |
| Next Review | Quarterly |

---

**Document Complete!**

### Ready to get started?
→ [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for setup  
→ [AGENTS.md](AGENTS.md) for development  
→ [QUICK_START.md](QUICK_START.md) for API reference  
→ Back to [Overview](#-quick-navigation) for more help

