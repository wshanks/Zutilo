// Only create main object once
if (!Zotero.Zutilo) {
	const loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
					.getService(Components.interfaces.mozIJSSubScriptLoader);
	loader.loadSubScript("chrome://zutilo/content/zutilo.js");
}
