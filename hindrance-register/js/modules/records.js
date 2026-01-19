/**
 * Hindrance Register - Records Module
 * CRUD operations for hindrance records
 */

const Records = (function() {
    'use strict';

    let dataTable = null;
    let currentEditId = null;
    let autoSaveInterval = null;

    /**
     * Initialize records module
     */
    function init() {
        initDataTable();
        bindEvents();
        populateFormDropdowns();
    }

    /**
     * Initialize DataTable
     */
    function initDataTable() {
        const hindrances = Storage.getHindrances();
        const systemConfig = Storage.getSystemConfig();
        const slaThreshold = systemConfig.slaThresholdDays || 5;

        dataTable = $('#hindranceTable').DataTable({
            ...APP_CONFIG.DATATABLE_CONFIG,
            data: hindrances,
            columns: [
                { 
                    data: 'srNo',
                    className: 'monospace'
                },
                { 
                    data: 'dateOccurrence',
                    render: (data) => Utils.formatDateDisplay(data),
                    className: 'monospace'
                },
                { 
                    data: 'nature',
                    render: (data) => Utils.truncateText(data, 25)
                },
                { 
                    data: 'workAffected',
                    render: (data) => {
                        if (!data) return '-';
                        const phases = Array.isArray(data) ? data : [data];
                        return phases.map(p => 
                            `<span class="work-phase-tag">${Utils.escapeHtml(Utils.truncateText(p, 15))}</span>`
                        ).join(' ');
                    }
                },
                { 
                    data: 'startDate',
                    render: (data) => Utils.formatDateDisplay(data),
                    className: 'monospace'
                },
                { 
                    data: 'removalDate',
                    render: (data) => data ? Utils.formatDateDisplay(data) : '-',
                    className: 'monospace'
                },
                { 
                    data: null,
                    render: (data, type, row) => {
                        if (row.removalDate && row.startDate) {
                            return Utils.calculateDays(row.startDate, row.removalDate);
                        } else if (row.startDate) {
                            return Utils.daysSince(row.startDate);
                        }
                        return 0;
                    },
                    className: 'text-center monospace'
                },
                { 
                    data: null,
                    render: (data, type, row) => {
                        const status = Utils.calculateStatus(row, slaThreshold);
                        const badgeClass = Utils.getStatusBadgeClass(status);
                        return `<span class="badge ${badgeClass}">${status}</span>`;
                    }
                },
                { 
                    data: 'responsibleParty',
                    render: (data) => Utils.truncateText(data, 15)
                },
                { 
                    data: 'severity',
                    render: (data) => {
                        if (!data) return '-';
                        const badgeClass = Utils.getSeverityBadgeClass(data);
                        return `<span class="badge ${badgeClass}">${data}</span>`;
                    }
                },
                { 
                    data: 'daysNotAttributable',
                    render: (data) => data || 0,
                    className: 'text-center monospace'
                },
                { 
                    data: 'remarks',
                    render: (data) => {
                        if (!data) return '-';
                        const truncated = Utils.truncateText(data, 30);
                        return `<span title="${Utils.escapeHtml(data)}">${Utils.escapeHtml(truncated)}</span>`;
                    }
                },
                { 
                    data: null,
                    orderable: false,
                    render: (data, type, row) => {
                        let actions = `
                            <button class="btn btn-sm btn-outline-info btn-action me-1" onclick="Records.viewDetails('${row.id}')" title="View Details">
                                <i class="bi bi-eye"></i>
                            </button>
                        `;
                        
                        if (Auth.can('update', row)) {
                            actions += `
                                <button class="btn btn-sm btn-outline-primary btn-action me-1" onclick="Records.edit('${row.id}')" title="Edit">
                                    <i class="bi bi-pencil"></i>
                                </button>
                            `;
                        }
                        
                        if (Auth.can('delete', row)) {
                            actions += `
                                <button class="btn btn-sm btn-outline-danger btn-action" onclick="Records.confirmDelete('${row.id}')" title="Delete">
                                    <i class="bi bi-trash"></i>
                                </button>
                            `;
                        }
                        
                        return `<div class="d-flex">${actions}</div>`;
                    }
                }
            ],
            createdRow: function(row, data) {
                const status = Utils.calculateStatus(data, slaThreshold);
                $(row).addClass(Utils.getRowStatusClass(status));
            },
            order: [[0, 'desc']]
        });
    }

    /**
     * Refresh DataTable with latest data
     */
    function refreshTable() {
        const hindrances = Storage.getHindrances();
        if (dataTable) {
            dataTable.clear();
            dataTable.rows.add(hindrances);
            dataTable.draw();
        }
    }

    /**
     * Bind event handlers
     */
    function bindEvents() {
        // Create hindrance buttons
        $('#btnCreateHindrance').on('click', openCreateModal);

        // Toggle filters
        $('#btnToggleFilters').on('click', () => {
            $('#filtersPanel').collapse('toggle');
        });

        // Apply filters
        $('#advancedFiltersForm').on('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });

        // Clear filters
        $('#btnClearFilters').on('click', clearFilters);

        // Export buttons
        $('#btnExportCSV').on('click', () => exportData('csv'));
        $('#btnExportExcel').on('click', () => exportData('excel'));
        $('#btnExportPDF').on('click', () => exportData('pdf'));
        $('#btnPrintTable').on('click', printTable);

        // Column visibility
        $('#btnColumnVisibility').on('click', showColumnVisibilityModal);

        // Save hindrance button
        $('#btnSaveHindrance').on('click', saveHindrance);

        // Form field events
        $('#formNature').on('change', function() {
            const showOther = $(this).val() === 'Other';
            $('#formNatureOtherContainer').toggle(showOther);
            $('#formNatureOther').prop('required', showOther);
        });

        // Description character counter
        $('#formDescription').on('input', function() {
            const count = $(this).val().length;
            $('#descriptionCharCount').text(count);
            updateCharCountClass('#descriptionCharCount', count, 500);
        });

        // Corrective measures character counter
        $('#formCorrectiveMeasures').on('input', function() {
            const count = $(this).val().length;
            $('#correctiveCharCount').text(count);
            updateCharCountClass('#correctiveCharCount', count, 500);
        });

        // Date calculations
        $('#formRemovalDate, #formStartDate').on('change', calculateDays);
        $('#formDaysAttributable').on('input', calculateDaysNotAttributable);

        // File upload
        $('#formAttachments').on('change', handleFileUpload);

        // Modal events
        $('#hindranceModal').on('hidden.bs.modal', function() {
            resetForm();
            stopAutoSave();
        });

        // View details modal events
        $('#btnViewEdit').on('click', function() {
            const id = $(this).data('id');
            $('#viewDetailsModal').modal('hide');
            edit(id);
        });

        $('#btnViewDownloadPDF').on('click', function() {
            const id = $(this).data('id');
            downloadHindrancePDF(id);
        });
    }

    /**
     * Update character count class based on remaining
     */
    function updateCharCountClass(selector, count, max) {
        const $el = $(selector);
        $el.removeClass('warning danger');
        if (count > max * 0.9) {
            $el.addClass('danger');
        } else if (count > max * 0.7) {
            $el.addClass('warning');
        }
    }

    /**
     * Populate form dropdowns
     */
    function populateFormDropdowns() {
        // Populate approvers
        const systemConfig = Storage.getSystemConfig();
        const $approver = $('#formApprover');
        $approver.empty().append('<option value="">Select Approver</option>');
        
        if (systemConfig.approvers) {
            systemConfig.approvers.forEach(name => {
                $approver.append(`<option value="${Utils.escapeHtml(name)}">${Utils.escapeHtml(name)}</option>`);
            });
        }
    }

    /**
     * Open create modal
     */
    function openCreateModal() {
        currentEditId = null;
        resetForm();
        
        // Generate new SR number
        const hindrances = Storage.getHindrances();
        $('#formSrNo').val(Utils.generateSrNo(hindrances));
        
        // Set default dates
        const today = Utils.formatDateStorage(new Date());
        $('#formDateOccurrence').val(today);
        $('#formStartDate').val(today);
        
        // Update modal title
        $('#hindranceModalTitle').html('<i class="bi bi-plus-circle me-2"></i>Register New Hindrance');
        
        // Start auto-save
        startAutoSave();
        
        // Check for draft
        checkForDraft();
        
        $('#hindranceModal').modal('show');
    }

    /**
     * Edit existing hindrance
     * @param {string} id - Hindrance ID
     */
    function edit(id) {
        const hindrance = Storage.getHindranceById(id);
        if (!hindrance) {
            Utils.showToast('Hindrance not found', 'error');
            return;
        }

        if (!Auth.can('update', hindrance)) {
            Utils.showToast('You do not have permission to edit this record', 'error');
            return;
        }

        currentEditId = id;
        resetForm();
        populateForm(hindrance);
        
        // Update modal title
        $('#hindranceModalTitle').html(`<i class="bi bi-pencil me-2"></i>Edit Hindrance - ${hindrance.srNo}`);
        
        // Start auto-save
        startAutoSave();
        
        $('#hindranceModal').modal('show');
    }

    /**
     * Populate form with hindrance data
     * @param {Object} hindrance - Hindrance data
     */
    function populateForm(hindrance) {
        $('#hindranceId').val(hindrance.id);
        $('#formSrNo').val(hindrance.srNo);
        $('#formDateOccurrence').val(hindrance.dateOccurrence);
        $('#formStartDate').val(hindrance.startDate);
        $('#formNature').val(hindrance.nature);
        
        if (hindrance.nature === 'Other') {
            $('#formNatureOtherContainer').show();
            $('#formNatureOther').val(hindrance.natureOther || '');
        }
        
        // Handle multi-select work affected
        if (hindrance.workAffected) {
            const phases = Array.isArray(hindrance.workAffected) ? hindrance.workAffected : [hindrance.workAffected];
            $('#formWorkAffected').val(phases);
        }
        
        $('#formDescription').val(hindrance.description || '');
        $('#descriptionCharCount').text((hindrance.description || '').length);
        
        // Responsibility radio
        $(`input[name="formResponsibility"][value="${hindrance.responsibleParty}"]`).prop('checked', true);
        
        $('#formSeverity').val(hindrance.severity);
        $('#formEstimatedDelay').val(hindrance.estimatedDelay);
        $('#formAffectedWorkforce').val(hindrance.affectedWorkforce);
        $('#formCostImpact').val(hindrance.costImpact);
        
        $('#formCorrectiveMeasures').val(hindrance.correctiveMeasures || '');
        $('#correctiveCharCount').text((hindrance.correctiveMeasures || '').length);
        
        $('#formRemovalDate').val(hindrance.removalDate);
        $('#formActualDays').val(hindrance.actualDays);
        $('#formDaysAttributable').val(hindrance.daysAttributable);
        $('#formDaysNotAttributable').val(hindrance.daysNotAttributable);
        $('#formRemarks').val(hindrance.remarks);
        
        $('#formApprover').val(hindrance.approver);
        $('#formApprovalDate').val(hindrance.approvalDate);
        $('#formStatus').val(hindrance.status);
        
        // Load existing attachments
        loadExistingAttachments(hindrance.id);
    }

    /**
     * Load existing attachments for edit
     * @param {string} hindranceId - Hindrance ID
     */
    async function loadExistingAttachments(hindranceId) {
        const container = $('#existingAttachments');
        container.empty();

        try {
            const attachments = await Storage.getAttachmentsByHindranceId(hindranceId);
            
            attachments.forEach(att => {
                const isImage = att.type.startsWith('image/');
                const preview = isImage 
                    ? `<img src="${att.data}" alt="${Utils.escapeHtml(att.name)}">`
                    : `<div class="file-icon"><i class="bi ${Utils.getFileIcon(att.type)}"></i></div>`;
                
                container.append(`
                    <div class="col-4 col-md-3">
                        <div class="attachment-preview" data-id="${att.id}">
                            ${preview}
                            <div class="file-name">${Utils.escapeHtml(att.name)}</div>
                            <button type="button" class="remove-attachment" onclick="Records.removeExistingAttachment('${att.id}')">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                    </div>
                `);
            });
        } catch (e) {
            console.error('Error loading attachments:', e);
        }
    }

    /**
     * Remove existing attachment
     * @param {string} attachmentId - Attachment ID
     */
    async function removeExistingAttachment(attachmentId) {
        const result = await Utils.showConfirm({
            title: 'Remove Attachment?',
            text: 'This attachment will be permanently deleted.',
            icon: 'warning',
            confirmText: 'Yes, remove it'
        });

        if (result.isConfirmed) {
            await Storage.deleteAttachment(attachmentId);
            $(`[data-id="${attachmentId}"]`).closest('.col-4, .col-md-3').remove();
            Utils.showToast('Attachment removed', 'success');
        }
    }

    /**
     * Handle file upload
     */
    async function handleFileUpload(e) {
        const files = Array.from(e.target.files);
        const container = $('#attachmentPreview');
        
        for (const file of files) {
            // Validate file
            if (!Utils.isValidFileType(file)) {
                Utils.showToast(`Invalid file type: ${file.name}`, 'error');
                continue;
            }
            
            if (!Utils.isValidFileSize(file)) {
                Utils.showToast(`File too large: ${file.name} (max 5MB)`, 'error');
                continue;
            }
            
            try {
                const base64 = await Utils.fileToBase64(file);
                const previewId = Utils.generateId('preview');
                const isImage = file.type.startsWith('image/');
                
                const preview = isImage 
                    ? `<img src="${base64}" alt="${Utils.escapeHtml(file.name)}">`
                    : `<div class="file-icon"><i class="bi ${Utils.getFileIcon(file.type)}"></i></div>`;
                
                container.append(`
                    <div class="col-4 col-md-3" id="${previewId}">
                        <div class="attachment-preview" data-name="${Utils.escapeHtml(file.name)}" data-type="${file.type}" data-base64="${base64}">
                            ${preview}
                            <div class="file-name">${Utils.escapeHtml(file.name)}</div>
                            <button type="button" class="remove-attachment" onclick="$('#${previewId}').remove()">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                    </div>
                `);
            } catch (err) {
                console.error('Error processing file:', err);
                Utils.showToast(`Error processing file: ${file.name}`, 'error');
            }
        }
        
        // Clear file input
        $(e.target).val('');
    }

    /**
     * Calculate actual days when dates change
     */
    function calculateDays() {
        const startDate = $('#formStartDate').val();
        const removalDate = $('#formRemovalDate').val();
        
        if (startDate && removalDate) {
            const days = Utils.calculateDays(startDate, removalDate);
            $('#formActualDays').val(days);
            calculateDaysNotAttributable();
        } else if (startDate) {
            const days = Utils.daysSince(startDate);
            $('#formActualDays').val(days);
        }
    }

    /**
     * Calculate days not attributable to contractor
     */
    function calculateDaysNotAttributable() {
        const actualDays = parseInt($('#formActualDays').val()) || 0;
        const attributable = parseInt($('#formDaysAttributable').val()) || 0;
        const notAttributable = Math.max(0, actualDays - attributable);
        $('#formDaysNotAttributable').val(notAttributable);
    }

    /**
     * Save hindrance
     */
    async function saveHindrance() {
        // Validate form
        const form = document.getElementById('hindranceForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            Utils.showToast('Please fill in all required fields', 'error');
            return;
        }

        // Validate date logic
        const startDate = $('#formStartDate').val();
        const removalDate = $('#formRemovalDate').val();
        if (removalDate && new Date(removalDate) < new Date(startDate)) {
            Utils.showToast('Removal date cannot be before start date', 'error');
            return;
        }

        Utils.showLoading('Saving hindrance...');

        try {
            // Collect form data
            const formData = {
                dateOccurrence: $('#formDateOccurrence').val(),
                startDate: startDate,
                nature: $('#formNature').val(),
                natureOther: $('#formNature').val() === 'Other' ? $('#formNatureOther').val() : null,
                workAffected: $('#formWorkAffected').val(),
                description: $('#formDescription').val(),
                responsibleParty: $('input[name="formResponsibility"]:checked').val(),
                severity: $('#formSeverity').val(),
                estimatedDelay: parseInt($('#formEstimatedDelay').val()) || 0,
                affectedWorkforce: parseInt($('#formAffectedWorkforce').val()) || 0,
                costImpact: parseFloat($('#formCostImpact').val()) || 0,
                correctiveMeasures: $('#formCorrectiveMeasures').val(),
                removalDate: removalDate || null,
                actualDays: parseInt($('#formActualDays').val()) || 0,
                daysAttributable: parseInt($('#formDaysAttributable').val()) || 0,
                daysNotAttributable: parseInt($('#formDaysNotAttributable').val()) || 0,
                remarks: $('#formRemarks').val(),
                approver: $('#formApprover').val(),
                approvalDate: $('#formApprovalDate').val() || null,
                status: $('#formStatus').val()
            };

            let hindrance;
            
            if (currentEditId) {
                // Update existing
                hindrance = Storage.updateHindrance(currentEditId, formData);
            } else {
                // Create new
                hindrance = Storage.addHindrance(formData);
            }

            // Save new attachments
            const newAttachments = $('#attachmentPreview .attachment-preview');
            for (let i = 0; i < newAttachments.length; i++) {
                const $att = $(newAttachments[i]);
                await Storage.saveAttachment({
                    hindranceId: hindrance.id,
                    name: $att.data('name'),
                    type: $att.data('type'),
                    data: $att.data('base64')
                });
            }

            // Clear draft
            Storage.clearFormDraft();

            Utils.hideLoading();
            Utils.showToast(currentEditId ? 'Hindrance updated successfully' : 'Hindrance created successfully', 'success');
            
            $('#hindranceModal').modal('hide');
            
            // Refresh table and dashboard
            refreshTable();
            Dashboard.loadStatistics();
            Dashboard.updateCharts();
            Dashboard.loadRecentHindrances();
            Dashboard.loadOverdueHindrances();

        } catch (error) {
            Utils.hideLoading();
            console.error('Save error:', error);
            Utils.showToast('Error saving hindrance', 'error');
        }
    }

    /**
     * Confirm delete hindrance
     * @param {string} id - Hindrance ID
     */
    async function confirmDelete(id) {
        const hindrance = Storage.getHindranceById(id);
        if (!hindrance) return;

        const result = await Utils.showConfirm({
            title: 'Delete Hindrance?',
            text: `Are you sure you want to delete ${hindrance.srNo}? This action cannot be undone.`,
            icon: 'warning',
            confirmText: 'Yes, delete it'
        });

        if (result.isConfirmed) {
            Storage.deleteHindrance(id);
            refreshTable();
            Dashboard.loadStatistics();
            Dashboard.updateCharts();
            Utils.showToast('Hindrance deleted successfully', 'success');
        }
    }

    /**
     * View hindrance details
     * @param {string} id - Hindrance ID
     */
    async function viewDetails(id) {
        const hindrance = Storage.getHindranceById(id);
        if (!hindrance) {
            Utils.showToast('Hindrance not found', 'error');
            return;
        }

        const systemConfig = Storage.getSystemConfig();
        const status = Utils.calculateStatus(hindrance, systemConfig.slaThresholdDays);
        const statusClass = Utils.getStatusBadgeClass(status);
        const severityClass = Utils.getSeverityBadgeClass(hindrance.severity);

        // Build details HTML
        let html = `
            <div class="row">
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0"><i class="bi bi-info-circle me-2"></i>Basic Information</h6>
                        </div>
                        <div class="card-body">
                            <div class="details-grid">
                                <div class="details-item">
                                    <div class="details-label">SR Number</div>
                                    <div class="details-value monospace">${Utils.escapeHtml(hindrance.srNo)}</div>
                                </div>
                                <div class="details-item">
                                    <div class="details-label">Status</div>
                                    <div class="details-value"><span class="badge ${statusClass}">${status}</span></div>
                                </div>
                                <div class="details-item">
                                    <div class="details-label">Date of Occurrence</div>
                                    <div class="details-value monospace">${Utils.formatDateDisplay(hindrance.dateOccurrence)}</div>
                                </div>
                                <div class="details-item">
                                    <div class="details-label">Start Date</div>
                                    <div class="details-value monospace">${Utils.formatDateDisplay(hindrance.startDate)}</div>
                                </div>
                                <div class="details-item">
                                    <div class="details-label">Nature of Hindrance</div>
                                    <div class="details-value">${Utils.escapeHtml(hindrance.nature)}${hindrance.natureOther ? ` - ${Utils.escapeHtml(hindrance.natureOther)}` : ''}</div>
                                </div>
                                <div class="details-item">
                                    <div class="details-label">Work Affected</div>
                                    <div class="details-value">
                                        ${(Array.isArray(hindrance.workAffected) ? hindrance.workAffected : [hindrance.workAffected])
                                            .map(w => `<span class="work-phase-tag">${Utils.escapeHtml(w)}</span>`).join(' ')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0"><i class="bi bi-exclamation-triangle me-2"></i>Impact Assessment</h6>
                        </div>
                        <div class="card-body">
                            <div class="details-grid">
                                <div class="details-item">
                                    <div class="details-label">Responsible Party</div>
                                    <div class="details-value">${Utils.escapeHtml(hindrance.responsibleParty)}</div>
                                </div>
                                <div class="details-item">
                                    <div class="details-label">Severity Level</div>
                                    <div class="details-value"><span class="badge ${severityClass}">${hindrance.severity}</span></div>
                                </div>
                                <div class="details-item">
                                    <div class="details-label">Estimated Delay</div>
                                    <div class="details-value monospace">${hindrance.estimatedDelay || 0} days</div>
                                </div>
                                <div class="details-item">
                                    <div class="details-label">Affected Workforce</div>
                                    <div class="details-value monospace">${hindrance.affectedWorkforce || 0} workers</div>
                                </div>
                                <div class="details-item">
                                    <div class="details-label">Cost Impact</div>
                                    <div class="details-value currency">${Utils.formatCurrency(hindrance.costImpact)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card mb-3">
                <div class="card-header bg-light">
                    <h6 class="mb-0"><i class="bi bi-text-paragraph me-2"></i>Description</h6>
                </div>
                <div class="card-body">
                    <p>${Utils.escapeHtml(hindrance.description) || '<em class="text-muted">No description provided</em>'}</p>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0"><i class="bi bi-tools me-2"></i>Resolution Details</h6>
                        </div>
                        <div class="card-body">
                            <div class="details-grid">
                                <div class="details-item">
                                    <div class="details-label">Removal Date</div>
                                    <div class="details-value monospace">${hindrance.removalDate ? Utils.formatDateDisplay(hindrance.removalDate) : '-'}</div>
                                </div>
                                <div class="details-item">
                                    <div class="details-label">Actual Days</div>
                                    <div class="details-value monospace">${hindrance.actualDays || 0} days</div>
                                </div>
                                <div class="details-item">
                                    <div class="details-label">Days Attributable to Contractor</div>
                                    <div class="details-value monospace">${hindrance.daysAttributable || 0} days</div>
                                </div>
                                <div class="details-item">
                                    <div class="details-label">Days Not Attributable</div>
                                    <div class="details-value monospace">${hindrance.daysNotAttributable || 0} days</div>
                                </div>
                            </div>
                            <hr>
                            <div class="details-label">Corrective Measures</div>
                            <p class="mt-2">${Utils.escapeHtml(hindrance.correctiveMeasures) || '<em class="text-muted">None specified</em>'}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0"><i class="bi bi-pen me-2"></i>Approval & Remarks</h6>
                        </div>
                        <div class="card-body">
                            <div class="details-grid">
                                <div class="details-item">
                                    <div class="details-label">Approver</div>
                                    <div class="details-value">${Utils.escapeHtml(hindrance.approver) || '-'}</div>
                                </div>
                                <div class="details-item">
                                    <div class="details-label">Approval Date</div>
                                    <div class="details-value monospace">${hindrance.approvalDate ? Utils.formatDateDisplay(hindrance.approvalDate) : '-'}</div>
                                </div>
                            </div>
                            <hr>
                            <div class="details-label">Remarks</div>
                            <p class="mt-2">${Utils.escapeHtml(hindrance.remarks) || '<em class="text-muted">No remarks</em>'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add attachments section
        try {
            const attachments = await Storage.getAttachmentsByHindranceId(id);
            if (attachments.length > 0) {
                html += `
                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0"><i class="bi bi-paperclip me-2"></i>Attachments (${attachments.length})</h6>
                        </div>
                        <div class="card-body">
                            <div class="row g-2">
                                ${attachments.map(att => {
                                    const isImage = att.type.startsWith('image/');
                                    const preview = isImage 
                                        ? `<img src="${att.data}" alt="${Utils.escapeHtml(att.name)}" class="cursor-pointer" onclick="window.open('${att.data}')">`
                                        : `<div class="file-icon cursor-pointer" onclick="Records.downloadAttachment('${att.id}')"><i class="bi ${Utils.getFileIcon(att.type)}"></i></div>`;
                                    return `
                                        <div class="col-4 col-md-2">
                                            <div class="attachment-preview">
                                                ${preview}
                                                <div class="file-name">${Utils.escapeHtml(att.name)}</div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }
        } catch (e) {
            console.error('Error loading attachments:', e);
        }

        // Add audit trail
        const auditLog = Storage.getAuditLogForEntity(id);
        if (auditLog.length > 0) {
            html += `
                <div class="card">
                    <div class="card-header bg-light">
                        <h6 class="mb-0"><i class="bi bi-clock-history me-2"></i>Change History</h6>
                    </div>
                    <div class="card-body" style="max-height: 200px; overflow-y: auto;">
                        ${auditLog.slice(0, 10).map(entry => `
                            <div class="audit-log-item">
                                <span class="audit-log-time">${Utils.formatDateTime(entry.timestamp)}</span>
                                <span class="audit-log-user">${Utils.escapeHtml(entry.user)}</span>
                                <span class="audit-log-action">${entry.action}d this record</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        $('#viewSrNo').text(hindrance.srNo);
        $('#viewDetailsContent').html(html);
        $('#btnViewEdit').data('id', id);
        $('#btnViewDownloadPDF').data('id', id);

        // Show/hide edit button based on permissions
        $('#btnViewEdit').toggle(Auth.can('update', hindrance));

        $('#viewDetailsModal').modal('show');
    }

    /**
     * Download attachment
     * @param {string} attachmentId - Attachment ID
     */
    async function downloadAttachment(attachmentId) {
        try {
            const attachment = await Storage.getAttachment(attachmentId);
            if (attachment) {
                const link = document.createElement('a');
                link.href = attachment.data;
                link.download = attachment.name;
                link.click();
            }
        } catch (e) {
            console.error('Error downloading attachment:', e);
            Utils.showToast('Error downloading attachment', 'error');
        }
    }

    /**
     * Reset form to default state
     */
    function resetForm() {
        const form = document.getElementById('hindranceForm');
        form.reset();
        form.classList.remove('was-validated');
        
        currentEditId = null;
        $('#hindranceId').val('');
        $('#formSrNo').val('');
        $('#formNatureOtherContainer').hide();
        $('#descriptionCharCount').text('0');
        $('#correctiveCharCount').text('0');
        $('#formActualDays').val('');
        $('#formDaysNotAttributable').val('');
        $('#attachmentPreview').empty();
        $('#existingAttachments').empty();
        $('#formAutoSaveStatus').text('');
        
        populateFormDropdowns();
    }

    /**
     * Start auto-save interval
     */
    function startAutoSave() {
        stopAutoSave();
        autoSaveInterval = setInterval(() => {
            saveFormDraft();
        }, APP_CONFIG.AUTO_SAVE_INTERVAL);
    }

    /**
     * Stop auto-save interval
     */
    function stopAutoSave() {
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
            autoSaveInterval = null;
        }
    }

    /**
     * Save form draft
     */
    function saveFormDraft() {
        if (currentEditId) return; // Don't save draft for edits

        const formData = {
            dateOccurrence: $('#formDateOccurrence').val(),
            startDate: $('#formStartDate').val(),
            nature: $('#formNature').val(),
            natureOther: $('#formNatureOther').val(),
            workAffected: $('#formWorkAffected').val(),
            description: $('#formDescription').val(),
            responsibleParty: $('input[name="formResponsibility"]:checked').val(),
            severity: $('#formSeverity').val(),
            estimatedDelay: $('#formEstimatedDelay').val(),
            affectedWorkforce: $('#formAffectedWorkforce').val(),
            correctiveMeasures: $('#formCorrectiveMeasures').val(),
            remarks: $('#formRemarks').val()
        };

        Storage.saveFormDraft(formData);
        $('#formAutoSaveStatus').text(`Draft saved at ${new Date().toLocaleTimeString()}`);
    }

    /**
     * Check for existing draft
     */
    function checkForDraft() {
        const draft = Storage.getFormDraft();
        if (!draft || !draft.data) return;

        const savedAt = new Date(draft.savedAt);
        const minutesAgo = Math.round((new Date() - savedAt) / 60000);

        if (minutesAgo < 60) {
            Utils.showConfirm({
                title: 'Restore Draft?',
                text: `You have an unsaved draft from ${minutesAgo} minutes ago. Would you like to restore it?`,
                icon: 'question',
                confirmText: 'Yes, restore',
                cancelText: 'No, start fresh'
            }).then(result => {
                if (result.isConfirmed) {
                    restoreFormDraft(draft.data);
                } else {
                    Storage.clearFormDraft();
                }
            });
        }
    }

    /**
     * Restore form from draft
     * @param {Object} data - Draft data
     */
    function restoreFormDraft(data) {
        if (data.dateOccurrence) $('#formDateOccurrence').val(data.dateOccurrence);
        if (data.startDate) $('#formStartDate').val(data.startDate);
        if (data.nature) {
            $('#formNature').val(data.nature);
            if (data.nature === 'Other') {
                $('#formNatureOtherContainer').show();
                $('#formNatureOther').val(data.natureOther || '');
            }
        }
        if (data.workAffected) $('#formWorkAffected').val(data.workAffected);
        if (data.description) {
            $('#formDescription').val(data.description);
            $('#descriptionCharCount').text(data.description.length);
        }
        if (data.responsibleParty) {
            $(`input[name="formResponsibility"][value="${data.responsibleParty}"]`).prop('checked', true);
        }
        if (data.severity) $('#formSeverity').val(data.severity);
        if (data.estimatedDelay) $('#formEstimatedDelay').val(data.estimatedDelay);
        if (data.affectedWorkforce) $('#formAffectedWorkforce').val(data.affectedWorkforce);
        if (data.correctiveMeasures) {
            $('#formCorrectiveMeasures').val(data.correctiveMeasures);
            $('#correctiveCharCount').text(data.correctiveMeasures.length);
        }
        if (data.remarks) $('#formRemarks').val(data.remarks);

        Utils.showToast('Draft restored', 'info');
    }

    /**
     * Apply advanced filters
     */
    function applyFilters() {
        const dateFrom = $('#filterDateFrom').val();
        const dateTo = $('#filterDateTo').val();
        const status = $('#filterStatus').val();
        const responsibility = $('#filterResponsibility').val();
        const severity = $('#filterSeverity').val();
        const workPhase = $('#filterWorkPhase').val();
        const nature = $('#filterNature').val();

        // Apply custom filtering to DataTable
        $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
            const rowData = dataTable.row(dataIndex).data();
            
            // Date range filter
            if (dateFrom || dateTo) {
                const rowDate = new Date(rowData.startDate);
                if (dateFrom && rowDate < new Date(dateFrom)) return false;
                if (dateTo && rowDate > new Date(dateTo)) return false;
            }
            
            // Status filter
            if (status && status.length > 0) {
                const systemConfig = Storage.getSystemConfig();
                const rowStatus = Utils.calculateStatus(rowData, systemConfig.slaThresholdDays);
                if (!status.includes(rowStatus)) return false;
            }
            
            // Responsibility filter
            if (responsibility && rowData.responsibleParty !== responsibility) return false;
            
            // Severity filter
            if (severity && rowData.severity !== severity) return false;
            
            // Work phase filter
            if (workPhase && workPhase.length > 0) {
                const phases = Array.isArray(rowData.workAffected) ? rowData.workAffected : [rowData.workAffected];
                if (!workPhase.some(p => phases.includes(p))) return false;
            }
            
            // Nature filter
            if (nature && rowData.nature !== nature) return false;
            
            return true;
        });

        dataTable.draw();
        
        // Clear the custom filter after applying
        $.fn.dataTable.ext.search.pop();
        
        Utils.showToast('Filters applied', 'info');
    }

    /**
     * Clear all filters
     */
    function clearFilters() {
        $('#advancedFiltersForm')[0].reset();
        dataTable.search('').columns().search('').draw();
        Utils.showToast('Filters cleared', 'info');
    }

    /**
     * Export data
     * @param {string} format - Export format (csv, excel, pdf)
     */
    function exportData(format) {
        const projectConfig = Storage.getProjectConfig();
        const filename = `Hindrance_Register_${projectConfig.projectName.replace(/\s+/g, '_')}_${Utils.formatDateStorage(new Date())}`;

        switch (format) {
            case 'csv':
                dataTable.button('.buttons-csv').trigger();
                break;
            case 'excel':
                dataTable.button('.buttons-excel').trigger();
                break;
            case 'pdf':
                generatePDFExport(filename);
                break;
        }
    }

    /**
     * Generate PDF export
     * @param {string} filename - Output filename
     */
    function generatePDFExport(filename) {
        const hindrances = Storage.getHindrances();
        const projectConfig = Storage.getProjectConfig();

        const docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            content: [
                { text: projectConfig.projectName, style: 'header' },
                { text: 'Hindrance Register Report', style: 'subheader' },
                { text: `Generated on: ${Utils.formatDateDisplay(new Date())}`, style: 'date' },
                { text: '\n' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
                        body: [
                            ['SR No.', 'Date', 'Nature', 'Work Affected', 'Status', 'Responsible', 'Days'],
                            ...hindrances.map(h => [
                                h.srNo,
                                Utils.formatDateDisplay(h.startDate),
                                h.nature,
                                Array.isArray(h.workAffected) ? h.workAffected.join(', ') : h.workAffected,
                                Utils.calculateStatus(h),
                                h.responsibleParty,
                                h.actualDays || Utils.daysSince(h.startDate)
                            ])
                        ]
                    }
                }
            ],
            styles: {
                header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                subheader: { fontSize: 14, bold: true, margin: [0, 0, 0, 5] },
                date: { fontSize: 10, color: 'gray' }
            }
        };

        pdfMake.createPdf(docDefinition).download(filename + '.pdf');
        Utils.showToast('PDF exported successfully', 'success');
    }

    /**
     * Download single hindrance as PDF
     * @param {string} id - Hindrance ID
     */
    function downloadHindrancePDF(id) {
        const hindrance = Storage.getHindranceById(id);
        if (!hindrance) return;

        const projectConfig = Storage.getProjectConfig();
        const systemConfig = Storage.getSystemConfig();
        const status = Utils.calculateStatus(hindrance, systemConfig.slaThresholdDays);

        const docDefinition = {
            pageSize: 'A4',
            content: [
                { text: projectConfig.projectName, style: 'header' },
                { text: `Hindrance Record - ${hindrance.srNo}`, style: 'subheader' },
                { text: '\n' },
                {
                    columns: [
                        { text: 'Date of Occurrence:', style: 'label' },
                        { text: Utils.formatDateDisplay(hindrance.dateOccurrence) }
                    ]
                },
                {
                    columns: [
                        { text: 'Status:', style: 'label' },
                        { text: status }
                    ]
                },
                { text: '\n' },
                { text: 'Nature of Hindrance', style: 'sectionHeader' },
                { text: hindrance.nature + (hindrance.natureOther ? ` - ${hindrance.natureOther}` : '') },
                { text: '\n' },
                { text: 'Work Affected', style: 'sectionHeader' },
                { text: Array.isArray(hindrance.workAffected) ? hindrance.workAffected.join(', ') : hindrance.workAffected },
                { text: '\n' },
                { text: 'Description', style: 'sectionHeader' },
                { text: hindrance.description || 'No description provided' },
                { text: '\n' },
                { text: 'Impact Assessment', style: 'sectionHeader' },
                {
                    table: {
                        widths: ['*', '*'],
                        body: [
                            ['Responsible Party', hindrance.responsibleParty],
                            ['Severity', hindrance.severity],
                            ['Estimated Delay', `${hindrance.estimatedDelay || 0} days`],
                            ['Affected Workforce', `${hindrance.affectedWorkforce || 0} workers`],
                            ['Cost Impact', Utils.formatCurrency(hindrance.costImpact)]
                        ]
                    },
                    layout: 'lightHorizontalLines'
                },
                { text: '\n' },
                { text: 'Resolution Details', style: 'sectionHeader' },
                {
                    table: {
                        widths: ['*', '*'],
                        body: [
                            ['Start Date', Utils.formatDateDisplay(hindrance.startDate)],
                            ['Removal Date', hindrance.removalDate ? Utils.formatDateDisplay(hindrance.removalDate) : '-'],
                            ['Actual Days', `${hindrance.actualDays || 0} days`],
                            ['Days Attributable', `${hindrance.daysAttributable || 0} days`],
                            ['Days Not Attributable', `${hindrance.daysNotAttributable || 0} days`]
                        ]
                    },
                    layout: 'lightHorizontalLines'
                },
                { text: '\n' },
                { text: 'Corrective Measures', style: 'sectionHeader' },
                { text: hindrance.correctiveMeasures || 'None specified' },
                { text: '\n' },
                { text: 'Remarks', style: 'sectionHeader' },
                { text: hindrance.remarks || 'No remarks' },
                { text: '\n\n' },
                {
                    columns: [
                        {
                            text: `Approver: ${hindrance.approver || '_______________'}`,
                            width: '*'
                        },
                        {
                            text: `Date: ${hindrance.approvalDate ? Utils.formatDateDisplay(hindrance.approvalDate) : '_______________'}`,
                            width: '*'
                        }
                    ]
                }
            ],
            styles: {
                header: { fontSize: 16, bold: true, margin: [0, 0, 0, 5] },
                subheader: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
                sectionHeader: { fontSize: 12, bold: true, margin: [0, 10, 0, 5], color: '#008B8B' },
                label: { bold: true }
            }
        };

        pdfMake.createPdf(docDefinition).download(`Hindrance_${hindrance.srNo}.pdf`);
        Utils.showToast('PDF downloaded', 'success');
    }

    /**
     * Print table
     */
    function printTable() {
        window.print();
    }

    /**
     * Show column visibility modal
     */
    function showColumnVisibilityModal() {
        const columns = dataTable.columns().header().toArray();
        const container = $('#columnToggles');
        container.empty();

        columns.forEach((col, index) => {
            const isVisible = dataTable.column(index).visible();
            const colName = $(col).text() || `Column ${index + 1}`;
            
            if (colName !== 'Actions') {
                container.append(`
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="colToggle${index}" 
                            ${isVisible ? 'checked' : ''} onchange="Records.toggleColumn(${index}, this.checked)">
                        <label class="form-check-label" for="colToggle${index}">${colName}</label>
                    </div>
                `);
            }
        });

        $('#columnVisibilityModal').modal('show');
    }

    /**
     * Toggle column visibility
     * @param {number} index - Column index
     * @param {boolean} visible - Visibility state
     */
    function toggleColumn(index, visible) {
        dataTable.column(index).visible(visible);
    }

    // Public API
    return {
        init,
        refreshTable,
        openCreateModal,
        edit,
        confirmDelete,
        viewDetails,
        downloadAttachment,
        removeExistingAttachment,
        toggleColumn
    };
})();
