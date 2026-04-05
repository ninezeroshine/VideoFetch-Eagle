'use strict';

const { DOWNLOAD_BUTTON_LABEL } = require('../utils/constants');
const { escapeHtml, swapTagMediaType } = require('../utils/html');

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
        onModeSwitch,
        onOpenInstallGuide,
        onPaste,
        onReuseUrl,
        onScan,
        onStopDownload,
    } = options;

    const elements = {
        autoInstallFfmpegButton: document.getElementById('autoInstallFfmpegBtn'),
        autoInstallYtdlpButton: document.getElementById('autoInstallYtdlpBtn'),
        batchInput: document.getElementById('batchInput'),
        batchMode: document.getElementById('batchMode'),
        batchSummary: document.getElementById('batchSummary'),
        clearHistoryButton: document.getElementById('historyClearBtn'),
        downloadButton: document.getElementById('downloadBtn'),
        downloadList: document.getElementById('downloadList'),
        historyList: document.getElementById('historyList'),
        historySection: document.getElementById('historySection'),
        installButton: document.getElementById('installBtn'),
        modeTabs: Array.from(document.querySelectorAll('.mode-tab')),
        pasteButton: document.getElementById('pasteBtn'),
        previewCard: document.getElementById('previewCard'),
        scanButton: document.getElementById('scanBtn'),
        singleMode: document.getElementById('singleMode'),
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

    elements.pasteButton.addEventListener('click', onPaste);
    elements.scanButton.addEventListener('click', onScan);
    elements.downloadButton.onclick = onDownload;
    elements.clearHistoryButton.addEventListener('click', onClearHistory);
    elements.installButton.addEventListener('click', onOpenInstallGuide);
    elements.autoInstallYtdlpButton.addEventListener('click', onAutoInstallYtdlp);
    elements.autoInstallFfmpegButton.addEventListener('click', onAutoInstallFfmpeg);

    elements.modeTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            onModeSwitch(tab.dataset.mode);
        });
    });

    elements.batchInput.addEventListener('input', function () {
        updateBatchSummary();
    });

    function setStatus(message, type) {
        elements.statusBox.classList.add('visible');
        elements.statusDot.className = `status-dot ${type}`;
        elements.statusMessage.className = `status-message ${type === 'error' ? 'error-msg' : type === 'success' ? 'success-msg' : ''}`;
        elements.statusMessage.textContent = message;
    }

    function clearStatus() {
        elements.statusBox.classList.remove('visible');
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
                            elements.tagsInput.value = swapTagMediaType(elements.tagsInput.value, choice.value);
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

    /* ─── Mode switching (Single / Batch) ─── */

    function setMode(mode) {
        elements.modeTabs.forEach(function (tab) {
            tab.classList.toggle('active', tab.dataset.mode === mode);
        });

        elements.singleMode.style.display = mode === 'single' ? '' : 'none';
        elements.batchMode.style.display = mode === 'batch' ? '' : 'none';

        if (mode === 'batch') {
            elements.downloadButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">'
                + '<path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
                + '<path d="M2 13H14" stroke="white" stroke-width="2" stroke-linecap="round"/>'
                + '</svg> Download All';
        } else {
            elements.downloadButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none">'
                + '<path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
                + '<path d="M2 13H14" stroke="white" stroke-width="2" stroke-linecap="round"/>'
                + '</svg> ' + DOWNLOAD_BUTTON_LABEL;
        }
    }

    function getBatchInput() {
        return elements.batchInput.value;
    }

    function updateBatchSummary() {
        const text = elements.batchInput.value.trim();

        if (!text) {
            elements.batchSummary.innerHTML = '';
            return;
        }

        const lines = text.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
        const supported = lines.filter(function (l) {
            return /twitter\.com|x\.com|youtube\.com|youtu\.be|instagram\.com|tiktok\.com/i.test(l);
        });

        elements.batchSummary.innerHTML = '<span class="batch-count">' + supported.length + '</span> supported link'
            + (supported.length !== 1 ? 's' : '') + ' detected out of ' + lines.length;
    }

    /* ─── Download cards ─── */

    function updateDownloadCard(id, item) {
        let card = elements.downloadList.querySelector('[data-download-id="' + id + '"]');

        if (!card) {
            card = document.createElement('div');
            card.className = 'download-card';
            card.dataset.downloadId = id;
            card.innerHTML = '<div class="download-card-header">'
                + '<span class="download-card-title"></span>'
                + '<span class="download-card-badge"></span>'
                + '<button class="download-card-stop" type="button">&times;</button>'
                + '</div>'
                + '<div class="download-card-bar"><div class="download-card-fill"></div></div>'
                + '<div class="download-card-info"></div>';

            card.querySelector('.download-card-stop').addEventListener('click', function () {
                onStopDownload(id);
            });

            elements.downloadList.prepend(card);
        }

        const title = card.querySelector('.download-card-title');
        const badge = card.querySelector('.download-card-badge');
        const info = card.querySelector('.download-card-info');
        const stopBtn = card.querySelector('.download-card-stop');

        title.textContent = item.title || item.url;
        badge.textContent = item.state;
        badge.className = 'download-card-badge ' + item.state;
        card.className = 'download-card ' + item.state;

        if (item.state === 'error') {
            info.textContent = item.error || '';
        }

        const isActive = item.state === 'queued' || item.state === 'scanning' || item.state === 'downloading' || item.state === 'merging';
        stopBtn.style.display = isActive ? '' : 'none';
    }

    function updateDownloadCardProgress(id, progress) {
        const card = elements.downloadList.querySelector('[data-download-id="' + id + '"]');

        if (!card) {
            return;
        }

        const fill = card.querySelector('.download-card-fill');
        const info = card.querySelector('.download-card-info');

        fill.style.width = Math.round(progress.pct || 0) + '%';
        info.textContent = progress.info || '';
    }

    function updateDownloadButton(_hasActive, totalCount) {
        if (totalCount === 0) {
            elements.downloadButton.disabled = false;
        }
    }

    return {
        animateProviderSwitch,
        clearStatus,
        focusUrlInput,
        getBatchInput,
        getProviderOptions,
        getTags,
        getUrl,
        hidePreview,
        renderHistory,
        setMode,
        setProviderForm,
        setScanLoading,
        setSelectedProvider,
        setStatus,
        setUrl,
        showPreview,
        updateDownloadButton,
        updateDownloadCard,
        updateDownloadCardProgress,
        updateFfmpegStatus,
        updateYtdlpStatus,
    };
}

module.exports = {
    createUi,
};
