/**
 * Hindrance Register - Authentication Module
 * User authentication and session management
 */

const Auth = (function() {
    'use strict';

    let currentUser = null;

    /**
     * Initialize authentication
     * Check for existing session
     */
    function init() {
        currentUser = Storage.getCurrentUser();
        
        // Check remember me
        const remembered = Storage.get(APP_CONFIG.STORAGE_KEYS.REMEMBER_ME, null);
        if (remembered && !currentUser) {
            // Auto-login if remembered
            const user = Storage.getUserByUsername(remembered.username);
            if (user && user.active) {
                currentUser = user;
                Storage.setCurrentUser(user);
            }
        }

        return currentUser !== null;
    }

    /**
     * Login user
     * @param {string} username - Username
     * @param {string} password - Password
     * @param {boolean} rememberMe - Remember login
     * @returns {Object} Result with success status and message
     */
    function login(username, password, rememberMe = false) {
        // Validate inputs
        if (!username || !password) {
            return {
                success: false,
                message: 'Please enter both username and password.'
            };
        }

        // Find user
        const user = Storage.getUserByUsername(username);
        
        if (!user) {
            return {
                success: false,
                message: 'Invalid username or password.'
            };
        }

        // Check password (in production, use proper hashing)
        if (user.password !== password) {
            return {
                success: false,
                message: 'Invalid username or password.'
            };
        }

        // Check if user is active
        if (!user.active) {
            return {
                success: false,
                message: 'Your account has been deactivated. Please contact administrator.'
            };
        }

        // Update last login
        Storage.updateUser(user.id, {
            lastLogin: Utils.getCurrentTimestamp()
        });

        // Set current user
        currentUser = { ...user, password: undefined }; // Don't store password in session
        Storage.setCurrentUser(currentUser);

        // Handle remember me
        if (rememberMe) {
            Storage.set(APP_CONFIG.STORAGE_KEYS.REMEMBER_ME, { username: user.username });
        } else {
            Storage.remove(APP_CONFIG.STORAGE_KEYS.REMEMBER_ME);
        }

        return {
            success: true,
            message: 'Login successful!',
            user: currentUser
        };
    }

    /**
     * Logout current user
     */
    function logout() {
        currentUser = null;
        Storage.clearCurrentUser();
        Storage.remove(APP_CONFIG.STORAGE_KEYS.REMEMBER_ME);
        Storage.clearFormDraft();
    }

    /**
     * Get current user
     * @returns {Object|null} Current user or null
     */
    function getCurrentUser() {
        return currentUser;
    }

    /**
     * Check if user is logged in
     * @returns {boolean} Is logged in
     */
    function isLoggedIn() {
        return currentUser !== null;
    }

    /**
     * Get user role
     * @returns {string|null} User role or null
     */
    function getRole() {
        return currentUser?.role || null;
    }

    /**
     * Get role label
     * @returns {string} Role label
     */
    function getRoleLabel() {
        if (!currentUser) return 'Guest';
        const roleConfig = APP_CONFIG.ROLES[currentUser.role];
        return roleConfig?.label || currentUser.role;
    }

    /**
     * Check if current user has permission
     * @param {string} permission - Permission to check
     * @returns {boolean} Has permission
     */
    function hasPermission(permission) {
        if (!currentUser) return false;
        return Utils.hasPermission(permission, currentUser.role);
    }

    /**
     * Check if user can perform action on resource
     * @param {string} action - Action type
     * @param {Object} resource - Resource object (optional)
     * @returns {boolean} Can perform action
     */
    function can(action, resource = null) {
        if (!currentUser) return false;

        // Admin can do everything
        if (currentUser.role === 'admin') return true;

        // Check basic permission
        if (!hasPermission(action)) return false;

        // Check resource-specific rules
        if (resource && action === 'update') {
            // Supervisors can only update their own records
            if (currentUser.role === 'supervisor') {
                return resource.createdBy === currentUser.username;
            }
        }

        if (action === 'delete') {
            // Only admin and site_incharge can delete
            return ['admin', 'site_incharge'].includes(currentUser.role);
        }

        if (action === 'approve') {
            // Only admin and site_incharge can approve
            return ['admin', 'site_incharge'].includes(currentUser.role);
        }

        if (action === 'manage_users') {
            // Only admin can manage users
            return currentUser.role === 'admin';
        }

        return true;
    }

    /**
     * Change password
     * @param {string} oldPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Object} Result with success status
     */
    function changePassword(oldPassword, newPassword) {
        if (!currentUser) {
            return {
                success: false,
                message: 'Not logged in.'
            };
        }

        const user = Storage.getUserByUsername(currentUser.username);
        
        if (!user || user.password !== oldPassword) {
            return {
                success: false,
                message: 'Current password is incorrect.'
            };
        }

        if (newPassword.length < 6) {
            return {
                success: false,
                message: 'New password must be at least 6 characters.'
            };
        }

        Storage.updateUser(user.id, { password: newPassword });

        return {
            success: true,
            message: 'Password changed successfully.'
        };
    }

    /**
     * Update profile
     * @param {Object} updates - Profile updates
     * @returns {Object} Result with success status
     */
    function updateProfile(updates) {
        if (!currentUser) {
            return {
                success: false,
                message: 'Not logged in.'
            };
        }

        const allowedFields = ['fullName'];
        const sanitizedUpdates = {};
        
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                sanitizedUpdates[field] = updates[field];
            }
        }

        const updated = Storage.updateUser(currentUser.id, sanitizedUpdates);
        
        if (updated) {
            currentUser = { ...currentUser, ...sanitizedUpdates };
            Storage.setCurrentUser(currentUser);
            return {
                success: true,
                message: 'Profile updated successfully.'
            };
        }

        return {
            success: false,
            message: 'Failed to update profile.'
        };
    }

    /**
     * Validate session
     * @returns {boolean} Is session valid
     */
    function validateSession() {
        if (!currentUser) return false;
        
        const user = Storage.getUserByUsername(currentUser.username);
        if (!user || !user.active) {
            logout();
            return false;
        }
        
        return true;
    }

    // Public API
    return {
        init,
        login,
        logout,
        getCurrentUser,
        isLoggedIn,
        getRole,
        getRoleLabel,
        hasPermission,
        can,
        changePassword,
        updateProfile,
        validateSession
    };
})();
