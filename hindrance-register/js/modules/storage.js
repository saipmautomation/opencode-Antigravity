/**
 * Hindrance Register - Storage Module
 * LocalStorage and IndexedDB operations for data persistence
 */

const Storage = (function() {
    'use strict';

    const KEYS = APP_CONFIG.STORAGE_KEYS;
    let attachmentsDB = null;

    /**
     * Initialize IndexedDB for attachments
     * @returns {Promise} Database initialization promise
     */
    function initAttachmentsDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(KEYS.ATTACHMENTS_DB, 1);

            request.onerror = () => {
                console.error('Failed to open IndexedDB');
                reject(request.error);
            };

            request.onsuccess = () => {
                attachmentsDB = request.result;
                resolve(attachmentsDB);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('attachments')) {
                    const store = db.createObjectStore('attachments', { keyPath: 'id' });
                    store.createIndex('hindranceId', 'hindranceId', { unique: false });
                }
            };
        });
    }

    /**
     * Get data from LocalStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Retrieved data or default value
     */
    function get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    }

    /**
     * Save data to LocalStorage
     * @param {string} key - Storage key
     * @param {*} data - Data to store
     * @returns {boolean} Success status
     */
    function set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            if (e.name === 'QuotaExceededError') {
                Utils.showToast('Storage quota exceeded. Please clear some data.', 'error');
            }
            return false;
        }
    }

    /**
     * Remove data from LocalStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    function remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    }

    /**
     * Clear all application data from LocalStorage
     */
    function clearAll() {
        Object.values(KEYS).forEach(key => {
            if (typeof key === 'string') {
                localStorage.removeItem(key);
            }
        });
    }

    // ==========================================
    // Hindrance Operations
    // ==========================================

    /**
     * Get all hindrances
     * @returns {Array} Array of hindrance records
     */
    function getHindrances() {
        return get(KEYS.HINDRANCES, []);
    }

    /**
     * Get a single hindrance by ID
     * @param {string} id - Hindrance ID
     * @returns {Object|null} Hindrance record or null
     */
    function getHindranceById(id) {
        const hindrances = getHindrances();
        return hindrances.find(h => h.id === id) || null;
    }

    /**
     * Get hindrances by SR number
     * @param {string} srNo - SR number
     * @returns {Object|null} Hindrance record or null
     */
    function getHindranceBySrNo(srNo) {
        const hindrances = getHindrances();
        return hindrances.find(h => h.srNo === srNo) || null;
    }

    /**
     * Save all hindrances
     * @param {Array} hindrances - Array of hindrance records
     * @returns {boolean} Success status
     */
    function saveHindrances(hindrances) {
        return set(KEYS.HINDRANCES, hindrances);
    }

    /**
     * Add a new hindrance
     * @param {Object} hindrance - Hindrance data
     * @returns {Object} Created hindrance with ID
     */
    function addHindrance(hindrance) {
        const hindrances = getHindrances();
        const newHindrance = {
            ...hindrance,
            id: Utils.generateId('hind'),
            srNo: Utils.generateSrNo(hindrances),
            createdAt: Utils.getCurrentTimestamp(),
            updatedAt: Utils.getCurrentTimestamp(),
            createdBy: getCurrentUser()?.username || 'system'
        };
        hindrances.push(newHindrance);
        saveHindrances(hindrances);
        addAuditLog('create', 'hindrance', newHindrance.id, null, newHindrance);
        return newHindrance;
    }

    /**
     * Update a hindrance
     * @param {string} id - Hindrance ID
     * @param {Object} updates - Update data
     * @returns {Object|null} Updated hindrance or null
     */
    function updateHindrance(id, updates) {
        const hindrances = getHindrances();
        const index = hindrances.findIndex(h => h.id === id);
        if (index === -1) return null;

        const oldData = Utils.deepClone(hindrances[index]);
        const updatedHindrance = {
            ...hindrances[index],
            ...updates,
            updatedAt: Utils.getCurrentTimestamp(),
            updatedBy: getCurrentUser()?.username || 'system'
        };
        hindrances[index] = updatedHindrance;
        saveHindrances(hindrances);
        addAuditLog('update', 'hindrance', id, oldData, updatedHindrance);
        return updatedHindrance;
    }

    /**
     * Delete a hindrance
     * @param {string} id - Hindrance ID
     * @returns {boolean} Success status
     */
    function deleteHindrance(id) {
        const hindrances = getHindrances();
        const index = hindrances.findIndex(h => h.id === id);
        if (index === -1) return false;

        const deleted = hindrances.splice(index, 1)[0];
        saveHindrances(hindrances);
        addAuditLog('delete', 'hindrance', id, deleted, null);
        
        // Also delete associated attachments
        deleteAttachmentsByHindranceId(id);
        return true;
    }

    // ==========================================
    // User Operations
    // ==========================================

    /**
     * Get all users
     * @returns {Array} Array of users
     */
    function getUsers() {
        return get(KEYS.USERS, APP_CONFIG.DEFAULT_USERS);
    }

    /**
     * Save all users
     * @param {Array} users - Array of users
     * @returns {boolean} Success status
     */
    function saveUsers(users) {
        return set(KEYS.USERS, users);
    }

    /**
     * Get user by username
     * @param {string} username - Username
     * @returns {Object|null} User or null
     */
    function getUserByUsername(username) {
        const users = getUsers();
        return users.find(u => u.username === username) || null;
    }

    /**
     * Get user by ID
     * @param {string} id - User ID
     * @returns {Object|null} User or null
     */
    function getUserById(id) {
        const users = getUsers();
        return users.find(u => u.id === id) || null;
    }

    /**
     * Add new user
     * @param {Object} user - User data
     * @returns {Object} Created user
     */
    function addUser(user) {
        const users = getUsers();
        const newUser = {
            ...user,
            id: Utils.generateId('user'),
            createdAt: Utils.getCurrentTimestamp(),
            lastLogin: null
        };
        users.push(newUser);
        saveUsers(users);
        addAuditLog('create', 'user', newUser.id, null, { ...newUser, password: '***' });
        return newUser;
    }

    /**
     * Update user
     * @param {string} id - User ID
     * @param {Object} updates - Update data
     * @returns {Object|null} Updated user or null
     */
    function updateUser(id, updates) {
        const users = getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return null;

        users[index] = { ...users[index], ...updates };
        saveUsers(users);
        addAuditLog('update', 'user', id, null, { ...users[index], password: '***' });
        return users[index];
    }

    /**
     * Delete user
     * @param {string} id - User ID
     * @returns {boolean} Success status
     */
    function deleteUser(id) {
        const users = getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return false;

        const deleted = users.splice(index, 1)[0];
        saveUsers(users);
        addAuditLog('delete', 'user', id, { ...deleted, password: '***' }, null);
        return true;
    }

    /**
     * Get current logged in user
     * @returns {Object|null} Current user or null
     */
    function getCurrentUser() {
        return get(KEYS.CURRENT_USER, null);
    }

    /**
     * Set current user
     * @param {Object} user - User data
     */
    function setCurrentUser(user) {
        set(KEYS.CURRENT_USER, user);
    }

    /**
     * Clear current user (logout)
     */
    function clearCurrentUser() {
        remove(KEYS.CURRENT_USER);
    }

    // ==========================================
    // Project Configuration
    // ==========================================

    /**
     * Get project configuration
     * @returns {Object} Project config
     */
    function getProjectConfig() {
        return get(KEYS.PROJECT_CONFIG, APP_CONFIG.DEFAULT_PROJECT);
    }

    /**
     * Save project configuration
     * @param {Object} config - Project configuration
     * @returns {boolean} Success status
     */
    function saveProjectConfig(config) {
        return set(KEYS.PROJECT_CONFIG, config);
    }

    // ==========================================
    // System Configuration
    // ==========================================

    /**
     * Get system configuration
     * @returns {Object} System config
     */
    function getSystemConfig() {
        return get(KEYS.SYSTEM_CONFIG, APP_CONFIG.DEFAULT_SYSTEM);
    }

    /**
     * Save system configuration
     * @param {Object} config - System configuration
     * @returns {boolean} Success status
     */
    function saveSystemConfig(config) {
        return set(KEYS.SYSTEM_CONFIG, config);
    }

    // ==========================================
    // Audit Log Operations
    // ==========================================

    /**
     * Get audit log
     * @returns {Array} Audit log entries
     */
    function getAuditLog() {
        return get(KEYS.AUDIT_LOG, []);
    }

    /**
     * Add audit log entry
     * @param {string} action - Action type (create, update, delete)
     * @param {string} entity - Entity type (hindrance, user, etc.)
     * @param {string} entityId - Entity ID
     * @param {Object} oldValue - Old value (for updates/deletes)
     * @param {Object} newValue - New value (for creates/updates)
     */
    function addAuditLog(action, entity, entityId, oldValue, newValue) {
        const auditLog = getAuditLog();
        const entry = {
            id: Utils.generateId('audit'),
            timestamp: Utils.getCurrentTimestamp(),
            user: getCurrentUser()?.username || 'system',
            action,
            entity,
            entityId,
            oldValue,
            newValue
        };
        auditLog.unshift(entry);
        
        // Keep only last 1000 entries
        if (auditLog.length > 1000) {
            auditLog.splice(1000);
        }
        
        set(KEYS.AUDIT_LOG, auditLog);
    }

    /**
     * Get audit log for specific entity
     * @param {string} entityId - Entity ID
     * @returns {Array} Filtered audit entries
     */
    function getAuditLogForEntity(entityId) {
        const auditLog = getAuditLog();
        return auditLog.filter(entry => entry.entityId === entityId);
    }

    // ==========================================
    // Attachment Operations (IndexedDB)
    // ==========================================

    /**
     * Save attachment to IndexedDB
     * @param {Object} attachment - Attachment data with base64 content
     * @returns {Promise} Save promise
     */
    function saveAttachment(attachment) {
        return new Promise((resolve, reject) => {
            if (!attachmentsDB) {
                reject(new Error('IndexedDB not initialized'));
                return;
            }

            const transaction = attachmentsDB.transaction(['attachments'], 'readwrite');
            const store = transaction.objectStore('attachments');
            
            const attachmentData = {
                ...attachment,
                id: attachment.id || Utils.generateId('attach'),
                uploadedAt: Utils.getCurrentTimestamp()
            };

            const request = store.put(attachmentData);

            request.onsuccess = () => resolve(attachmentData);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get attachment by ID
     * @param {string} id - Attachment ID
     * @returns {Promise} Attachment data
     */
    function getAttachment(id) {
        return new Promise((resolve, reject) => {
            if (!attachmentsDB) {
                reject(new Error('IndexedDB not initialized'));
                return;
            }

            const transaction = attachmentsDB.transaction(['attachments'], 'readonly');
            const store = transaction.objectStore('attachments');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all attachments for a hindrance
     * @param {string} hindranceId - Hindrance ID
     * @returns {Promise} Array of attachments
     */
    function getAttachmentsByHindranceId(hindranceId) {
        return new Promise((resolve, reject) => {
            if (!attachmentsDB) {
                reject(new Error('IndexedDB not initialized'));
                return;
            }

            const transaction = attachmentsDB.transaction(['attachments'], 'readonly');
            const store = transaction.objectStore('attachments');
            const index = store.index('hindranceId');
            const request = index.getAll(hindranceId);

            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Delete attachment
     * @param {string} id - Attachment ID
     * @returns {Promise} Delete promise
     */
    function deleteAttachment(id) {
        return new Promise((resolve, reject) => {
            if (!attachmentsDB) {
                reject(new Error('IndexedDB not initialized'));
                return;
            }

            const transaction = attachmentsDB.transaction(['attachments'], 'readwrite');
            const store = transaction.objectStore('attachments');
            const request = store.delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Delete all attachments for a hindrance
     * @param {string} hindranceId - Hindrance ID
     * @returns {Promise} Delete promise
     */
    async function deleteAttachmentsByHindranceId(hindranceId) {
        try {
            const attachments = await getAttachmentsByHindranceId(hindranceId);
            for (const attachment of attachments) {
                await deleteAttachment(attachment.id);
            }
            return true;
        } catch (e) {
            console.error('Error deleting attachments:', e);
            return false;
        }
    }

    // ==========================================
    // Backup & Restore
    // ==========================================

    /**
     * Create full backup of all data
     * @returns {Object} Backup data
     */
    function createBackup() {
        const backup = {
            version: APP_CONFIG.APP_VERSION,
            createdAt: Utils.getCurrentTimestamp(),
            data: {
                hindrances: getHindrances(),
                users: getUsers(),
                projectConfig: getProjectConfig(),
                systemConfig: getSystemConfig(),
                auditLog: getAuditLog()
            }
        };
        
        set(KEYS.LAST_BACKUP, Utils.getCurrentTimestamp());
        return backup;
    }

    /**
     * Restore data from backup
     * @param {Object} backup - Backup data
     * @returns {boolean} Success status
     */
    function restoreBackup(backup) {
        try {
            if (!backup || !backup.data) {
                throw new Error('Invalid backup format');
            }

            if (backup.data.hindrances) {
                saveHindrances(backup.data.hindrances);
            }
            if (backup.data.users) {
                saveUsers(backup.data.users);
            }
            if (backup.data.projectConfig) {
                saveProjectConfig(backup.data.projectConfig);
            }
            if (backup.data.systemConfig) {
                saveSystemConfig(backup.data.systemConfig);
            }
            if (backup.data.auditLog) {
                set(KEYS.AUDIT_LOG, backup.data.auditLog);
            }

            return true;
        } catch (e) {
            console.error('Restore backup error:', e);
            return false;
        }
    }

    /**
     * Get last backup timestamp
     * @returns {string|null} Last backup timestamp
     */
    function getLastBackup() {
        return get(KEYS.LAST_BACKUP, null);
    }

    // ==========================================
    // Theme & Preferences
    // ==========================================

    /**
     * Get theme preference
     * @returns {string} Theme (light/dark)
     */
    function getTheme() {
        return get(KEYS.THEME, 'light');
    }

    /**
     * Set theme preference
     * @param {string} theme - Theme (light/dark)
     */
    function setTheme(theme) {
        set(KEYS.THEME, theme);
        document.documentElement.setAttribute('data-theme', theme);
    }

    // ==========================================
    // Form Draft Operations
    // ==========================================

    /**
     * Save form draft
     * @param {Object} data - Form data
     */
    function saveFormDraft(data) {
        set(KEYS.FORM_DRAFT, {
            data,
            savedAt: Utils.getCurrentTimestamp()
        });
    }

    /**
     * Get form draft
     * @returns {Object|null} Form draft data
     */
    function getFormDraft() {
        return get(KEYS.FORM_DRAFT, null);
    }

    /**
     * Clear form draft
     */
    function clearFormDraft() {
        remove(KEYS.FORM_DRAFT);
    }

    // ==========================================
    // Initialize Storage
    // ==========================================

    /**
     * Initialize storage with default data if empty
     */
    async function initialize() {
        // Initialize users if not exists
        if (!get(KEYS.USERS)) {
            set(KEYS.USERS, APP_CONFIG.DEFAULT_USERS);
        }

        // Initialize project config if not exists
        if (!get(KEYS.PROJECT_CONFIG)) {
            set(KEYS.PROJECT_CONFIG, APP_CONFIG.DEFAULT_PROJECT);
        }

        // Initialize system config if not exists
        if (!get(KEYS.SYSTEM_CONFIG)) {
            set(KEYS.SYSTEM_CONFIG, APP_CONFIG.DEFAULT_SYSTEM);
        }

        // Initialize hindrances array if not exists
        if (!get(KEYS.HINDRANCES)) {
            set(KEYS.HINDRANCES, []);
        }

        // Initialize IndexedDB for attachments
        try {
            await initAttachmentsDB();
        } catch (e) {
            console.warn('IndexedDB not available, attachments will not be stored:', e);
        }

        // Apply saved theme
        const theme = getTheme();
        document.documentElement.setAttribute('data-theme', theme);
    }

    // Public API
    return {
        // Core operations
        get,
        set,
        remove,
        clearAll,
        initialize,
        
        // Hindrance operations
        getHindrances,
        getHindranceById,
        getHindranceBySrNo,
        saveHindrances,
        addHindrance,
        updateHindrance,
        deleteHindrance,
        
        // User operations
        getUsers,
        saveUsers,
        getUserByUsername,
        getUserById,
        addUser,
        updateUser,
        deleteUser,
        getCurrentUser,
        setCurrentUser,
        clearCurrentUser,
        
        // Configuration
        getProjectConfig,
        saveProjectConfig,
        getSystemConfig,
        saveSystemConfig,
        
        // Audit log
        getAuditLog,
        addAuditLog,
        getAuditLogForEntity,
        
        // Attachments
        saveAttachment,
        getAttachment,
        getAttachmentsByHindranceId,
        deleteAttachment,
        deleteAttachmentsByHindranceId,
        
        // Backup & Restore
        createBackup,
        restoreBackup,
        getLastBackup,
        
        // Theme
        getTheme,
        setTheme,
        
        // Form draft
        saveFormDraft,
        getFormDraft,
        clearFormDraft
    };
})();
