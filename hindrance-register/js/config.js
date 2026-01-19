/**
 * Hindrance Register - Configuration Module
 * Application constants and configuration settings
 */

const APP_CONFIG = {
    // Application Info
    APP_NAME: 'Hindrance Register',
    APP_VERSION: '1.0.0',
    APP_DESCRIPTION: 'Construction Project Management System',
    
    // Storage Keys
    STORAGE_KEYS: {
        HINDRANCES: 'hr_hindrances',
        USERS: 'hr_users',
        PROJECT_CONFIG: 'hr_project_config',
        SYSTEM_CONFIG: 'hr_system_config',
        AUDIT_LOG: 'hr_audit_log',
        CURRENT_USER: 'hr_current_user',
        REMEMBER_ME: 'hr_remember_me',
        THEME: 'hr_theme',
        ATTACHMENTS_DB: 'HindranceAttachmentsDB',
        FORM_DRAFT: 'hr_form_draft',
        LAST_BACKUP: 'hr_last_backup'
    },
    
    // Default Project Configuration
    DEFAULT_PROJECT: {
        projectName: 'Mumbai High-Rise Construction Project',
        location: 'Mumbai, Maharashtra, India',
        contractNo: 'MHR-2024-001',
        agreementDate: '2024-01-15',
        contractorName: 'ABC Construction Pvt. Ltd.',
        clientName: 'XYZ Developers',
        commencementDate: '2024-02-01',
        completionDate: '2026-01-31',
        contractAmount: 500000000
    },
    
    // Default System Configuration
    DEFAULT_SYSTEM: {
        slaThresholdDays: 5,
        approvers: ['Mr. Rajesh Kumar', 'Ms. Priya Sharma', 'Mr. Anil Patel'],
        darkMode: false,
        autoBackup: true,
        dateFormat: 'DD-MM-YYYY',
        currency: 'INR',
        currencySymbol: '₹'
    },
    
    // Default Users
    DEFAULT_USERS: [
        {
            id: 'user_001',
            username: 'admin',
            password: 'admin123', // In production, this should be hashed
            fullName: 'Administrator',
            role: 'admin',
            active: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            lastLogin: null
        },
        {
            id: 'user_002',
            username: 'site_incharge',
            password: 'site123',
            fullName: 'Rajesh Kumar',
            role: 'site_incharge',
            active: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            lastLogin: null
        },
        {
            id: 'user_003',
            username: 'supervisor',
            password: 'super123',
            fullName: 'Amit Singh',
            role: 'supervisor',
            active: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            lastLogin: null
        },
        {
            id: 'user_004',
            username: 'consultant',
            password: 'consult123',
            fullName: 'Priya Sharma',
            role: 'consultant',
            active: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            lastLogin: null
        }
    ],
    
    // User Roles and Permissions
    ROLES: {
        admin: {
            label: 'Admin',
            permissions: ['create', 'read', 'update', 'delete', 'approve', 'manage_users', 'export', 'settings']
        },
        site_incharge: {
            label: 'Site In-Charge',
            permissions: ['create', 'read', 'update', 'delete', 'approve', 'export', 'settings']
        },
        supervisor: {
            label: 'Supervisor',
            permissions: ['create', 'read', 'update', 'export']
        },
        consultant: {
            label: 'Consultant',
            permissions: ['read', 'add_remarks', 'export']
        }
    },
    
    // Hindrance Categories
    HINDRANCE_CATEGORIES: [
        { value: 'Raw Material Unavailability', label: 'Raw Material Unavailability' },
        { value: 'Labour Shortage', label: 'Labour Shortage' },
        { value: 'Equipment Breakdown', label: 'Equipment Breakdown/Non-availability' },
        { value: 'Weather/External Conditions', label: 'Weather/External Conditions' },
        { value: 'Design Clarification Pending', label: 'Design Clarification Pending' },
        { value: 'Inspection/Approval Pending', label: 'Inspection/Approval Pending' },
        { value: 'Utility Connection Issues', label: 'Utility Connection Issues' },
        { value: 'Access Route Issues', label: 'Access Route Issues' },
        { value: 'Safety/Compliance Hold', label: 'Safety/Compliance Hold' },
        { value: 'Third-Party Dependency', label: 'Third-Party Dependency' },
        { value: 'Contractual/Payment Issues', label: 'Contractual/Payment Issues' },
        { value: 'Other', label: 'Other' }
    ],
    
    // Work Phases
    WORK_PHASES: [
        { value: 'Foundation & Excavation', label: 'Foundation & Excavation' },
        { value: 'Structural Frame', label: 'Structural Frame (Columns, Beams, Slabs)' },
        { value: 'Reinforcement & Concrete', label: 'Reinforcement & Concrete Works' },
        { value: 'Masonry & External', label: 'Masonry & External Works' },
        { value: 'MEP', label: 'MEP (Mechanical, Electrical, Plumbing)' },
        { value: 'Architectural Finishing', label: 'Architectural Finishing' },
        { value: 'Curtain Wall/Glazing', label: 'Curtain Wall/Glazing' },
        { value: 'Interior Fit-out', label: 'Interior Fit-out' }
    ],
    
    // Responsibility Parties
    RESPONSIBILITY_PARTIES: [
        { value: 'Contractor', label: 'Contractor' },
        { value: 'Client/Consultant', label: 'Client/Consultant' },
        { value: 'Third Party/External', label: 'Third Party/External' },
        { value: 'Force Majeure', label: 'Force Majeure' }
    ],
    
    // Severity Levels
    SEVERITY_LEVELS: [
        { value: 'Critical', label: 'Critical', color: '#DC3545' },
        { value: 'High', label: 'High', color: '#FD7E14' },
        { value: 'Medium', label: 'Medium', color: '#FFC107' },
        { value: 'Low', label: 'Low', color: '#20C997' }
    ],
    
    // Status Options
    STATUS_OPTIONS: [
        { value: 'Active', label: 'Active', color: '#FFC107', bgClass: 'badge-status-active' },
        { value: 'Resolved', label: 'Resolved', color: '#28A745', bgClass: 'badge-status-resolved' },
        { value: 'Overdue', label: 'Overdue', color: '#DC3545', bgClass: 'badge-status-overdue' },
        { value: 'Pending Approval', label: 'Pending Approval', color: '#6C757D', bgClass: 'badge-status-pending' }
    ],
    
    // File Upload Configuration
    FILE_CONFIG: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']
    },
    
    // DataTable Configuration
    DATATABLE_CONFIG: {
        pageLength: 25,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        responsive: true,
        stateSave: true,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
             '<"row"<"col-sm-12"tr>>' +
             '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Search records...",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ records",
            infoEmpty: "No records available",
            infoFiltered: "(filtered from _MAX_ total records)",
            zeroRecords: "No matching records found",
            paginate: {
                first: '<i class="bi bi-chevron-double-left"></i>',
                previous: '<i class="bi bi-chevron-left"></i>',
                next: '<i class="bi bi-chevron-right"></i>',
                last: '<i class="bi bi-chevron-double-right"></i>'
            }
        }
    },
    
    // Chart.js Default Configuration
    CHART_CONFIG: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 13
                },
                bodyFont: {
                    size: 12
                },
                padding: 12,
                cornerRadius: 8
            }
        }
    },
    
    // Chart Colors
    CHART_COLORS: {
        primary: '#008B8B',
        secondary: '#20B2AA',
        success: '#28A745',
        warning: '#FFC107',
        danger: '#DC3545',
        info: '#17A2B8',
        purple: '#6F42C1',
        pink: '#E83E8C',
        orange: '#FD7E14',
        teal: '#20C997',
        palette: [
            '#008B8B', '#20B2AA', '#28A745', '#FFC107', 
            '#DC3545', '#17A2B8', '#6F42C1', '#FD7E14'
        ]
    },
    
    // Auto-save Interval (ms)
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds
    
    // Debounce Delay (ms)
    DEBOUNCE_DELAY: 300,
    
    // Toast Duration (ms)
    TOAST_DURATION: 3000,
    
    // Date Format Options
    DATE_FORMATS: {
        display: 'DD-MM-YYYY',
        storage: 'YYYY-MM-DD',
        displayFull: 'DD MMMM YYYY',
        displayWithTime: 'DD-MM-YYYY HH:mm'
    },
    
    // Compliance Standards
    COMPLIANCE: {
        standard: 'IS 15883-2',
        description: 'Indian Standard for Construction Project Management',
        nbc: 'National Building Code of India',
        railway: 'Indian Railway Standards for Hindrance Documentation'
    }
};

// Make configuration immutable
Object.freeze(APP_CONFIG);
Object.freeze(APP_CONFIG.STORAGE_KEYS);
Object.freeze(APP_CONFIG.DEFAULT_PROJECT);
Object.freeze(APP_CONFIG.DEFAULT_SYSTEM);
Object.freeze(APP_CONFIG.ROLES);
Object.freeze(APP_CONFIG.FILE_CONFIG);
Object.freeze(APP_CONFIG.DATATABLE_CONFIG);
Object.freeze(APP_CONFIG.CHART_CONFIG);
Object.freeze(APP_CONFIG.CHART_COLORS);
Object.freeze(APP_CONFIG.DATE_FORMATS);
Object.freeze(APP_CONFIG.COMPLIANCE);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
}
