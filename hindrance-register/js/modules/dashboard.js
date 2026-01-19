/**
 * Hindrance Register - Dashboard Module
 * Dashboard statistics, charts, and visualization
 */

const Dashboard = (function() {
    'use strict';

    // Chart instances
    let timelineChart = null;
    let statusChart = null;
    let workPhaseChart = null;
    let responsibilityChart = null;

    /**
     * Initialize dashboard
     */
    function init() {
        loadStatistics();
        initCharts();
        loadRecentHindrances();
        loadOverdueHindrances();
        bindEvents();
    }

    /**
     * Bind dashboard events
     */
    function bindEvents() {
        // Refresh button
        $('#btnRefreshDashboard').on('click', refresh);
        
        // Quick create button
        $('#btnQuickCreate, #fabCreateHindrance').on('click', () => {
            Records.openCreateModal();
        });

        // Timeline period buttons
        $('#pageDashboard .btn-group[role="group"] .btn').on('click', function() {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            const period = parseInt($(this).data('period'));
            updateTimelineChart(period);
        });
    }

    /**
     * Refresh dashboard data
     */
    function refresh() {
        Utils.showLoading('Refreshing dashboard...');
        setTimeout(() => {
            loadStatistics();
            updateCharts();
            loadRecentHindrances();
            loadOverdueHindrances();
            Utils.hideLoading();
            Utils.showToast('Dashboard refreshed', 'success');
        }, 500);
    }

    /**
     * Load and display statistics
     */
    function loadStatistics() {
        const hindrances = Storage.getHindrances();
        const systemConfig = Storage.getSystemConfig();
        const slaThreshold = systemConfig.slaThresholdDays || 5;

        // Calculate status for each hindrance
        const processedHindrances = hindrances.map(h => ({
            ...h,
            calculatedStatus: Utils.calculateStatus(h, slaThreshold)
        }));

        // Basic counts
        const total = processedHindrances.length;
        const active = processedHindrances.filter(h => h.calculatedStatus === 'Active').length;
        const resolved = processedHindrances.filter(h => h.calculatedStatus === 'Resolved').length;
        const overdue = processedHindrances.filter(h => h.calculatedStatus === 'Overdue').length;
        const pending = processedHindrances.filter(h => h.calculatedStatus === 'Pending Approval').length;

        // Average resolution time
        const resolvedHindrances = processedHindrances.filter(h => h.removalDate && h.startDate);
        let avgResolutionTime = 0;
        if (resolvedHindrances.length > 0) {
            const totalDays = resolvedHindrances.reduce((sum, h) => {
                return sum + Utils.calculateDays(h.startDate, h.removalDate);
            }, 0);
            avgResolutionTime = Math.round(totalDays / resolvedHindrances.length);
        }

        // Update KPI cards
        $('#statTotalRecords').text(total);
        $('#statActiveHindrances').text(active);
        $('#statResolvedHindrances').text(resolved);
        $('#statOverdueHindrances').text(overdue);
        $('#statAvgResolutionTime').text(avgResolutionTime);
        $('#statPendingApproval').text(pending);

        // Quick stats
        // Oldest pending
        const activeHindrances = processedHindrances.filter(h => 
            h.calculatedStatus === 'Active' || h.calculatedStatus === 'Overdue'
        );
        let oldestPending = 0;
        if (activeHindrances.length > 0) {
            const oldest = activeHindrances.reduce((max, h) => {
                const days = Utils.daysSince(h.startDate);
                return days > max ? days : max;
            }, 0);
            oldestPending = oldest;
        }
        $('#statOldestPending').text(oldestPending + ' days');

        // Most common type
        if (processedHindrances.length > 0) {
            const typeCounts = Utils.countBy(processedHindrances, 'nature');
            const mostCommon = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
            $('#statMostCommonType').text(mostCommon ? mostCommon[0] : '-');
        } else {
            $('#statMostCommonType').text('-');
        }

        // Success rate (resolved on time)
        let successRate = 0;
        if (resolvedHindrances.length > 0) {
            const onTime = resolvedHindrances.filter(h => {
                const days = Utils.calculateDays(h.startDate, h.removalDate);
                return days <= slaThreshold;
            }).length;
            successRate = Math.round((onTime / resolvedHindrances.length) * 100);
        }
        $('#statSuccessRate').text(successRate + '%');

        // Total delay days
        const totalDelayDays = processedHindrances.reduce((sum, h) => {
            if (h.removalDate && h.startDate) {
                return sum + Utils.calculateDays(h.startDate, h.removalDate);
            } else if (h.startDate && !h.removalDate) {
                return sum + Utils.daysSince(h.startDate);
            }
            return sum;
        }, 0);
        $('#statTotalDelayDays').text(Utils.formatIndianNumber(totalDelayDays));

        // Update overdue count badge
        $('#overdueCount').text(overdue);
    }

    /**
     * Initialize all charts
     */
    function initCharts() {
        initTimelineChart();
        initStatusChart();
        initWorkPhaseChart();
        initResponsibilityChart();
    }

    /**
     * Initialize timeline chart (Line chart)
     */
    function initTimelineChart() {
        const ctx = document.getElementById('chartTimeline');
        if (!ctx) return;

        const data = getTimelineData(30);

        timelineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Created',
                        data: data.created,
                        borderColor: APP_CONFIG.CHART_COLORS.primary,
                        backgroundColor: 'rgba(0, 139, 139, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Resolved',
                        data: data.resolved,
                        borderColor: APP_CONFIG.CHART_COLORS.success,
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                ...APP_CONFIG.CHART_CONFIG,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    /**
     * Get timeline data for chart
     * @param {number} days - Number of days to include
     * @returns {Object} Chart data
     */
    function getTimelineData(days) {
        const hindrances = Storage.getHindrances();
        const labels = [];
        const created = [];
        const resolved = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = Utils.formatDateStorage(date);
            
            labels.push(Utils.formatDateDisplay(date));
            
            // Count created on this date
            const createdCount = hindrances.filter(h => 
                h.dateOccurrence === dateStr || h.startDate === dateStr
            ).length;
            created.push(createdCount);
            
            // Count resolved on this date
            const resolvedCount = hindrances.filter(h => 
                h.removalDate === dateStr
            ).length;
            resolved.push(resolvedCount);
        }

        return { labels, created, resolved };
    }

    /**
     * Update timeline chart with new period
     * @param {number} days - Number of days
     */
    function updateTimelineChart(days) {
        if (!timelineChart) return;

        const data = getTimelineData(days);
        timelineChart.data.labels = data.labels;
        timelineChart.data.datasets[0].data = data.created;
        timelineChart.data.datasets[1].data = data.resolved;
        timelineChart.update();
    }

    /**
     * Initialize status distribution chart (Doughnut)
     */
    function initStatusChart() {
        const ctx = document.getElementById('chartStatusDistribution');
        if (!ctx) return;

        const data = getStatusData();

        statusChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Resolved', 'Overdue', 'Pending'],
                datasets: [{
                    data: [data.active, data.resolved, data.overdue, data.pending],
                    backgroundColor: [
                        APP_CONFIG.CHART_COLORS.warning,
                        APP_CONFIG.CHART_COLORS.success,
                        APP_CONFIG.CHART_COLORS.danger,
                        '#6C757D'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                ...APP_CONFIG.CHART_CONFIG,
                cutout: '60%',
                plugins: {
                    ...APP_CONFIG.CHART_CONFIG.plugins,
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    /**
     * Get status distribution data
     * @returns {Object} Status counts
     */
    function getStatusData() {
        const hindrances = Storage.getHindrances();
        const systemConfig = Storage.getSystemConfig();
        const slaThreshold = systemConfig.slaThresholdDays || 5;

        let active = 0, resolved = 0, overdue = 0, pending = 0;

        hindrances.forEach(h => {
            const status = Utils.calculateStatus(h, slaThreshold);
            switch (status) {
                case 'Active': active++; break;
                case 'Resolved': resolved++; break;
                case 'Overdue': overdue++; break;
                case 'Pending Approval': pending++; break;
            }
        });

        return { active, resolved, overdue, pending };
    }

    /**
     * Initialize work phase chart (Bar)
     */
    function initWorkPhaseChart() {
        const ctx = document.getElementById('chartWorkPhase');
        if (!ctx) return;

        const data = getWorkPhaseData();

        workPhaseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Hindrances',
                    data: data.counts,
                    backgroundColor: APP_CONFIG.CHART_COLORS.palette,
                    borderRadius: 4
                }]
            },
            options: {
                ...APP_CONFIG.CHART_CONFIG,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    ...APP_CONFIG.CHART_CONFIG.plugins,
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    /**
     * Get work phase distribution data
     * @returns {Object} Work phase data
     */
    function getWorkPhaseData() {
        const hindrances = Storage.getHindrances();
        const phaseCounts = {};

        // Initialize all phases with 0
        APP_CONFIG.WORK_PHASES.forEach(phase => {
            phaseCounts[phase.value] = 0;
        });

        // Count hindrances per phase
        hindrances.forEach(h => {
            if (h.workAffected) {
                const phases = Array.isArray(h.workAffected) ? h.workAffected : [h.workAffected];
                phases.forEach(phase => {
                    if (phaseCounts[phase] !== undefined) {
                        phaseCounts[phase]++;
                    }
                });
            }
        });

        return {
            labels: Object.keys(phaseCounts),
            counts: Object.values(phaseCounts)
        };
    }

    /**
     * Initialize responsibility chart (Pie)
     */
    function initResponsibilityChart() {
        const ctx = document.getElementById('chartResponsibility');
        if (!ctx) return;

        const data = getResponsibilityData();

        responsibilityChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.counts,
                    backgroundColor: [
                        APP_CONFIG.CHART_COLORS.primary,
                        APP_CONFIG.CHART_COLORS.warning,
                        APP_CONFIG.CHART_COLORS.info,
                        APP_CONFIG.CHART_COLORS.purple
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                ...APP_CONFIG.CHART_CONFIG,
                plugins: {
                    ...APP_CONFIG.CHART_CONFIG.plugins,
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    /**
     * Get responsibility distribution data
     * @returns {Object} Responsibility data
     */
    function getResponsibilityData() {
        const hindrances = Storage.getHindrances();
        const respCounts = Utils.countBy(hindrances, 'responsibleParty');

        const labels = [];
        const counts = [];

        APP_CONFIG.RESPONSIBILITY_PARTIES.forEach(party => {
            labels.push(party.value);
            counts.push(respCounts[party.value] || 0);
        });

        return { labels, counts };
    }

    /**
     * Update all charts with fresh data
     */
    function updateCharts() {
        // Update timeline
        const periodBtn = $('#pageDashboard .btn-group[role="group"] .btn.active');
        const period = parseInt(periodBtn.data('period')) || 30;
        updateTimelineChart(period);

        // Update status chart
        if (statusChart) {
            const statusData = getStatusData();
            statusChart.data.datasets[0].data = [
                statusData.active,
                statusData.resolved,
                statusData.overdue,
                statusData.pending
            ];
            statusChart.update();
        }

        // Update work phase chart
        if (workPhaseChart) {
            const phaseData = getWorkPhaseData();
            workPhaseChart.data.labels = phaseData.labels;
            workPhaseChart.data.datasets[0].data = phaseData.counts;
            workPhaseChart.update();
        }

        // Update responsibility chart
        if (responsibilityChart) {
            const respData = getResponsibilityData();
            responsibilityChart.data.labels = respData.labels;
            responsibilityChart.data.datasets[0].data = respData.counts;
            responsibilityChart.update();
        }
    }

    /**
     * Load recent hindrances list
     */
    function loadRecentHindrances() {
        const hindrances = Storage.getHindrances();
        const recent = Utils.sortByDate(hindrances, 'createdAt', 'desc').slice(0, 5);
        const container = $('#recentHindrancesList');

        container.empty();

        if (recent.length === 0) {
            container.html(`
                <div class="list-group-item text-center text-muted py-4">
                    <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                    No recent hindrances
                </div>
            `);
            return;
        }

        recent.forEach(h => {
            const statusClass = Utils.getStatusBadgeClass(Utils.calculateStatus(h));
            container.append(`
                <a href="#" class="list-group-item list-group-item-action hindrance-list-item" data-id="${h.id}">
                    <div class="hindrance-info">
                        <span class="hindrance-sr">${Utils.escapeHtml(h.srNo)}</span>
                        <span class="hindrance-nature text-truncate d-block">${Utils.escapeHtml(h.nature)}</span>
                        <span class="hindrance-date">${Utils.formatDateDisplay(h.startDate)}</span>
                    </div>
                    <span class="badge ${statusClass}">${Utils.calculateStatus(h)}</span>
                </a>
            `);
        });

        // Bind click events
        container.find('.hindrance-list-item').on('click', function(e) {
            e.preventDefault();
            const id = $(this).data('id');
            Records.viewDetails(id);
        });
    }

    /**
     * Load overdue hindrances list
     */
    function loadOverdueHindrances() {
        const hindrances = Storage.getHindrances();
        const systemConfig = Storage.getSystemConfig();
        const slaThreshold = systemConfig.slaThresholdDays || 5;

        const overdue = hindrances.filter(h => {
            return Utils.calculateStatus(h, slaThreshold) === 'Overdue';
        }).slice(0, 5);

        const container = $('#overdueHindrancesList');

        container.empty();

        if (overdue.length === 0) {
            container.html(`
                <div class="list-group-item text-center text-muted py-4">
                    <i class="bi bi-check-circle fs-2 d-block mb-2 text-success"></i>
                    No overdue hindrances
                </div>
            `);
            return;
        }

        overdue.forEach(h => {
            const daysPending = Utils.daysSince(h.startDate);
            container.append(`
                <a href="#" class="list-group-item list-group-item-action hindrance-list-item" data-id="${h.id}">
                    <div class="hindrance-info">
                        <span class="hindrance-sr">${Utils.escapeHtml(h.srNo)}</span>
                        <span class="hindrance-nature text-truncate d-block">${Utils.escapeHtml(h.nature)}</span>
                        <span class="hindrance-date text-danger"><strong>${daysPending} days overdue</strong></span>
                    </div>
                    <span class="badge badge-status-overdue">Overdue</span>
                </a>
            `);
        });

        // Bind click events
        container.find('.hindrance-list-item').on('click', function(e) {
            e.preventDefault();
            const id = $(this).data('id');
            Records.viewDetails(id);
        });
    }

    /**
     * Destroy charts (for cleanup)
     */
    function destroyCharts() {
        if (timelineChart) {
            timelineChart.destroy();
            timelineChart = null;
        }
        if (statusChart) {
            statusChart.destroy();
            statusChart = null;
        }
        if (workPhaseChart) {
            workPhaseChart.destroy();
            workPhaseChart = null;
        }
        if (responsibilityChart) {
            responsibilityChart.destroy();
            responsibilityChart = null;
        }
    }

    // Public API
    return {
        init,
        refresh,
        loadStatistics,
        updateCharts,
        loadRecentHindrances,
        loadOverdueHindrances,
        destroyCharts
    };
})();
