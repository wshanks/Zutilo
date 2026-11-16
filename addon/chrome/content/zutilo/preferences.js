/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global window, document, Components, KeyboardEvent, Services, Zotero */
/* global Zutilo */
// The core module under the URL the running version imported it with
// (bootstrap.js; zutilo.mjs init publishes it as a default pref).
var { Zutilo } = ChromeUtils.importESModule(
    Services.prefs.getDefaultBranch('extensions.zutilo.').getStringPref('moduleURL', 'chrome://zutilo/content/zutilo.mjs'));

// eslint-disable-next-line no-unused-vars
window.initializePrefWindow = function() {
    ZutiloShortcutEditor.init();
}

// Kept for a pane document that still calls it on load; the one list is built
// by ZutiloShortcutEditor.init().
// eslint-disable-next-line no-unused-vars
window.buildMenuPrefs = function() {}

// ONE list of every function (MJT 2026-11-15: "merge everything in the same
// list, with the search bar at the top"): a line each -- its name, then, for a
// function that can be in a context menu, its three menu choices as icons in
// aligned columns (Zotero's own menu: Zotero's Z; Zutilo's submenu: Zutilo's
// icon; hidden: Zotero's hide icon), then its shortcut. The choices' wording is
// said once, in the legend, and on each choice as its tooltip and accessible
// name ("too heavy to put the same text again and again").
const MENU_CHOICES = ['Zotero', 'Zutilo', 'Hide'];

// The starred functions, listed on top (ZutiloShortcutEditor._starred).
const STARRED_PREF = 'extensions.zutilo.starred';
// Functions whose clash / context line the user folded away (a click on the row's icon).
const NOTES_HIDDEN_PREF = 'extensions.zutilo.shortcutNotesHidden';

function menuChoiceIcon(choice) {
    if (choice == 'Zotero') {
        return 'chrome://zotero/skin/z.svg';
    }
    if (choice == 'Zutilo') {
        return Zutilo.rootURI + 'zutilo.png';
    }
    return 'chrome://zotero/skin/16/universal/hide.svg';
}

// The legend is also a filter (MJT 2026-11-15): a click on a choice shows only
// the functions placed there; a second click shows them all again.
function buildMenuLegend(legend, onPick) {
    const html = 'http://www.w3.org/1999/xhtml';
    legend.textContent = '';
    const buttons = [];
    for (const choice of MENU_CHOICES) {
        const item = document.createElementNS(html, 'button');
        item.className = 'zutilo-menu-legend-item';
        item.dataset.choice = choice;
        item.setAttribute('aria-pressed', 'false');
        document.l10n.setAttributes(item, 'zutilo-preferences-filter-placement');
        const icon = document.createXULElement('image');
        icon.classList.add('zutilo-menu-icon');
        icon.setAttribute('src', menuChoiceIcon(choice));
        const label = document.createElementNS(html, 'span');
        label.textContent = Zutilo.getString(`zutilo.preferences.itemmenu.${choice}`);
        item.append(icon, label);
        item.addEventListener('click', () => onPick(choice));
        legend.appendChild(item);
        buttons.push(item);
    }
    return buttons;
}

// A function's menu choices: a radiogroup bound to its pref. Built once with the
// list -- a search only hides lines -- so Zotero's settings binding, made when
// the pane loads, stays on the same elements.
function menuRadiogroup(menuName, menuFunction) {
    const group = document.createXULElement('radiogroup');
    group.classList.add('zutilo-menu-choice');
    group.setAttribute('orient', 'horizontal');
    group.setAttribute('align', 'center');
    group.setAttribute('preference', `extensions.zutilo.${menuName}menu.${menuFunction}`);
    for (const choice of MENU_CHOICES) {
        const text = Zutilo.getString(`zutilo.preferences.${menuName}menu.${choice}`);
        const radio = document.createXULElement('radio');
        radio.setAttribute('value', choice);
        // radio.js shows `src` as the radio's icon (.radio-icon), Firefox 140 and 153.
        radio.setAttribute('src', menuChoiceIcon(choice));
        radio.setAttribute('tooltiptext', text);
        radio.setAttribute('aria-label', text);
        group.appendChild(radio);
    }
    return group;
}

/******************************************/
// Shortcut editor
/******************************************/
// Every function with its category and keys, built by script in Zotero's
// Settings window (no inline handlers: settings panes do not run them). The
// pref format is the one of every earlier Zutilo, so stored shortcuts keep
// working: extensions.zutilo.shortcut.<name> =
// {"modifiers": "accel,alt", "key": "L", "keycode": ""}.
var ZutiloShortcutEditor = {
    _names: [],
    _recording: null,    // {name, button}
    _pending: null,      // {name, key, conflicts}
    _rowMsg: null,       // {name, text, actions}: a refused key or the clash question, under its row
    _vkNames: null,

    init: function() {
        try {
            this._list = document.getElementById('zutilo-shortcut-list');
            this._filter = document.getElementById('zutilo-shortcut-filter');
            if (!this._list) {
                return;
            }
            this._vkNames = {};
            for (const prop in KeyboardEvent) {
                if (prop.startsWith('DOM_VK_')) {
                    this._vkNames[KeyboardEvent[prop]] = prop.slice(4);
                }
            }
            // Every function: those with a shortcut, and those that can be in a
            // context menu (two of which, the extra QuickCopy formats, have no
            // shortcut). `_menus`: function -> 'item' | 'collection'.
            this._menus = new Map();
            for (const menuName of ['item', 'collection']) {
                for (const fn of (Zutilo._menuFunctions[menuName] || [])) {
                    this._menus.set(fn, menuName);
                }
            }
            this._names = [...new Set([...Object.keys(Zutilo.keys.shortcuts), ...this._menus.keys()])];
            // The filters: the search, where a function is placed (the legend),
            // and whether it has a shortcut (two chips); they combine.
            this._placement = null;
            this._withKeys = null;
            const legend = document.getElementById('zutilo-prefpane-menu-legend');
            this._legendButtons = legend ? buildMenuLegend(legend, choice => {
                this._placement = this._placement == choice ? null : choice;
                this.filter();
            }) : [];
            this._chips = {
                with: document.getElementById('zutilo-filter-with'),
                without: document.getElementById('zutilo-filter-without')
            };
            for (const [which, chip] of Object.entries(this._chips)) {
                if (chip) {
                    chip.addEventListener('click', () => {
                        this._withKeys = this._withKeys == which ? null : which;
                        this.filter();
                    });
                }
            }
            this._filter.addEventListener('input', () => this.filter());
            // Zotero's code-handled shortcuts for this platform; the warnings
            // are drawn again once they are in.
            this._zoteroCode = [];
            fetch('chrome://zutilo/content/zoteroShortcuts.json')
                .then(r => r.json())
                .then(data => {
                    const onPlatform = e => !e.platform
                        || (e.platform == 'mac' ? Zotero.isMac
                            : e.platform == 'notmac' ? !Zotero.isMac
                            : e.platform == 'linux' ? Zotero.isLinux : true);
                    this._zoteroCode = ((data && data.shortcuts) || []).filter(onPlatform);
                    this.refresh();
                })
                .catch(e => Zotero.logError(e));
            // Another plugin's shortcuts changed while the pane is open: the
            // warnings follow.
            this._changedObserver = {observe: () => this.refresh()};
            Services.obs.addObserver(this._changedObserver, Zutilo.SHORTCUTS_CHANGED);
            // Given back on the PANE's unload, not the window's: Zotero sends
            // `unload` to each pane's root and then nukes the pane's sandbox
            // (Zotero_Preferences.onUnload), so a window `unload` listener runs
            // into a dead object, logs "can't access dead object" and leaves the
            // observer behind (found 2026-11-15).
            const paneRoot = document.getElementById('zutilo-shortcuts-section');
            (paneRoot && paneRoot.parentElement || window).addEventListener('unload', () => {
                try {
                    Services.obs.removeObserver(this._changedObserver, Zutilo.SHORTCUTS_CHANGED);
                }
                catch (e) {}
            }, {once: true});
            this.build();
        } catch (e) {
            Zotero.logError(e);
        }
    },

    // A function's name as the menu settings have always shown it, else as the
    // shortcut list did.
    _label: function(name) {
        const menuName = this._menus.get(name);
        if (menuName) {
            try {
                const s = Zutilo.getString(`zutilo.preferences.${menuName}menu.${name}`);
                if (s && s != `zutilo.preferences.${menuName}menu.${name}`) {
                    return s;
                }
            } catch (e) {}
        }
        return this._name(name);
    },

    // The category a line is listed under: its shortcut's; a menu-only function
    // (an extra QuickCopy format) goes with QuickCopy.
    _categoryOf: function(name) {
        if (Zutilo.keys.categories[name]) {
            return this._category(name);
        }
        const base = name.replace(/_alt\d+$/, '').replace(/Alt\d+$/, '');
        if (Zutilo.keys.categories[base]) {
            return this._category(base);
        }
        return this._category('copyItems');
    },

    _l10n: async function(id, args) {
        try {
            const v = await document.l10n.formatValue(id, args);
            if (v) {
                return v;
            }
        } catch (e) {}
        return id;
    },

    _name: function(name) {
        try {
            return Zutilo.keys.keyName(name);
        } catch (e) {
            return name;
        }
    },

    _category: function(name) {
        try {
            return Zutilo.keys.categoryName(Zutilo.keys.categories[name]);
        } catch (e) {
            return Zutilo.keys.categories[name] || '';
        }
    },

    _get: function(name) {
        try {
            const k = Zutilo.keys.getKey(name) || {};
            return {modifiers: k.modifiers || '', key: k.key || '', keycode: k.keycode || ''};
        } catch (e) {
            return {modifiers: '', key: '', keycode: ''};
        }
    },

    isSet: function(k) {
        return !!(k && (k.key || k.keycode));
    },

    // The modifiers as a set, "accel" resolved for this platform: what a key
    // element matches on (Ctrl on Windows and Linux, Cmd on macOS).
    normalizeModifiers: function(mods) {
        const out = new Set();
        for (let m of String(mods || '').split(/[\s,]+/)) {
            m = m.trim().toLowerCase();
            if (!m || m == 'any') {
                continue;
            }
            if (m == 'accel') {
                m = Zotero.isMac ? 'meta' : 'control';
            }
            if (m == 'os') {
                m = 'meta';
            }
            out.add(m);
        }
        return [...out].sort().join(',');
    },

    sameKey: function(a, b) {
        if (!this.isSet(a) || !this.isSet(b)) {
            return false;
        }
        if (this.normalizeModifiers(a.modifiers) != this.normalizeModifiers(b.modifiers)) {
            return false;
        }
        if (a.key || b.key) {
            return String(a.key || '').toUpperCase() == String(b.key || '').toUpperCase() && !!a.key;
        }
        return a.keycode == b.keycode;
    },

    format: function(k) {
        if (!this.isSet(k)) {
            return '';
        }
        const mac = Zotero.isMac;
        const set = new Set(String(k.modifiers || '').split(/[\s,]+/).filter(Boolean));
        const parts = [];
        const has = m => set.has(m);
        if (mac) {
            if (has('control')) parts.push('⌃');
            if (has('alt')) parts.push('⌥');
            if (has('shift')) parts.push('⇧');
            if (has('accel') || has('meta')) parts.push('⌘');
        }
        else {
            if (has('accel') || has('control')) parts.push('Ctrl');
            if (has('meta')) parts.push('Win');
            if (has('alt')) parts.push('Alt');
            if (has('shift')) parts.push('Shift');
        }
        let last;
        if (k.key) {
            last = String(k.key).toUpperCase();
        }
        else {
            const vk = String(k.keycode).replace(/^VK_/, '');
            last = /^F\d+$/.test(vk) ? vk
                : vk.toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        parts.push(last);
        return parts.join(mac ? '' : '+');
    },

    // A key event as Zutilo's key object, or null for a modifier pressed alone.
    // The character the keyboard types (event.key), because the <key> elements
    // made from it match that character (as Zotero's own keys and its shortcut
    // registry, zotero#6080, do); a character outside ASCII (a non-Latin layout,
    // an AltGr / Option composition) gives the key's Latin letter (keyCode
    // 65-90) instead, which Gecko also matches. Digits by their place
    // (event.code): on some layouts the digit row types other characters
    // (AZERTY: & é " ...), and Gecko matches the digit there too.
    // MJT 2026-11-16, French keyboard: Ctrl+A was recorded by its place as
    // Ctrl+Q (and said to clash with Quit), while the <key> made from it would
    // have answered to the key printed Q.
    fromEvent: function(event) {
        if (['Shift', 'Control', 'Alt', 'Meta', 'OS', 'AltGraph', 'CapsLock', 'Fn'].includes(event.key)) {
            return null;
        }
        const mods = [];
        const mac = Zotero.isMac;
        if (mac ? event.metaKey : event.ctrlKey) mods.push('accel');
        if (mac && event.ctrlKey) mods.push('control');
        if (!mac && event.metaKey) mods.push('meta');
        if (event.altKey) mods.push('alt');
        if (event.shiftKey) mods.push('shift');
        let key = '', keycode = '';
        const digit = /^Digit([0-9])$/.exec(event.code || '');
        const k = event.key || '';
        if (digit) {
            key = digit[1];
        }
        else if (k.length == 1 && k != ' ') {
            const c = k.toUpperCase();
            const cc = c.charCodeAt(0);
            if (cc >= 0x21 && cc <= 0x7e) {
                key = c;
            }
            else if (event.keyCode >= 65 && event.keyCode <= 90) {
                key = String.fromCharCode(event.keyCode);
            }
            else {
                key = c;
            }
        }
        else {
            keycode = this._vkNames[event.keyCode] || '';
        }
        if (!key && !keycode) {
            return null;
        }
        return {modifiers: mods.join(','), key: key, keycode: keycode};
    },

    // Never let a shortcut take over typing: a modifier other than Shift, or a
    // function key.
    acceptable: function(k) {
        const mods = this.normalizeModifiers(k.modifiers).split(',').filter(Boolean);
        if (mods.some(m => m != 'shift')) {
            return true;
        }
        return /^VK_F\d+$/.test(k.keycode);
    },

    // Where one of Zotero's code-handled keys acts (zoteroShortcuts.json):
    // "typing" while text is edited -- the note editor, an annotation comment --
    // "document" while a PDF / EPUB / snapshot page has the focus, else
    // "library" (the main window, the items list, the collections pane).
    // Zutilo's commands act on the library's selection: a key Zotero takes only
    // while typing or reading never stands in their way (MJT 2026-11-16, Ctrl+I
    // = Italic in a comment vs "Attach link to file"). The editor or the reader
    // consumes the key first there, so Zutilo's shortcut simply does not run
    // in that place, and does everywhere else.
    _codeContext: function(e) {
        const where = e.where || [];
        if (where.includes('note') || /^reader\.comment\./.test(e.id || '')) {
            return 'typing';
        }
        if (where.includes('reader')) {
            return 'document';
        }
        return 'library';
    },

    // What else answers to these keys: another Zutilo command, a key of a Zotero
    // window (its own or another plugin's), or one of Zotero's own shortcuts
    // (extensions.zotero.keys.*, pressed with Ctrl+Shift / Cmd+Shift) -- the
    // clashes; and the keys Zotero uses only while typing or in an open
    // document -- notes, never a clash (_codeContext).
    conflicts: async function(name, k) {
        return (await this.clashes(name, k)).hard;
    },

    clashes: async function(name, k) {
        const byContext = new Map();
        const out = new Set();
        for (const other of this._names) {
            if (other != name && this.sameKey(k, this._get(other))) {
                out.add(await this._l10n('zutilo-preferences-shortcuts-zutilo', {name: this._name(other)}));
            }
        }
        for (const win of Zotero.getMainWindows()) {
            const doc = win.document;
            for (const el of doc.querySelectorAll('key')) {
                if ((el.id || '').startsWith('zutilo-key-')) {
                    continue;
                }
                const ek = {
                    modifiers: el.getAttribute('modifiers') || '',
                    key: el.getAttribute('key') || '',
                    keycode: el.getAttribute('keycode') || ''
                };
                if (this.sameKey(k, ek)) {
                    out.add(this._labelFor(doc, el));
                }
            }
        }
        // Zotero's shortcuts handled in code (keydown handlers: the reader,
        // the note editor, the library's trees, the tab bar), which no <key>
        // element shows: zoteroShortcuts.json, each entry with its source.
        // MJT 2026-11-15: Ctrl+P (Print in the reader) gave no warning.
        for (const e of (this._zoteroCode || [])) {
            if (this.sameKey(k, e)) {
                const context = this._codeContext(e);
                if (context == 'library') {
                    out.add(await this._l10n('zutilo-preferences-shortcuts-zotero-code',
                        {where: (e.where && e.where[0]) || 'main', name: e.label}));
                }
                else {
                    if (!byContext.has(context)) {
                        byContext.set(context, new Set());
                    }
                    byContext.get(context).add(String(e.label || '').replace(/\s*\([^)]*\)\s*$/, ''));
                }
            }
        }
        // Other plugins' shortcuts, published under the plugin-shortcuts
        // convention (zutilo.mjs). Zutilo's keys act anywhere in a main
        // window, which every `where` value of the convention overlaps.
        for (const p of (this._pluginCache || this._pluginShortcuts())) {
            if (this.sameKey(k, p.s)) {
                out.add(await this._l10n('zutilo-preferences-shortcuts-plugin', {plugin: p.plugin, name: p.s.label || p.s.id}));
            }
        }
        if (k.key && this.normalizeModifiers(k.modifiers) == this.normalizeModifiers('accel,shift')) {
            const branch = Services.prefs.getBranch('extensions.zotero.keys.');
            for (const cmd of branch.getChildList('')) {
                let v = '';
                try {
                    v = branch.getCharPref(cmd);
                } catch (e) {}
                if (v && v.toUpperCase() == k.key.toUpperCase()) {
                    out.add(await this._l10n('zutilo-preferences-shortcuts-zotero', {command: cmd}));
                }
            }
        }
        const notes = [];
        for (const [context, labels] of byContext) {
            notes.push(await this._l10n('zutilo-preferences-shortcuts-context-name', {context, name: [...labels].join(', ')}));
        }
        return {hard: [...out], notes: notes};
    },

    // Every other plugin's published shortcuts, asked fresh (the replies come
    // back synchronously, inside the request): [{plugin: name, s: shortcut}].
    _pluginShortcuts: function() {
        const out = [];
        const reqID = 'zutilo-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
        const listener = {
            observe: (subject, topic, data) => {
                try {
                    const r = JSON.parse(data || '{}');
                    if (r.v != 1 || r.id != reqID || !r.plugin || r.plugin.id == Zutilo.id) {
                        return;
                    }
                    for (const s of (r.shortcuts || [])) {
                        if (s && (s.key || s.keycode)) {
                            out.push({plugin: String(r.plugin.name || r.plugin.id), s: {
                                id: s.id, label: s.label, modifiers: s.modifiers || '', key: s.key || '', keycode: s.keycode || ''
                            }});
                        }
                    }
                }
                catch (e) {}
            }
        };
        Services.obs.addObserver(listener, Zutilo.SHORTCUTS_REPLY);
        try {
            Services.obs.notifyObservers(null, Zutilo.SHORTCUTS_REQUEST, JSON.stringify({v: 1, id: reqID}));
        }
        catch (e) {}
        finally {
            Services.obs.removeObserver(listener, Zutilo.SHORTCUTS_REPLY);
        }
        return out;
    },

    _labelFor: function(doc, el) {
        if (el.getAttribute('label')) {
            return el.getAttribute('label');
        }
        if (el.id) {
            const mi = doc.querySelector(`menuitem[key="${CSS.escape(el.id)}"]`);
            if (mi && mi.getAttribute('label')) {
                return mi.getAttribute('label');
            }
        }
        const cmd = el.getAttribute('command');
        if (cmd) {
            const c = doc.getElementById(cmd);
            if (c && c.getAttribute('label')) {
                return c.getAttribute('label');
            }
            const mi = doc.querySelector(`menuitem[command="${CSS.escape(cmd)}"]`);
            if (mi && mi.getAttribute('label')) {
                return mi.getAttribute('label');
            }
            return cmd;
        }
        return el.id || this.format({modifiers: el.getAttribute('modifiers'), key: el.getAttribute('key'), keycode: el.getAttribute('keycode')});
    },

    // The line under a row: its text, and buttons when it asks something.
    _fillDetail: function(e, text, actions, clash) {
        const html = 'http://www.w3.org/1999/xhtml';
        e.detail.textContent = '';
        const span = document.createElementNS(html, 'span');
        span.textContent = text || '';
        e.detail.appendChild(span);
        for (const a of (actions || [])) {
            const b = document.createElementNS(html, 'button');
            b.textContent = a.label;
            b.addEventListener('click', a.run);
            e.detail.appendChild(b);
        }
        e.detail.classList.toggle('zutilo-clash-detail', !!clash);
    },

    // A refused key or the clash question goes in the line under the row being
    // set, right after its shortcut, and nothing is said when a shortcut is
    // simply set or removed: the key button shows it. MJT 2026-11-16, of the
    // line above the list ("Attach link to file: Ctrl+L"): "No need for the
    // text here, it is confusing. Only add the warning just after the shortcut
    // when needed." _say() with no text takes the message away.
    _say: function(name, text, actions) {
        const prev = this._rowMsg;
        this._rowMsg = name && text ? {name: name, text: text, actions: actions || []} : null;
        const old = prev && this._rows && this._rows.get(prev.name);
        if (old) {
            old.detail.textContent = '';
            old.detail.hidden = true;
        }
        const e = this._rowMsg && this._rows && this._rows.get(name);
        if (e) {
            this._fillDetail(e, text, this._rowMsg.actions, true);
            e.detail.hidden = false;
        }
    },

    apply: async function(name, k) {
        Zutilo.keys.setKey(name, {modifiers: k.modifiers || '', key: k.key || '', keycode: k.keycode || ''});
        this._pending = null;
        this._say();
        // A new shortcut shows its line, even where the old one's was folded.
        const hidden = this._notesHidden();
        if (hidden.delete(name)) {
            this._setNotesHidden(hidden);
        }
        this.refresh();
    },

    _record: function(name, button) {
        this._stop();
        // A clash question still open is answered "Cancel" by starting over:
        // otherwise its row stays marked as waiting after the question is gone.
        if (this._pending || this._rowMsg) {
            this._pending = null;
            this._say();
            this.refresh();
        }
        this._recording = {name: name, button: button};
        button.classList.add('zutilo-recording');
        this._l10n('zutilo-preferences-shortcuts-press').then(t => {
            if (this._recording && this._recording.button == button) {
                button.textContent = t;
            }
        });
        this._onKey = event => this._handleKey(event);
        this._onBlur = () => this._stop(true);
        button.addEventListener('keydown', this._onKey, true);
        button.addEventListener('blur', this._onBlur);
        button.focus();
    },

    _stop: function(rerender) {
        const r = this._recording;
        this._recording = null;
        if (r) {
            r.button.removeEventListener('keydown', this._onKey, true);
            r.button.removeEventListener('blur', this._onBlur);
            r.button.classList.remove('zutilo-recording');
            if (rerender) {
                this.refresh();
            }
        }
    },

    _handleKey: async function(event) {
        const r = this._recording;
        if (!r) {
            return;
        }
        // Keep the keys from the Settings window's own shortcuts while recording.
        event.preventDefault();
        event.stopPropagation();
        const plain = !event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey;
        if (plain && event.key == 'Escape') {
            this._say();
            this._stop(true);
            return;
        }
        if (plain && (event.key == 'Backspace' || event.key == 'Delete')) {
            this._stop();
            await this.apply(r.name, {modifiers: '', key: '', keycode: ''});
            return;
        }
        if (plain && event.key == 'Tab') {
            this._say();
            this._stop(true);
            return;
        }
        const k = this.fromEvent(event);
        if (!k) {
            return;
        }
        if (!this.acceptable(k)) {
            // Still recording: the reason stays under the row until a key is taken.
            this._say(r.name, await this._l10n('zutilo-preferences-shortcuts-needs-modifier', {keys: this.format(k)}));
            return;
        }
        this._say();
        this._stop();
        if (this.sameKey(k, this._get(r.name))) {
            this.refresh();
            return;
        }
        const found = await this.clashes(r.name, k);
        const conflicts = found.hard;
        if (!conflicts.length) {
            // A key Zotero keeps while typing or in a document: the row's own
            // line says so after the refresh (refresh, found.notes).
            await this.apply(r.name, k);
            return;
        }
        this._pending = {name: r.name, key: k};
        const msg = await this._l10n('zutilo-preferences-shortcuts-conflict', {keys: this.format(k), names: conflicts.join(', ')});
        const anyway = await this._l10n('zutilo-preferences-shortcuts-assign-anyway');
        const cancel = await this._l10n('zutilo-preferences-shortcuts-cancel');
        this._say(r.name, msg, [
            {label: anyway, run: () => this.apply(r.name, k)},
            {label: cancel, run: () => { this._pending = null; this._say(); this.refresh(); }}
        ]);
        this.refresh();
    },

    // The list, built once: a heading per category, a line per function (name,
    // menu choices or an empty cell, shortcut button and its clear button).
    build: function() {
        const html = 'http://www.w3.org/1999/xhtml';
        const list = this._list;
        list.textContent = '';
        this._rows = new Map();
        this._heads = [];
        // A name that starts with its own category ("Attachments: Attach link to
        // URI" under the heading "Attachments") drops that prefix: the heading
        // says it (MJT 2026-11-15). Other prefixes ("Item pane: ...") name a
        // group inside the category and stay.
        const withoutCategory = (label, category) => {
            const m = category && label.match(/^(.*?)\s*:\s*(.+)$/);
            return m && m[1].toLowerCase() == category.toLowerCase() ? m[2] : label;
        };
        const rows = this._names.map(name => {
            const category = this._categoryOf(name);
            return {name: name, label: withoutCategory(this._label(name), category), category: category};
        }).sort((a, b) => a.category.localeCompare(b.category) || a.label.localeCompare(b.label));
        // The headings first: "Starred" on top, then one per category; the
        // lines go under them in label order (_insertRow).
        const makeHead = (category, l10nId) => {
            const h = document.createElementNS(html, 'div');
            h.className = 'zutilo-shortcut-category';
            if (l10nId) {
                h.classList.add('zutilo-starred-category');
                document.l10n.setAttributes(h, l10nId);
            }
            else {
                h.textContent = category;
            }
            list.appendChild(h);
            const head = {el: h, category: category, rows: []};
            this._heads.push(head);
            return head;
        };
        this._starredHead = makeHead('', 'zutilo-preferences-starred');
        this._catHeads = new Map();
        for (const r of rows) {
            if (!this._catHeads.has(r.category)) {
                this._catHeads.set(r.category, makeHead(r.category));
            }
        }
        this._empty = document.createElementNS(html, 'div');
        this._empty.className = 'zutilo-filter-empty';
        this._empty.hidden = true;
        document.l10n.setAttributes(this._empty, 'zutilo-preferences-filter-none');
        list.appendChild(this._empty);
        const starred = this._starred();
        for (const r of rows) {
            const row = document.createElementNS(html, 'div');
            row.className = 'zutilo-shortcut-row';
            row.setAttribute('role', 'listitem');
            row.dataset.name = r.name;
            // The star: a starred function is listed on top, under "Starred".
            const star = document.createElementNS(html, 'button');
            star.className = 'zutilo-star';
            star.addEventListener('click', () => this._toggleStar(r.name));
            row.appendChild(star);
            const label = document.createElementNS(html, 'span');
            label.className = 'zutilo-shortcut-label';
            label.textContent = r.label;
            label.title = r.label;
            row.appendChild(label);
            const menuName = this._menus.get(r.name);
            if (menuName) {
                row.appendChild(menuRadiogroup(menuName, r.name));
            }
            else {
                const empty = document.createElementNS(html, 'span');
                empty.className = 'zutilo-menu-none';
                row.appendChild(empty);
            }
            // A warning when the shortcut is also someone else's right now
            // (another Zutilo function, Zotero, another plugin): the check made
            // when recording, kept visible (MJT 2026-11-15).
            // A click on it shows or folds the message in a line under the row
            // (MJT 2026-11-16), which stays after the shortcut is assigned.
            const warn = document.createElementNS(html, 'button');
            warn.className = 'zutilo-shortcut-warn';
            warn.textContent = '⚠';
            warn.hidden = true;
            warn.addEventListener('click', () => this._toggleNote(r.name));
            row.appendChild(warn);
            const detail = document.createElementNS(html, 'div');
            detail.className = 'zutilo-shortcut-detail';
            detail.hidden = true;
            const entry = {row: row, label: r.label, category: r.category, btn: null, clear: null, warn: warn, detail: detail, star: star, head: null};
            if (r.name in Zutilo.keys.shortcuts) {
                const btn = document.createElementNS(html, 'button');
                document.l10n.setAttributes(btn, 'zutilo-preferences-shortcuts-set', {name: r.label});
                btn.addEventListener('click', () => this._record(r.name, btn));
                const clear = document.createElementNS(html, 'button');
                clear.className = 'zutilo-shortcut-clear';
                clear.textContent = '×';
                document.l10n.setAttributes(clear, 'zutilo-preferences-shortcuts-clear', {name: r.label});
                clear.addEventListener('click', () => this.apply(r.name, {modifiers: '', key: '', keycode: ''}));
                row.append(btn, clear);
                entry.btn = btn;
                entry.clear = clear;
            }
            row.appendChild(detail);
            this._rows.set(r.name, entry);
            const isStarred = starred.has(r.name);
            this._drawStar(entry, r.name, isStarred);
            this._insertRow(isStarred ? this._starredHead : this._catHeads.get(r.category), entry);
        }
        this.refresh();
    },

    // Starred functions (MJT 2026-11-16: "there are too many commands. But a
    // specific user probably only wants a small sub-set of them"): listed on
    // top under "Starred", kept in a pref of their own (a JSON list of names).
    _notesHidden: function() {
        try {
            return new Set(JSON.parse(Services.prefs.getStringPref(NOTES_HIDDEN_PREF, '[]')));
        }
        catch (e) {
            return new Set();
        }
    },

    _setNotesHidden: function(set) {
        Services.prefs.setStringPref(NOTES_HIDDEN_PREF, JSON.stringify([...set]));
    },

    // The icon's click: fold or show the line under the row.
    _toggleNote: function(name) {
        const hidden = this._notesHidden();
        if (!hidden.delete(name)) {
            hidden.add(name);
        }
        this._setNotesHidden(hidden);
        const e = this._rows && this._rows.get(name);
        if (e && e.detail) {
            const show = !hidden.has(name) && !e.warn.hidden;
            e.detail.hidden = !show;
            e.warn.setAttribute('aria-expanded', String(show));
        }
    },

    _starred: function() {
        try {
            const v = JSON.parse(Services.prefs.getStringPref(STARRED_PREF, '[]'));
            return new Set(Array.isArray(v) ? v : []);
        } catch (e) {
            return new Set();
        }
    },

    _drawStar: function(entry, name, on) {
        entry.star.textContent = on ? '★' : '☆';
        entry.star.setAttribute('aria-pressed', String(on));
        document.l10n.setAttributes(entry.star, on ? 'zutilo-preferences-unstar' : 'zutilo-preferences-star', {name: entry.label});
        entry.row.classList.toggle('zutilo-starred', on);
    },

    // A line goes into its heading's block in label order: before the first
    // line that sorts after it, else before the next heading.
    _insertRow: function(head, entry) {
        const i = head.rows.findIndex(e => e.label.localeCompare(entry.label) > 0);
        let at;
        if (i >= 0) {
            at = head.rows[i].row;
        }
        else {
            const next = this._heads[this._heads.indexOf(head) + 1];
            at = next ? next.el : this._empty;
        }
        this._list.insertBefore(entry.row, at);
        head.rows.splice(i >= 0 ? i : head.rows.length, 0, entry);
        entry.head = head;
    },

    // The line MOVES (the same nodes, its menu choices and shortcut button
    // with it): to the top when starred, back to its category when not. The
    // pane keeps its scroll position and the star keeps the focus.
    _toggleStar: function(name) {
        const entry = this._rows.get(name);
        if (!entry) {
            return;
        }
        const starred = this._starred();
        const on = !starred.has(name);
        if (on) {
            starred.add(name);
        }
        else {
            starred.delete(name);
        }
        Services.prefs.setStringPref(STARRED_PREF, JSON.stringify([...starred]));
        const from = entry.head;
        from.rows.splice(from.rows.indexOf(entry), 1);
        this._insertRow(on ? this._starredHead : this._catHeads.get(entry.category), entry);
        this._drawStar(entry, name, on);
        entry.star.focus({preventScroll: true});
        this.filter();
    },

    // The filters hide lines (and a heading left with none); they never rebuild.
    filter: function() {
        const q = (this._filter.value || '').trim().toLowerCase();
        for (const b of this._legendButtons || []) {
            b.setAttribute('aria-pressed', String(b.dataset.choice == this._placement));
        }
        for (const [which, chip] of Object.entries(this._chips || {})) {
            if (chip) {
                chip.setAttribute('aria-pressed', String(which == this._withKeys));
            }
        }
        let shown = 0;
        for (const head of this._heads || []) {
            let any = false;
            for (const e of head.rows) {
                const keyText = e.btn ? this.format(this._get(e.row.dataset.name)) : '';
                const group = e.row.querySelector('radiogroup');
                let show = !q || (e.label + ' ' + e.category + ' ' + keyText + ' ' + e.row.dataset.name).toLowerCase().includes(q);
                if (show && this._placement) {
                    show = !!group && group.value == this._placement;
                }
                if (show && this._withKeys) {
                    show = this._withKeys == 'with' ? !!keyText : !keyText;
                }
                e.row.hidden = !show;
                any = any || show;
                shown += show ? 1 : 0;
            }
            head.el.hidden = !any;
        }
        if (this._empty) {
            this._empty.hidden = shown > 0;
        }
    },

    // Each shortcut button shows its keys now.
    refresh: async function() {
        if (!this._rows) {
            return;
        }
        const none = await this._l10n('zutilo-preferences-shortcuts-none');
        // One request to the other plugins for the whole pass.
        this._pluginCache = this._pluginShortcuts();
        try {
            await this._refreshRows(none);
        }
        finally {
            this._pluginCache = null;
        }
        this.filter();
    },

    _refreshRows: async function(none) {
        for (const [name, e] of this._rows) {
            e.row.classList.toggle('zutilo-pending', !!(this._pending && this._pending.name == name));
            // A refused key or the clash question holds the line under its row (_say).
            const said = this._rowMsg && this._rowMsg.name == name ? this._rowMsg : null;
            if (!e.btn || (this._recording && this._recording.button == e.btn)) {
                if (said) {
                    this._fillDetail(e, said.text, said.actions, true);
                    e.detail.hidden = false;
                }
                continue;
            }
            const k = this._get(name);
            const keyText = this.format(k);
            e.btn.className = 'zutilo-shortcut-key' + (keyText ? '' : ' zutilo-none');
            e.btn.textContent = keyText || none;
            e.clear.hidden = !keyText;
            const found = keyText ? await this.clashes(name, k) : {hard: [], notes: []};
            const clashes = found.hard;
            const noted = !clashes.length && found.notes.length;
            e.warn.hidden = !clashes.length && !noted;
            e.warn.textContent = clashes.length ? '⚠' : 'ⓘ';
            e.warn.classList.toggle('zutilo-shortcut-note', !!noted);
            const message = clashes.length
                ? await this._l10n('zutilo-preferences-shortcuts-clash', {names: clashes.join(', ')})
                : (noted ? await this._l10n('zutilo-preferences-shortcuts-context-tip', {names: found.notes.join('; ')}) : '');
            e.warn.title = message
                ? message + ' ' + await this._l10n('zutilo-preferences-shortcuts-note-toggle')
                : '';
            const show = !!said || (!!message && !this._notesHidden().has(name));
            if (said) {
                this._fillDetail(e, said.text, said.actions, true);
            }
            else {
                this._fillDetail(e, message, null, !!clashes.length);
            }
            e.detail.hidden = !show;
            e.warn.setAttribute('aria-expanded', String(show));
            e.row.classList.toggle('zutilo-clash', !!clashes.length);
        }
    }
};
