/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* global window, document, Components, KeyboardEvent, Services, Zotero */
/* global Zutilo */
var { Zutilo } = ChromeUtils.importESModule("chrome://zutilo/content/zutilo.mjs");

// eslint-disable-next-line no-unused-vars
window.initializePrefWindow = function() {
    ZutiloShortcutEditor.init();
}

// eslint-disable-next-line no-unused-vars
window.buildMenuPrefs = function() {
    for (const menuName of ['item', 'collection']) {
        for (const functionName of Zutilo._menuFunctions[menuName]) {
            addMenuRadiogroup(menuName, functionName);
        }
    }
}

function addMenuRadiogroup(menuName, menuFunction) {
    var newRow = document.createXULElement('groupbox');

    var newHbox = document.createXULElement('hbox');
    newHbox.setAttribute('align', 'center');
    var newLabel = document.createXULElement('label');
    newLabel.setAttribute(
        'value',
        Zutilo.getString(`zutilo.preferences.${menuName}menu.${menuFunction}`)
    )
    newHbox.appendChild(newLabel);
    newRow.appendChild(newHbox);

    var newRadiogroup = document.createXULElement('radiogroup');
    newRadiogroup.setAttribute('orient', 'horizontal');
    newRadiogroup.setAttribute('align', 'center');
    newRadiogroup.setAttribute('preference',
                               `extensions.zutilo.${menuName}menu.${menuFunction}`);

    var newRadio;
    for (const label of ['Zotero', 'Zutilo', 'Hide']) {
        newRadio = document.createXULElement('radio');
        newRadio.setAttribute(
            'label',
            Zutilo.getString(`zutilo.preferences.${menuName}menu.${label}`)
        )
        newRadio.setAttribute('value', label);
        newRadiogroup.appendChild(newRadio);
    }

    newRow.appendChild(newRadiogroup);

    var menuRows = document.getElementById(`zutilo-prefpane-${menuName}-rows`);
    menuRows.appendChild(newRow);
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
    _vkNames: null,

    init: function() {
        try {
            this._list = document.getElementById('zutilo-shortcut-list');
            this._filter = document.getElementById('zutilo-shortcut-filter');
            this._status = document.getElementById('zutilo-shortcut-status');
            if (!this._list) {
                return;
            }
            this._vkNames = {};
            for (const prop in KeyboardEvent) {
                if (prop.startsWith('DOM_VK_')) {
                    this._vkNames[KeyboardEvent[prop]] = prop.slice(4);
                }
            }
            this._names = Object.keys(Zutilo.keys.shortcuts);
            this._filter.addEventListener('input', () => this.render());
            this.render();
        } catch (e) {
            Zotero.logError(e);
        }
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
    // Letters and digits by their place on the keyboard (event.code), so a
    // shortcut is the same whatever Shift or the layout does to the character.
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
        const m = /^Key([A-Z])$/.exec(event.code || '') || /^Digit([0-9])$/.exec(event.code || '');
        if (m) {
            key = m[1];
        }
        else if (event.key && event.key.length == 1 && event.key != ' ') {
            key = event.key.toUpperCase();
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

    // What else answers to these keys: another Zutilo command, a key of a Zotero
    // window (its own or another plugin's), or one of Zotero's own shortcuts
    // (extensions.zotero.keys.*, pressed with Ctrl+Shift / Cmd+Shift).
    conflicts: async function(name, k) {
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
        return [...out];
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

    _say: function(text, actions) {
        const s = this._status;
        s.textContent = '';
        const span = document.createElementNS('http://www.w3.org/1999/xhtml', 'span');
        span.textContent = text || '';
        s.appendChild(span);
        for (const a of (actions || [])) {
            const b = document.createElementNS('http://www.w3.org/1999/xhtml', 'button');
            b.textContent = a.label;
            b.addEventListener('click', a.run);
            s.appendChild(b);
        }
    },

    apply: async function(name, k) {
        Zutilo.keys.setKey(name, {modifiers: k.modifiers || '', key: k.key || '', keycode: k.keycode || ''});
        this._pending = null;
        this._say(this.isSet(k)
            ? await this._l10n('zutilo-preferences-shortcuts-assigned', {name: this._name(name), keys: this.format(k)})
            : await this._l10n('zutilo-preferences-shortcuts-cleared', {name: this._name(name)}));
        this.render();
    },

    _record: function(name, button) {
        this._stop();
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
                this.render();
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
            this._stop(true);
            this._say('');
            return;
        }
        if (plain && (event.key == 'Backspace' || event.key == 'Delete')) {
            this._stop();
            await this.apply(r.name, {modifiers: '', key: '', keycode: ''});
            return;
        }
        if (plain && event.key == 'Tab') {
            this._stop(true);
            return;
        }
        const k = this.fromEvent(event);
        if (!k) {
            return;
        }
        if (!this.acceptable(k)) {
            this._say(await this._l10n('zutilo-preferences-shortcuts-needs-modifier', {keys: this.format(k)}));
            return;
        }
        this._stop();
        if (this.sameKey(k, this._get(r.name))) {
            this.render();
            return;
        }
        const conflicts = await this.conflicts(r.name, k);
        if (!conflicts.length) {
            await this.apply(r.name, k);
            return;
        }
        this._pending = {name: r.name, key: k};
        const msg = await this._l10n('zutilo-preferences-shortcuts-conflict', {keys: this.format(k), names: conflicts.join(', ')});
        const anyway = await this._l10n('zutilo-preferences-shortcuts-assign-anyway');
        const cancel = await this._l10n('zutilo-preferences-shortcuts-cancel');
        this._say(msg, [
            {label: anyway, run: () => this.apply(r.name, k)},
            {label: cancel, run: () => { this._pending = null; this._say(''); this.render(); }}
        ]);
        this.render();
    },

    render: async function() {
        const html = 'http://www.w3.org/1999/xhtml';
        const q = (this._filter.value || '').trim().toLowerCase();
        const rows = this._names.map(name => {
            const k = this._get(name);
            return {name: name, label: this._name(name), category: this._category(name), key: k, keyText: this.format(k)};
        }).filter(r => !q || (r.label + ' ' + r.category + ' ' + r.keyText + ' ' + r.name).toLowerCase().includes(q))
            .sort((a, b) => a.category.localeCompare(b.category) || a.label.localeCompare(b.label));
        const none = await this._l10n('zutilo-preferences-shortcuts-none');
        const list = this._list;
        list.textContent = '';
        let lastCat = null;
        for (const r of rows) {
            if (r.category != lastCat) {
                lastCat = r.category;
                const h = document.createElementNS(html, 'div');
                h.className = 'zutilo-shortcut-category';
                h.textContent = r.category;
                list.appendChild(h);
            }
            const row = document.createElementNS(html, 'div');
            row.className = 'zutilo-shortcut-row';
            row.setAttribute('role', 'listitem');
            row.dataset.name = r.name;
            if (this._pending && this._pending.name == r.name) {
                row.classList.add('zutilo-pending');
            }
            const label = document.createElementNS(html, 'span');
            label.className = 'zutilo-shortcut-label';
            label.textContent = r.label;
            row.appendChild(label);
            const btn = document.createElementNS(html, 'button');
            btn.className = 'zutilo-shortcut-key' + (r.keyText ? '' : ' zutilo-none');
            btn.textContent = r.keyText || none;
            document.l10n.setAttributes(btn, 'zutilo-preferences-shortcuts-set', {name: r.label});
            btn.addEventListener('click', () => this._record(r.name, btn));
            row.appendChild(btn);
            const clear = document.createElementNS(html, 'button');
            clear.className = 'zutilo-shortcut-clear';
            clear.textContent = '×';
            clear.hidden = !r.keyText;
            document.l10n.setAttributes(clear, 'zutilo-preferences-shortcuts-clear', {name: r.label});
            clear.addEventListener('click', () => this.apply(r.name, {modifiers: '', key: '', keycode: ''}));
            row.appendChild(clear);
            list.appendChild(row);
        }
    }
};
