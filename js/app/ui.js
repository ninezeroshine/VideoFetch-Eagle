'use strict';

const { DOWNLOAD_BUTTON_LABEL, DOWNLOAD_BUTTON_LOADING_LABEL, DOWNLOAD_BUTTON_STOP_LABEL } = require('../utils/constants');
const { escapeHtml } = require('../utils/html');

const PROGRESS_STAGE_SEQUENCE = ['preparing', 'downloading', 'merging', 'importing', 'success', 'failure'];
const PROGRESS_STAGE_BADGE_LABELS = {
    downloading: 'Downloading',
    failure: 'Error',
    importing: 'Importing',
    merging: 'Merging',
    preparing: 'Preparing',
    success: 'Done',
};
const PROGRESS_STAGE_TITLE_LABELS = {
    downloading: 'Downloading media...',
    failure: 'Download failed',
    importing: 'Importing into Eagle...',
    merging: 'Merging media...',
    preparing: 'Preparing download...',
    success: 'Ready in Eagle',
};
const PROGRESS_STAGE_PERCENT_RANGES = {
    downloading: { end: 84, start: 18 },
    failure: { end: 100, start: 0 },
    importing: { end: 99, start: 94 },
    merging: { end: 94, start: 84 },
    preparing: { end: 18, start: 4 },
    success: { end: 100, start: 100 },
};
const PROGRESS_STAGE_ALIASES = {
    complete: 'success',
    completed: 'success',
    download: 'downloading',
    done: 'success',
    downloading: 'downloading',
    error: 'failure',
    failed: 'failure',
    failure: 'failure',
    import: 'importing',
    importing: 'importing',
    loading: 'preparing',
    merge: 'merging',
    merging: 'merging',
    'post processing': 'merging',
    'post-processing': 'merging',
    postprocessing: 'merging',
    prepare: 'preparing',
    preparing: 'preparing',
    processing: 'merging',
    queued: 'preparing',
    ready: 'success',
    retry: 'downloading',
    retrying: 'downloading',
    starting: 'preparing',
    success: 'success',
};

function titleCaseWords(value) {
    return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

function normalizeProgressStageValue(value) {
    if (typeof value !== 'string') {
        return null;
    }

    const normalizedValue = value.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');

    if (!normalizedValue) {
        return null;
    }

    if (PROGRESS_STAGE_ALIASES[normalizedValue]) {
        return PROGRESS_STAGE_ALIASES[normalizedValue];
    }

    if (normalizedValue.includes('fail') || normalizedValue.includes('error')) {
        return 'failure';
    }

    if (normalizedValue.includes('success') || normalizedValue.includes('done') || normalizedValue.includes('complete') || normalizedValue.includes('finish')) {
        return 'success';
    }

    if (normalizedValue.includes('import')) {
        return 'importing';
    }

    if (normalizedValue.includes('merge') || normalizedValue.includes('mux') || normalizedValue.includes('post process')) {
        return 'merging';
    }

    if (normalizedValue.includes('retry') || normalizedValue.includes('download')) {
        return 'downloading';
    }

    if (normalizedValue.includes('prepar') || normalizedValue.includes('queue') || normalizedValue.includes('start')) {
        return 'preparing';
    }

    return null;
}

function formatProgressStageBadge(stage, rawValue) {
    if (typeof rawValue === 'string') {
        const normalizedValue = rawValue.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');

        if (normalizedValue === 'retrying' || normalizedValue === 'queued' || normalizedValue === 'starting') {
            return titleCaseWords(normalizedValue);
        }
    }

    return PROGRESS_STAGE_BADGE_LABELS[stage] || PROGRESS_STAGE_BADGE_LABELS.preparing;
}

function resolveProgressStage(details) {
    if (!details || typeof details !== 'object') {
        return null;
    }

    const explicitStageFields = [details.stage, details.phase, details.state, details.status];

    for (const fieldValue of explicitStageFields) {
        const normalizedStage = normalizeProgressStageValue(fieldValue);

        if (normalizedStage) {
            return {
                badgeLabel: formatProgressStageBadge(normalizedStage, fieldValue),
                stage: normalizedStage,
            };
        }
    }

    const inferredStageFields = [details.label, details.info];

    for (const fieldValue of inferredStageFields) {
        const normalizedStage = normalizeProgressStageValue(fieldValue);

        if (normalizedStage) {
            return {
                badgeLabel: PROGRESS_STAGE_BADGE_LABELS[normalizedStage] || PROGRESS_STAGE_BADGE_LABELS.preparing,
                stage: normalizedStage,
            };
        }
    }

    return null;
}

function getProgressLabelFallback(stage, badgeLabel) {
    if (stage === 'downloading' && badgeLabel === 'Retrying') {
        return 'Retrying download...';
    }

    return PROGRESS_STAGE_TITLE_LABELS[stage] || PROGRESS_STAGE_TITLE_LABELS.preparing;
}

function clampProgressValue(value) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return 0;
    }

    return Math.max(0, Math.min(100, value));
}

function mapProgressToStageRange(stage, pct, fallbackPct) {
    const resolvedPct = typeof pct === 'number' ? clampProgressValue(pct) : null;

    if (typeof resolvedPct === 'number') {
        return resolvedPct;
    }

    if (stage === 'failure') {
        return typeof resolvedPct === 'number' ? resolvedPct : clampProgressValue(fallbackPct);
    }

    const stageRange = PROGRESS_STAGE_PERCENT_RANGES[stage] || PROGRESS_STAGE_PERCENT_RANGES.preparing;

    return stageRange.start;
}

function getOptionKey(optionDefinition, index) {
    return optionDefinition.key || optionDefinition.id || optionDefinition.name || `option-${index}`;
}

function normalizeOptionChoices(optionDefinition) {
    const rawChoices = optionDefinition.options || optionDefinition.choices || [];

    return rawChoices.map((choice) => {
        if (choice && typeof choice === 'object') {
            const value = choice.value != null ? String(choice.value) : '';

            return {
                label: choice.label || choice.name || value,
                value,
            };
        }

        return {
            label: String(choice),
            value: String(choice),
        };
    });
}

function getOptionDefaultValue(optionDefinition) {
    const choices = normalizeOptionChoices(optionDefinition);

    if (optionDefinition.defaultValue != null) {
        return String(optionDefinition.defaultValue);
    }

    if (choices[0]) {
        return choices[0].value;
    }

    if (optionDefinition.value != null) {
        return String(optionDefinition.value);
    }

    return '';
}

function getSchemaDefaultValues(schema) {
    return schema.reduce((values, optionDefinition, index) => {
        values[getOptionKey(optionDefinition, index)] = getOptionDefaultValue(optionDefinition);
        return values;
    }, {});
}

function resolveProviderOptionConfig(provider, options) {
    const resolvedOptions = options || {};
    const providedOptions = resolvedOptions.providerOptions;
    const schema = Array.isArray(resolvedOptions.providerOptionSchema)
        ? resolvedOptions.providerOptionSchema
        : Array.isArray(providedOptions)
            ? providedOptions
            : Array.isArray(providedOptions && providedOptions.schema)
                ? providedOptions.schema
                : Array.isArray(providedOptions && providedOptions.fields)
                    ? providedOptions.fields
                    : [];
    const defaults = resolvedOptions.providerOptionDefaults
        || (providedOptions && providedOptions.defaults)
        || {};
    const values = resolvedOptions.providerOptionValues
        || (providedOptions && providedOptions.values)
        || {};

    return {
        defaults,
        schema,
        values,
    };
}

function isSelectOption(optionDefinition) {
    return (optionDefinition.type || optionDefinition.control) === 'select';
}

function isChipOption(optionDefinition) {
    return optionDefinition.type === 'chips';
}

function createUi(options) {
    const {
        onAutoInstallFfmpeg,
        onAutoInstallYtdlp,
        onClearHistory,
        onDownload,
        onOpenInstallGuide,
        onPaste,
        onReuseUrl,
        onScan,
        onStop,
    } = options;

    const elements = {
        autoInstallFfmpegButton: document.getElementById('autoInstallFfmpegBtn'),
        autoInstallYtdlpButton: document.getElementById('autoInstallYtdlpBtn'),
        clearHistoryButton: document.getElementById('historyClearBtn'),
        downloadButton: document.getElementById('downloadBtn'),
        historyList: document.getElementById('historyList'),
        historySection: document.getElementById('historySection'),
        installButton: document.getElementById('installBtn'),
        pasteButton: document.getElementById('pasteBtn'),
        previewCard: document.getElementById('previewCard'),
        scanButton: document.getElementById('scanBtn'),
        progressFill: document.getElementById('progressFill'),
        progressInfo: document.getElementById('progressInfo'),
        progressLabel: document.getElementById('progressLabel'),
        progressPct: document.getElementById('progressPct'),
        progressSection: document.getElementById('progressSection'),
        progressStageBadge: document.getElementById('progressStageBadge'),
        progressStageSteps: Array.from(document.querySelectorAll('[data-stage-step]')),
        providerOptions: document.getElementById('providerOptions'),
        providerTabs: Array.from(document.querySelectorAll('.platform-tab[data-provider-id]')),
        statusBox: document.getElementById('statusBox'),
        statusDot: document.getElementById('statusDot'),
        statusMessage: document.getElementById('statusMessage'),
        tagsInput: document.getElementById('tagsInput'),
        urlInput: document.getElementById('urlInput'),
        urlLabel: document.getElementById('urlLabel'),
        ffmpegBanner: document.getElementById('ffmpegBanner'),
        warningBanner: document.getElementById('warningBanner'),
        ytdlpIndicator: document.getElementById('ytdlpIndicator'),
        ytdlpText: document.getElementById('ytdlpText'),
    };

    const providerOptionStateByProviderId = {};
    let currentProviderId = null;
    let currentProviderOptionSchema = [];
    let currentProviderOptionValues = {};
    let displayedProgressPct = 0;
    let lastActiveProgressStageIndex = 0;
    let progressAnimationFrame = null;

    elements.pasteButton.addEventListener('click', onPaste);
    elements.scanButton.addEventListener('click', onScan);
    elements.downloadButton.onclick = onDownload;
    elements.clearHistoryButton.addEventListener('click', onClearHistory);
    elements.installButton.addEventListener('click', onOpenInstallGuide);
    elements.autoInstallYtdlpButton.addEventListener('click', onAutoInstallYtdlp);
    elements.autoInstallFfmpegButton.addEventListener('click', onAutoInstallFfmpeg);

    function setStatus(message, type) {
        elements.statusBox.classList.add('visible');
        elements.statusDot.className = `status-dot ${type}`;
        elements.statusMessage.className = `status-message ${type === 'error' ? 'error-msg' : type === 'success' ? 'success-msg' : ''}`;
        elements.statusMessage.textContent = message;
    }

    function clearStatus() {
        elements.statusBox.classList.remove('visible');
    }

    function showProgress(visible) {
        elements.progressSection.classList.toggle('visible', Boolean(visible));
    }

    function resetProgress() {
        if (progressAnimationFrame) {
            cancelAnimationFrame(progressAnimationFrame);
            progressAnimationFrame = null;
        }

        lastActiveProgressStageIndex = 0;
        setRenderedProgress(0);
        updateProgressStage({
            badgeLabel: PROGRESS_STAGE_BADGE_LABELS.preparing,
            stage: 'preparing',
        });
        elements.progressLabel.textContent = PROGRESS_STAGE_TITLE_LABELS.preparing;
        elements.progressInfo.textContent = '';
    }

    function setRenderedProgress(pct) {
        const clampedPct = clampProgressValue(pct);

        displayedProgressPct = clampedPct;
        elements.progressFill.style.width = `${clampedPct}%`;
        elements.progressPct.textContent = `${Math.round(clampedPct)}%`;
    }

    function animateProgressTo(targetPct) {
        const nextTarget = clampProgressValue(targetPct);

        if (progressAnimationFrame) {
            cancelAnimationFrame(progressAnimationFrame);
            progressAnimationFrame = null;
        }

        if (typeof requestAnimationFrame !== 'function' || Math.abs(nextTarget - displayedProgressPct) < 0.5) {
            setRenderedProgress(nextTarget);
            return;
        }

        const direction = nextTarget >= displayedProgressPct ? 1 : -1;
        const stepSize = Math.max(0.8, Math.abs(nextTarget - displayedProgressPct) / 8);

        function tick() {
            const remainingDistance = Math.abs(nextTarget - displayedProgressPct);

            if (remainingDistance <= 0.5) {
                setRenderedProgress(nextTarget);
                progressAnimationFrame = null;
                return;
            }

            setRenderedProgress(displayedProgressPct + (stepSize * direction));
            progressAnimationFrame = requestAnimationFrame(tick);
        }

        progressAnimationFrame = requestAnimationFrame(tick);
    }

    function updateProgressStage(stageDetails) {
        const nextStage = stageDetails && stageDetails.stage ? stageDetails.stage : 'preparing';
        const nextStageIndex = PROGRESS_STAGE_SEQUENCE.indexOf(nextStage);
        const successStageIndex = PROGRESS_STAGE_SEQUENCE.indexOf('success');

        if (nextStageIndex === -1) {
            return;
        }

        if (nextStage !== 'success' && nextStage !== 'failure') {
            lastActiveProgressStageIndex = nextStageIndex;
        }

        elements.progressSection.dataset.progressState = nextStage;
        elements.progressStageBadge.textContent = stageDetails && stageDetails.badgeLabel
            ? stageDetails.badgeLabel
            : (PROGRESS_STAGE_BADGE_LABELS[nextStage] || PROGRESS_STAGE_BADGE_LABELS.preparing);

        elements.progressStageSteps.forEach((step) => {
            const stepStage = step.dataset.stageStep;
            const stepIndex = PROGRESS_STAGE_SEQUENCE.indexOf(stepStage);
            let isComplete = false;

            if (nextStage === 'success') {
                isComplete = stepIndex > -1 && stepIndex < successStageIndex;
            } else if (nextStage === 'failure') {
                isComplete = stepIndex > -1 && stepIndex < lastActiveProgressStageIndex;
            } else {
                isComplete = stepIndex > -1 && stepIndex < nextStageIndex;
            }

            if (stepStage === 'failure' || stepStage === 'success') {
                isComplete = nextStage === 'success' && stepStage !== 'success'
                    ? isComplete
                    : false;
            }

            step.classList.toggle('is-active', stepStage === nextStage);
            step.classList.toggle('is-complete', isComplete);
        });
    }

    function updateProgress(details) {
        const safeDetails = details || {};
        const stageDetails = resolveProgressStage(safeDetails);

        if (stageDetails || typeof safeDetails.pct === 'number') {
            const progressTarget = mapProgressToStageRange(
                stageDetails ? stageDetails.stage : 'preparing',
                safeDetails.pct,
                displayedProgressPct
            );

            animateProgressTo(progressTarget);
        }

        if (stageDetails) {
            updateProgressStage(stageDetails);
        }

        if (typeof safeDetails.label === 'string' && safeDetails.label.trim()) {
            elements.progressLabel.textContent = safeDetails.label;
        } else if (stageDetails) {
            elements.progressLabel.textContent = getProgressLabelFallback(stageDetails.stage, stageDetails.badgeLabel);
        }

        if (typeof safeDetails.info === 'string') {
            elements.progressInfo.textContent = safeDetails.info;
        }
    }

    function updateYtdlpStatus(isReady) {
        elements.ytdlpIndicator.className = `ytdlp-indicator ${isReady ? 'ok' : 'missing'}`;
        elements.ytdlpText.textContent = isReady ? 'yt-dlp ready' : 'yt-dlp missing';
        elements.warningBanner.classList.toggle('visible', !isReady);
        elements.downloadButton.disabled = !isReady;
    }

    function updateFfmpegStatus(isReady) {
        elements.ffmpegBanner.classList.toggle('visible', !isReady);
    }

    function setDownloadButtonLoading() {
        elements.downloadButton.disabled = false;
        elements.downloadButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="3" width="10" height="10" rx="2" fill="white"/>
            </svg>
            ${DOWNLOAD_BUTTON_STOP_LABEL}
        `;
        elements.downloadButton.onclick = onStop;
        elements.downloadButton.classList.add('stop-mode');
    }

    function resetDownloadButton(isEnabled) {
        elements.downloadButton.disabled = !isEnabled;
        elements.downloadButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 13H14" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
            ${DOWNLOAD_BUTTON_LABEL}
        `;
        elements.downloadButton.onclick = onDownload;
        elements.downloadButton.classList.remove('stop-mode');
    }

    function renderHistory(items) {
        if (!items.length) {
            elements.historySection.style.display = 'none';
            elements.historyList.innerHTML = '';
            return;
        }

        elements.historySection.style.display = 'flex';
        elements.historyList.innerHTML = items.map((item, index) => {
            const icon = item.success
                ? '<div class="history-status-icon ok"><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5L4.5 8L9 3" stroke="#22c55e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'
                : '<div class="history-status-icon fail"><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3 3L8 8M8 3L3 8" stroke="#ef4444" stroke-width="1.7" stroke-linecap="round"/></svg></div>';
            const time = new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return `<div class="history-item" data-history-index="${index}">
                ${icon}
                <div class="history-info">
                    <div class="history-url">${escapeHtml(item.url)}</div>
                    <div class="history-meta">${time} · ${escapeHtml(item.detail || '')}</div>
                </div>
            </div>`;
        }).join('');

        elements.historyList.querySelectorAll('[data-history-index]').forEach((node) => {
            node.addEventListener('click', () => {
                const index = Number(node.dataset.historyIndex);
                onReuseUrl(index);
            });
        });
    }

    function createOptionInfo(optionDefinition) {
        const info = document.createElement('div');
        info.className = 'option-info';

        const name = document.createElement('div');
        name.className = 'option-name';
        name.textContent = optionDefinition.label || 'Option';
        info.appendChild(name);

        if (optionDefinition.description) {
            const description = document.createElement('div');
            description.className = 'option-desc';
            description.textContent = optionDefinition.description;
            info.appendChild(description);
        }

        return info;
    }

    function renderProviderOptions(provider, options) {
        const optionConfig = resolveProviderOptionConfig(provider, options);
        const schemaDefaults = getSchemaDefaultValues(optionConfig.schema);
        const storedValues = providerOptionStateByProviderId[provider.id] || {};
        const nextValues = Object.assign({}, schemaDefaults, optionConfig.defaults, storedValues, optionConfig.values);

        currentProviderId = provider.id;
        currentProviderOptionSchema = optionConfig.schema.slice();
        currentProviderOptionValues = Object.assign({}, nextValues);
        elements.providerOptions.innerHTML = '';

        optionConfig.schema.forEach((optionDefinition, index) => {
            const optionKey = getOptionKey(optionDefinition, index);

            if (isChipOption(optionDefinition)) {
                const chipRow = document.createElement('div');
                chipRow.className = 'chip-row option-row';

                const label = document.createElement('div');
                label.className = 'chip-row-label';
                label.textContent = optionDefinition.label || 'Option';
                chipRow.appendChild(label);

                const group = document.createElement('div');
                group.className = 'chip-group';
                const choices = normalizeOptionChoices(optionDefinition);
                const fallbackValue = getOptionDefaultValue(optionDefinition);
                const requestedValue = nextValues[optionKey] != null ? String(nextValues[optionKey]) : fallbackValue;
                const selectedValue = choices.some((c) => c.value === requestedValue) ? requestedValue : fallbackValue;

                currentProviderOptionValues[optionKey] = selectedValue;

                choices.forEach((choice) => {
                    const chip = document.createElement('button');
                    chip.type = 'button';
                    chip.className = 'chip' + (choice.value === selectedValue ? ' active' : '');
                    chip.textContent = choice.label;
                    chip.dataset.value = choice.value;

                    chip.addEventListener('click', () => {
                        group.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
                        chip.classList.add('active');
                        currentProviderOptionValues[optionKey] = choice.value;
                        providerOptionStateByProviderId[provider.id] = Object.assign({}, currentProviderOptionValues);

                        if (optionKey === 'format') {
                            const tags = elements.tagsInput.value;
                            elements.tagsInput.value = choice.value === 'mp3'
                                ? tags.replace(/\bvideo\b/g, 'audio')
                                : tags.replace(/\baudio\b/g, 'video');
                        }
                    });

                    group.appendChild(chip);
                });

                chipRow.appendChild(group);
                elements.providerOptions.appendChild(chipRow);
                return;
            }

            const row = document.createElement('div');
            row.className = `option-row${isSelectOption(optionDefinition) ? ' option-row-control' : ''}`;
            row.appendChild(createOptionInfo(optionDefinition));

            if (isSelectOption(optionDefinition)) {
                const control = document.createElement('div');
                const select = document.createElement('select');
                const choices = normalizeOptionChoices(optionDefinition);
                const fallbackValue = getOptionDefaultValue(optionDefinition);
                const requestedValue = nextValues[optionKey] != null ? String(nextValues[optionKey]) : fallbackValue;
                const selectedValue = choices.some((choice) => choice.value === requestedValue)
                    ? requestedValue
                    : fallbackValue;

                control.className = 'option-control';
                select.className = 'option-select';
                select.dataset.providerOptionControl = optionKey;

                choices.forEach((choice) => {
                    const optionNode = document.createElement('option');
                    optionNode.value = choice.value;
                    optionNode.textContent = choice.label;
                    optionNode.selected = choice.value === selectedValue;
                    select.appendChild(optionNode);
                });

                currentProviderOptionValues[optionKey] = selectedValue;

                select.addEventListener('change', () => {
                    currentProviderOptionValues[optionKey] = select.value;
                    providerOptionStateByProviderId[provider.id] = Object.assign({}, currentProviderOptionValues);
                });

                control.appendChild(select);
                row.appendChild(control);
            } else {
                const value = document.createElement('div');
                const staticValue = nextValues[optionKey] != null ? String(nextValues[optionKey]) : getOptionDefaultValue(optionDefinition);

                value.className = 'option-value';
                value.textContent = staticValue;
                currentProviderOptionValues[optionKey] = staticValue;
                row.appendChild(value);
            }

            elements.providerOptions.appendChild(row);
        });

        providerOptionStateByProviderId[provider.id] = Object.assign({}, currentProviderOptionValues);
    }

    function setProviderForm(provider, options) {
        const resolvedOptions = options || {};
        const currentTags = elements.tagsInput.value.trim();
        const nextTags = provider.getDefaultTags().join(', ');
        const previousTags = resolvedOptions.previousDefaultTags || '';
        const shouldReplaceTags = !currentTags || currentTags === previousTags;

        renderProviderOptions(provider, resolvedOptions);
        elements.urlLabel.textContent = provider.getInputLabel();
        elements.urlInput.placeholder = provider.getInputPlaceholder();
        elements.tagsInput.placeholder = `${nextTags}, download...`;

        if (shouldReplaceTags) {
            elements.tagsInput.value = nextTags;
        }
    }

    function setSelectedProvider(selectedProviderId, implementedProviderIds, shouldPositionIndicator) {
        elements.providerTabs.forEach((tab) => {
            const providerId = tab.dataset.providerId;
            const isImplemented = implementedProviderIds.includes(providerId);
            tab.disabled = !isImplemented;
            tab.classList.toggle('active', providerId === selectedProviderId);
            tab.classList.toggle('disabled-tab', !isImplemented);
        });

        if (shouldPositionIndicator) {
            positionTabIndicator(selectedProviderId);
        }
    }

    function positionTabIndicator(providerId) {
        const indicator = document.getElementById('tabIndicator');
        const activeTab = document.querySelector('.platform-tab[data-provider-id="' + providerId + '"]');

        if (!indicator || !activeTab) {
            return;
        }

        const tabsRect = activeTab.parentElement.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();

        indicatorX = tabRect.left - tabsRect.left;
        indicatorW = tabRect.width;

        indicator.style.transform = 'translateX(' + indicatorX + 'px)';
        indicator.style.width = indicatorW + 'px';
        indicator.style.height = tabRect.height + 'px';
        indicator.classList.add('visible');
    }

    function formatDuration(seconds) {
        if (!seconds || seconds <= 0) {
            return '';
        }

        const rounded = Math.floor(seconds);
        const h = Math.floor(rounded / 3600);
        const m = Math.floor((rounded % 3600) / 60);
        const s = rounded % 60;

        if (h > 0) {
            return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        }

        return m + ':' + String(s).padStart(2, '0');
    }

    function formatViewCount(count) {
        if (!count || count <= 0) {
            return '';
        }

        if (count >= 1000000) {
            return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M views';
        }

        if (count >= 1000) {
            return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K views';
        }

        return count + ' views';
    }

    function showPreview(metadata) {
        if (!metadata) {
            hidePreview();
            return;
        }

        const thumbUrl = (metadata.thumbnail || '').replace(/'/g, "\\'");
        const durationText = formatDuration(metadata.duration);
        const viewText = formatViewCount(metadata.viewCount);

        const thumbHtml = '<div class="preview-thumb-wrap">'
            + '<div class="preview-thumb" style="background-image:url(\'' + thumbUrl + '\')"></div>'
            + (durationText ? '<div class="preview-duration">' + durationText + '</div>' : '')
            + '</div>';

        const metaParts = [];

        if (metadata.channel) {
            metaParts.push(escapeHtml(metadata.channel));
        }

        if (viewText) {
            metaParts.push(viewText);
        }

        const infoHtml = '<div class="preview-info">'
            + '<div class="preview-title">' + escapeHtml(metadata.title || '') + '</div>'
            + (metaParts.length > 0
                ? '<div class="preview-meta">' + metaParts.join('<span class="preview-meta-dot"></span>') + '</div>'
                : '')
            + '</div>';

        elements.previewCard.innerHTML = thumbHtml + infoHtml;
        elements.previewCard.style.display = 'flex';
    }

    function hidePreview() {
        elements.previewCard.innerHTML = '';
        elements.previewCard.style.display = 'none';
    }

    function getUrl() {
        return elements.urlInput.value.trim();
    }

    function setUrl(url) {
        elements.urlInput.value = url;
    }

    function getTags() {
        return elements.tagsInput.value.trim();
    }

    function getProviderOptions() {
        if (!currentProviderId) {
            return {};
        }

        return currentProviderOptionSchema.reduce((values, optionDefinition, index) => {
            if (!isSelectOption(optionDefinition) && !isChipOption(optionDefinition)) {
                return values;
            }

            values[getOptionKey(optionDefinition, index)] = currentProviderOptionValues[getOptionKey(optionDefinition, index)];
            return values;
        }, {});
    }

    function focusUrlInput() {
        elements.urlInput.focus();
    }

    let indicatorX = 0;
    let indicatorW = 0;

    function moveTabIndicator(anim, providerId) {
        const indicator = document.getElementById('tabIndicator');
        const activeTab = document.querySelector('.platform-tab[data-provider-id="' + providerId + '"]');

        if (!indicator || !activeTab) {
            return;
        }

        const tabsRect = activeTab.parentElement.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        const toX = tabRect.left - tabsRect.left;
        const toW = tabRect.width;

        if (indicatorW === 0) {
            // First render — no animation, just position
            positionTabIndicator(providerId);
            return;
        }

        anim.elasticSlide(indicator, indicatorX, indicatorW, toX, toW);
        indicatorX = toX;
        indicatorW = toW;
    }

    function animateProviderSwitch(provider, options) {
        const anim = options.animateModule;
        const container = elements.providerOptions;
        const oldRows = container.querySelectorAll('.option-row');

        moveTabIndicator(anim, provider.id);

        if (oldRows.length > 0) {
            const outAnim = anim.animate(
                oldRows,
                { opacity: [1, 0], transform: ['translateY(0px)', 'translateY(-4px)'] },
                { duration: anim.DURATION.fast, easing: anim.EASING.out }
            );

            outAnim.finished.then(function () {
                outAnim.stop();

                setProviderForm(provider, options);

                const newRows = container.querySelectorAll('.option-row');

                if (newRows.length > 0) {
                    anim.staggerIn(newRows, { y: 8, interval: 0.04 });
                }
            });
        } else {
            setProviderForm(provider, options);

            const newRows = container.querySelectorAll('.option-row');

            if (newRows.length > 0) {
                anim.staggerIn(newRows, { y: 8, interval: 0.04 });
            }
        }

        anim.springPop(elements.downloadButton);
    }

    function setScanLoading(isLoading) {
        elements.scanButton.classList.toggle('scanning', isLoading);
        elements.scanButton.disabled = isLoading;
    }

    updateProgressStage({
        badgeLabel: PROGRESS_STAGE_BADGE_LABELS.preparing,
        stage: 'preparing',
    });

    return {
        animateProviderSwitch,
        clearStatus,
        focusUrlInput,
        getProviderOptions,
        getTags,
        getUrl,
        hidePreview,
        renderHistory,
        resetProgress,
        resetDownloadButton,
        setDownloadButtonLoading,
        setProviderForm,
        setScanLoading,
        setSelectedProvider,
        setStatus,
        setUrl,
        showPreview,
        showProgress,
        updateFfmpegStatus,
        updateProgress,
        updateYtdlpStatus,
    };
}

module.exports = {
    createUi,
};
