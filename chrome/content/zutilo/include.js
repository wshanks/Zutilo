var Zotero = Components.classes["@zotero.org/Zotero;1"]
                       .getService(Components.interfaces.nsISupports)
                       .wrappedJSObject;

// Only create main object once
if (!Zotero.Zutilo) {
	const zutiloLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
					.getService(Components.interfaces.mozIJSSubScriptLoader);
	zutiloLoader.loadSubScript("chrome://zutilo/content/zutilo.js");
}
