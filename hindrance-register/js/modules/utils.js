/**
 * Hindrance Register - Utility Functions Module
 * Common helper functions used throughout the application
 */

const Utils = (function() {
    'use strict';

    /**
     * Generate a unique ID
     * @param {string} prefix - Optional prefix for the ID
     * @returns {string} Unique identifier
     */
    function generateId(prefix = 'id') {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 9);
        return `${prefix}_${timestamp}_${randomStr}`;
    }

    /**
     * Generate sequential SR Number
     * @param {Array} hindrances - Existing hindrances array
     * @returns {string} Next SR number (e.g., "HR-001")
     */
    function generateSrNo(hindrances) {
        if (!hindrances || hindrances.length === 0) {
            return 'HR-001';
        }
        const maxSr = hindrances.reduce((max, h) => {
            const num = parseInt(h.srNo.replace('HR-', ''), 10) || 0;
            return num > max ? num : max;
        }, 0);
        return `HR-${String(maxSr + 1).padStart(3, '0')}`;
    }

    /**
     * Format date to DD-MM-YYYY (Indian format)
     * @param {string|Date} date - Date to format
     * @returns {string} Formatted date string
     */
    function formatDateDisplay(date) {
        if (!date) return '-';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    }

    /**
     * Format date to YYYY-MM-DD (storage format)
     * @param {string|Date} date - Date to format
     * @returns {string} ISO date string
     */
    function formatDateStorage(date) {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
    }

    /**
     * Format date with time
     * @param {string|Date} date - Date to format
     * @returns {string} Formatted date with time
     */
    function formatDateTime(date) {
        if (!date) return '-';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    /**
     * Parse DD-MM-YYYY to Date object
     * @param {string} dateStr - Date string in DD-MM-YYYY format
     * @returns {Date|null} Date object or null
     */
    function parseDateDisplay(dateStr) {
        if (!dateStr) return null;
        const parts = dateStr.split('-');
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return isNaN(d.getTime()) ? null : d;
    }

    /**
     * Calculate days between two dates
     * @param {string|Date} startDate - Start date
     * @param {string|Date} endDate - End date
     * @returns {number} Number of days
     */
    function calculateDays(startDate, endDate) {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Calculate days from a date until today
     * @param {string|Date} date - Start date
     * @returns {number} Number of days
     */
    function daysSince(date) {
        if (!date) return 0;
        const d = new Date(date);
        if (isNaN(d.getTime())) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        const diffTime = today - d;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Format number to Indian currency format
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency string
     */
    function formatCurrency(amount) {
        if (!amount && amount !== 0) return '-';
        const num = parseFloat(amount);
        if (isNaN(num)) return '-';
        return '₹' + num.toLocaleString('en-IN');
    }

    /**
     * Format number with Indian comma separation
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    function formatIndianNumber(num) {
        if (!num && num !== 0) return '0';
        return num.toLocaleString('en-IN');
    }

    /**
     * Truncate text with ellipsis
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    function truncateText(text, maxLength = 50) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    function debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit time in ms
     * @returns {Function} Throttled function
     */
    function throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    function deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (e) {
            console.error('Deep clone failed:', e);
            return obj;
        }
    }

    /**
     * Get status badge class
     * @param {string} status - Status value
     * @returns {string} CSS class for badge
     */
    function getStatusBadgeClass(status) {
        const statusMap = {
            'Active': 'badge-status-active',
            'Resolved': 'badge-status-resolved',
            'Overdue': 'badge-status-overdue',
            'Pending Approval': 'badge-status-pending'
        };
        return statusMap[status] || 'bg-secondary';
    }

    /**
     * Get severity badge class
     * @param {string} severity - Severity level
     * @returns {string} CSS class for badge
     */
    function getSeverityBadgeClass(severity) {
        const severityMap = {
            'Critical': 'badge-severity-critical',
            'High': 'badge-severity-high',
            'Medium': 'badge-severity-medium',
            'Low': 'badge-severity-low'
        };
        return severityMap[severity] || 'bg-secondary';
    }

    /**
     * Get row status class for DataTable
     * @param {string} status - Status value
     * @returns {string} CSS class for row
     */
    function getRowStatusClass(status) {
        const statusMap = {
            'Active': 'row-active',
            'Resolved': 'row-resolved',
            'Overdue': 'row-overdue',
            'Pending Approval': 'row-pending'
        };
        return statusMap[status] || '';
    }

    /**
     * Determine actual status based on dates and SLA
     * @param {Object} hindrance - Hindrance record
     * @param {number} slaThreshold - SLA threshold in days
     * @returns {string} Calculated status
     */
    function calculateStatus(hindrance, slaThreshold = 5) {
        if (hindrance.status === 'Resolved' || hindrance.removalDate) {
            return 'Resolved';
        }
        if (hindrance.status === 'Pending Approval') {
            return 'Pending Approval';
        }
        // Check if overdue
        const daysPending = daysSince(hindrance.startDate);
        if (daysPending > slaThreshold) {
            return 'Overdue';
        }
        return 'Active';
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid email
     */
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Validate file type
     * @param {File} file - File to validate
     * @returns {boolean} Is valid file type
     */
    function isValidFileType(file) {
        return APP_CONFIG.FILE_CONFIG.allowedTypes.includes(file.type);
    }

    /**
     * Validate file size
     * @param {File} file - File to validate
     * @returns {boolean} Is valid file size
     */
    function isValidFileSize(file) {
        return file.size <= APP_CONFIG.FILE_CONFIG.maxFileSize;
    }

    /**
     * Get file icon based on type
     * @param {string} fileType - MIME type
     * @returns {string} Bootstrap icon class
     */
    function getFileIcon(fileType) {
        if (fileType.startsWith('image/')) return 'bi-file-image';
        if (fileType === 'application/pdf') return 'bi-file-pdf';
        if (fileType.includes('word')) return 'bi-file-word';
        return 'bi-file-earmark';
    }

    /**
     * Format file size
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Convert file to Base64
     * @param {File} file - File to convert
     * @returns {Promise<string>} Base64 string
     */
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    /**
     * Download data as file
     * @param {string} data - Data to download
     * @param {string} filename - File name
     * @param {string} type - MIME type
     */
    function downloadFile(data, filename, type = 'application/json') {
        const blob = new Blob([data], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Show SweetAlert2 toast notification
     * @param {string} message - Message to display
     * @param {string} type - Toast type (success, error, warning, info)
     */
    function showToast(message, type = 'success') {
        const iconMap = {
            success: 'success',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: iconMap[type] || 'info',
            title: message,
            showConfirmButton: false,
            timer: APP_CONFIG.TOAST_DURATION,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
    }

    /**
     * Show SweetAlert2 confirmation dialog
     * @param {Object} options - Dialog options
     * @returns {Promise} SweetAlert promise
     */
    function showConfirm(options) {
        return Swal.fire({
            title: options.title || 'Are you sure?',
            text: options.text || '',
            icon: options.icon || 'question',
            showCancelButton: true,
            confirmButtonColor: '#008B8B',
            cancelButtonColor: '#6c757d',
            confirmButtonText: options.confirmText || 'Yes',
            cancelButtonText: options.cancelText || 'Cancel',
            reverseButtons: true
        });
    }

    /**
     * Show SweetAlert2 input dialog
     * @param {Object} options - Dialog options
     * @returns {Promise} SweetAlert promise
     */
    function showInput(options) {
        return Swal.fire({
            title: options.title || 'Enter value',
            input: options.inputType || 'text',
            inputLabel: options.label || '',
            inputValue: options.value || '',
            inputPlaceholder: options.placeholder || '',
            showCancelButton: true,
            confirmButtonColor: '#008B8B',
            inputValidator: options.validator || null
        });
    }

    /**
     * Show loading overlay
     * @param {string} message - Loading message
     */
    function showLoading(message = 'Loading...') {
        Swal.fire({
            title: message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    /**
     * Hide loading overlay
     */
    function hideLoading() {
        Swal.close();
    }

    /**
     * Check if online
     * @returns {boolean} Is online
     */
    function isOnline() {
        return navigator.onLine;
    }

    /**
     * Get current timestamp in ISO format
     * @returns {string} ISO timestamp
     */
    function getCurrentTimestamp() {
        return new Date().toISOString();
    }

    /**
     * Get dates for reporting periods
     * @param {string} period - Period type (today, week, month, quarter)
     * @returns {Object} Start and end dates
     */
    function getReportingPeriod(period) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let startDate = new Date(today);
        let endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);

        switch (period) {
            case 'today':
                // Already set
                break;
            case 'week':
                startDate.setDate(today.getDate() - 7);
                break;
            case 'month':
                startDate.setDate(today.getDate() - 30);
                break;
            case 'quarter':
                startDate.setDate(today.getDate() - 90);
                break;
            case 'year':
                startDate.setFullYear(today.getFullYear() - 1);
                break;
            default:
                startDate.setDate(today.getDate() - 30);
        }

        return {
            startDate: formatDateStorage(startDate),
            endDate: formatDateStorage(endDate)
        };
    }

    /**
     * Group array by key
     * @param {Array} array - Array to group
     * @param {string} key - Key to group by
     * @returns {Object} Grouped object
     */
    function groupBy(array, key) {
        return array.reduce((result, item) => {
            const groupKey = item[key] || 'Unknown';
            (result[groupKey] = result[groupKey] || []).push(item);
            return result;
        }, {});
    }

    /**
     * Count occurrences in array
     * @param {Array} array - Array to count
     * @param {string} key - Key to count by
     * @returns {Object} Count object
     */
    function countBy(array, key) {
        return array.reduce((result, item) => {
            const countKey = item[key] || 'Unknown';
            result[countKey] = (result[countKey] || 0) + 1;
            return result;
        }, {});
    }

    /**
     * Sort array by date
     * @param {Array} array - Array to sort
     * @param {string} dateKey - Date property key
     * @param {string} order - Sort order (asc/desc)
     * @returns {Array} Sorted array
     */
    function sortByDate(array, dateKey, order = 'desc') {
        return [...array].sort((a, b) => {
            const dateA = new Date(a[dateKey]);
            const dateB = new Date(b[dateKey]);
            return order === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }

    /**
     * Filter hindrances by date range
     * @param {Array} hindrances - Array of hindrances
     * @param {string} startDate - Start date
     * @param {string} endDate - End date
     * @returns {Array} Filtered array
     */
    function filterByDateRange(hindrances, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return hindrances.filter(h => {
            const date = new Date(h.startDate || h.dateOccurrence);
            return date >= start && date <= end;
        });
    }

    /**
     * Check if user has permission
     * @param {string} permission - Permission to check
     * @param {string} role - User role
     * @returns {boolean} Has permission
     */
    function hasPermission(permission, role) {
        const roleConfig = APP_CONFIG.ROLES[role];
        if (!roleConfig) return false;
        return roleConfig.permissions.includes(permission);
    }

    // Public API
    return {
        generateId,
        generateSrNo,
        formatDateDisplay,
        formatDateStorage,
        formatDateTime,
        parseDateDisplay,
        calculateDays,
        daysSince,
        formatCurrency,
        formatIndianNumber,
        truncateText,
        escapeHtml,
        debounce,
        throttle,
        deepClone,
        getStatusBadgeClass,
        getSeverityBadgeClass,
        getRowStatusClass,
        calculateStatus,
        isValidEmail,
        isValidFileType,
        isValidFileSize,
        getFileIcon,
        formatFileSize,
        fileToBase64,
        downloadFile,
        showToast,
        showConfirm,
        showInput,
        showLoading,
        hideLoading,
        isOnline,
        getCurrentTimestamp,
        getReportingPeriod,
        groupBy,
        countBy,
        sortByDate,
        filterByDateRange,
        hasPermission
    };
})();
