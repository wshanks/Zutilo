Zutilo
======

Zutilo ist eine kleine Firefox-Erweiterung, die als Plug-In für die [Zotero Firefox-Erweiterung](http://www.zotero.org/) dient.
Zutilo wurde als Dienstprogramm für mehrere Funktionen konzipiert, die in Zotero nicht vorhanden sind.
Der Name wurde durch Erweiterung des Wortstamms "utility" gewählt, so dass es nach "Zotero" klingt.
Die UI Elemente von Zutilo (Menü, Kontextmenü) können einzeln auf verschiedenen Ebenen deaktiviert werden, so dass Zutilo nicht die Benutzeroberfläche überfrachtet.

Aktuelle Feature-Liste
----------------------

### Tastenkombinationen ###
Die meisten Zutilo-Funktionen können über das Kontextmenü (welches mit der rechten Maustaste auf relevanten Elementen in Zotero oder Firefox erscheint) erreicht werden.
Es kann effektiver sein, viele der Funktionen von Zutilo direkt über die Tastatur, anstatt über Kontextmenüs zu aktivieren.
Shortcuts für viele Funktionen Zutilos (und einige Funktionen des reinen Zoteros), können im Zutilo Einstellungen-Fenster (erreichbar vom Add-ons-Manager oder dem Zotero Aktionen Menü (das "Zahnrad"-Symbol im Zotero Interface) eingestellt werden.

Wenn Sie möchten, können Sie auch die Verknüpfungen Zutilos mit dem [Customizable Shortcuts Firefox-Plugin](https://addons.mozilla.org/en-US/firefox/addon/customizable-shortcuts/) setzen.
Einstellungen mit dieser Erweiterung überschreiben alle Einstellungen im Zutilo Einstellungen Fenster.
Das Einstellen der Verknüpfungen Zutilos mit dem [KeyConfig Erweiterung](http://forums.mozillazine.org/viewtopic.php?t=72994) wird nicht empfohlen (die Einstellungen gelten nur für eine Sitzung und werden durch Zutilo überschrieben, wenn Firefox neu gestartet wird).

Die Funktionen Zutilos können auch weiteren Tastenkombinationen mithilfe anderer Firefox-Plugin zugeordnet werden, wie z.B. [KeyConfig](http://forums.mozillazine.org/viewtopic.php?t=72994), welches eine einfache Schnittstelle für die Zuordnung von Tastenkombinationen zu Javascript-Befehlen bietet und sowohl mit Firefox und Zotero Standalone funktioniert, oder [Pentadactyl](http://5digits.org/pentadactyl/index) oder [Vimperator](http://www.vimperator.org/vimperator), die beide eine erweiterte Kommandozeilen-Schnittstelle für Firefox bieten (Pentadactyl Benutzer könnten an [Zoterodactyl](https://github.com/willsALMANJ/Zoterodactyl) interessiert sein, eine Gruppe Pentadactyl Plugins, die viele Tastenkombinationen zu Pentadactyl hinzufügt).
In den Beschreibungen der Funktionen unten sind die entsprechende Funktions Namen angegeben.
Dies sind die Namen der Funktionen, die zugewiesen werden müssen, um diese Funktionen ohne Kontextmenüs aufzurufen.

### Kontextmenü Funktionen ###
Jede der folgenden Funktionen können aus dem Zotero Kontextmenü aufgerufen werden (zugänglich mit der rechten Maustaste in der zentralen Eintrags-Liste von Zotero, wo alle Einträge einer Sammlung aufgeführt sind).
In den Zutilo Einstellungen (zugänglich im gleichen Menü wie die Zotero-Einstellungen), kann jede dieser Funktionen so eingestellt werden, dass diese im Zotero Kontextmenü, in einem Zutilo Untermenü des Zotero Kontextmenü oder überhaupt nicht angezeigt werden.

* __Kopieren Tags:__
    Machen sie einen Rechtsklick auf einen oder mehrere markierte Einträge in der Zotero-Bibliothek und kopieren ihre Tags in die Zwischenablage als eine '\r\n' getrennte Liste.
    Ab Zotero 4.0 kann eine solche Liste von Tags aus der Zwischenablage in einem neuen tag Feld eingefügt werden, um alle Tags zu einem Element gleichzeitig hinzuzufügen.
    (Name der Funktion: `ZutiloChrome.zoteroOverlay.copyTags()`).

* __Remove tags:__
    Right click items in the Zotero library and remove all of their tags.
    (Function name: `ZutiloChrome.zoteroOverlay.removeTags()`).

* __Einfügen Tags:__
    Machen sie einen Rechtsklick auf einen oder mehrere markierte Einträge von Elementen in der Zotero-Bibliothek und fügen Sie den Inhalt der Zwischenablage in diesen als Tags ein.
    Der Inhalt der Zwischenablage muss eine '\r\n' oder '\n' getrennte Liste sein (wie die durch die oben beschriebene "Tags Kopieren" Funktion erstellte Liste).
    (Name der Funktion: `ZutiloChrome.zoteroOverlay.pasteTags()`).

* __Autor Kopieren:__
    Machen sie einen Rechtsklick auf einen oder mehrere markierte Einträge von Elementen in der Zotero-Bibliothek und kopieren Sie die Autoren Einträge als eine '\r\n' getrennte Liste in die Zwischenablage .
    (Name der Funktion: `ZutiloChrome.zoteroOverlay.copyCreators()`).

* __Anhangpfade zeigen:__
    Zeigen Sie die Pfade zu ausgewählten Anhängen und die Anhänge der ausgewählten regulären Einträge (nacheinander als separate Dialogfenster - Sie wollen wahrscheinlich nicht mehr als ein paar Artikel zu einem Zeitpunkt auf diese Weise auswählen).
    (Name der Funktion: `ZutiloChrome.zoteroOverlay.showAttachments()`).

* __Anhangpfade ändern:__
    Ändern Sie den Anfang der Pfade für alle zugelassenen ausgewählten Anhänge und aller Anhänge der ausgewählten regulären Einträge.
    Zwei Prompt Fenster werden angezeigt.
    Das erste fragt nach dem alten Teilpfad, während das zweite nach dem neuen Teilpfad fragt.
    Wenn Sie "C:/userData/references/" für den ersten Pfad und "E:/" für den zweiten Pfad eingeben, dann wird der Pfad eines verlinkten Anhangs von "C:/userData/references/journals/Nature/2008/coolPaper.pdf" zu "E:/journals/Nature/2008/coolPaper.pdf" geändert, während ein Anhang mit Pfad "E:/journals/Science/2010/neatPaper.pdf" unverändert bleibt.
    Diese Funktion ist vor allem nützlich, wenn Sie verschiedene Computer oder Festplatten nutzen und die Links zu allen Ihren Anhängen erhalten bleiben sollen.

    Standardmäßig wird der alte Teilpfad nur mit dem Beginn eines jeden Anhangpfads verglichen.
    Um Teile der verlinkten Pfade nicht am Anfang zu ändern, klicken Sie auf das "Alle Instanzen der Teilpfad Zeichenkette ersetzen" Kontrollkästchen in der ersten Eingabeaufforderung.
    Diese Option ist nützlich, wenn Sie einen Unterordner oder zwischen Windows-und Unix-Pfaden (`\` und `/` ersetzen) umbenennen möchten.
    (Name der Funktion: `ZutiloChrome.zoteroOverlay.modifyAttachments()`).

* __Zugehörige Einträge verbinden:__
    Sorgt dafür, dass alle ausgewählten Elemente als miteinander zugehörig verbunden werden.
    (Name der Funktion: `ZutiloChrome.zoteroOverlay.relateItems()`).

* __Copy select item links:__
	Copy links of the form "zotero://select/items/ITEM_ID" to the clipboard for each selected item.
	Pasting such a link into the Firefox address bar will select the corresponding item in the Zotero Firefox plugin.
	Following links from other applications and having the links select items in the Zotero Standalone client may also be achievable but might require additional set up.
	(Function name: `ZutiloChrome.zoteroOverlay.copyZoteroSelectLink()`).

* __Copy Zotero URIs:__
	Copy (www.zotero.org) links to the clipboard for each selected item.
	If you have a (www.zotero.org) profile, following such a link will open the page for the corresponding item in profile on (www.zotero.org).
	If you do not have a (www.zotero.org) profile, a placeholder link is still generated but might not be useful.
	(Function name: `ZutiloChrome.zoteroOverlay.copyZoteroItemURI()`).

* __Create book section:__
	Create a book section item from the currently selected book item.

	The new item is created by duplicating the book item and changing its type to book section.
	Author entries for the book item are converted to "book author" entries for the new book section item.
	The new book section item is added as a related item to the original book item.
	Finally, the title textbox for the new item is focused so that a new title for the book section may be entered.

	This function only works when a single book item is selected.
	Note that some fields (number of pages and short title, as of late 2014) apply only to book items and not book section items.
	There is no prompt to confirm this loss of fields.	
	(Function name: `ZutiloChrome.zoteroOverlay.createBookSection()`).

### Editierfunktionen für die Einträge ###

Zutilo implementiert derzeit mehrere Funktionen, die für die Bearbeitung von Zotero Einträge mit der Tastatur nützlich sind.
Diese Funktionen können nicht von jedem UI Element aus aufgerufen werden (sie können aber, wie oben beschrieben, auf eine Tastenkombination zugewiesen werden).
Die folgenden Funktionen arbeiten nur, wenn ein einziger Zotero Eintrag ausgewählt ist:

* __Eintraginfo bearbeiten:__
    Wählen Sie den Tab "Infos" im Eintragsbereich rechts.
    Setzen Sie den Fokus auf das erste editierbare Feld der Eintraginfo.
    (Name der Funktion: `ZutiloChrome.zoteroOverlay.editItemInfoGUI()`).
* __Notizen hinzufügen:__
    Wählen Sie den Tab "Notizen" im Eintragsbereich rechts.
    Erstellen Sie eine neue Notiz.
    Der Vollständigkeit halber: Zotero hat bereits eine Tastenkombination, die das tut.
    Diese kann in den Zotero-Einstellungen festgelegt werden.
    (Name der Funktion: `ZutiloChrome.zoteroOverlay.addNoteGUI()`).
* __Tag hinzufügen:__
    Wählen Sie den Tab "Tags" im Eintragsbereich rechts.
    Es öffnet sich ein neues Textfeld, um einen neuen Tag einzugeben.
    (Name der Funktion: `ZutiloChrome.zoteroOverlay.addTagGUI()`).
* __Einträge zugehörigen:__
    Wählen Sie den "Zugehörig" Tab im Eintragsbereich rechts.
    Öffnen Sie den Dialog, um zugehörige Einträge zu verbinden.
    (Name der Funktion: `ZutiloChrome.zoteroOverlay.addRelatedGUI()`).

### Navigating and hiding panes ###

Zutilo implements several functions that are useful for navigating between and within the three main panes.
If the relevant pane is hidden, the following functions will show it.
These functions can not be called from any graphical element (but can be assigned to a keyboard shortcut as described above).

* __Focus collections pane:__
    Set the focus to the collections pane (left pane, Libraries pane).
    Added for completeness, but Zotero already has a keyboard shortcut that does this.
* __Focus items pane:__
    Set the focus to the items pane (middle pane).

The following four functions are similar to the four item editing functions above, except that they just set focus on the respective tab in the item pane.

* __Focus item pane: Info tab:__
    Select the "Info" tab in the item pane.
* __Focus item pane: Notes tab:__
    Select the "Notes" tab of the item pane.
* __Focus item pane: Tags tab:__
    Select the "Tags" tab of the item pane.
* __Focus item pane: Related tab:__
    Select the "Related" tab of the item pane.

The following two functions allow you to cycle through the same four tags in the item pane.

* __Focus item pane: next tab:__
    Select next tab in item pane.
* __Focus item pane: previous tab:__
    Select previous tab in item pane.

The following two functions allow you to easily show or hide the collections pane (left pane) and the item pane (right pane).

* __Item pane: Show / hide:__
    Show or hide the item pane.
* __Collections pane: Show / hide:__
    Show or hide the collections pane.

The following two functions achieve the same, i.e. they allow you to easily show or hide the collections pane (left pane) and the item pane (right pane).
However, when the pane is shown, the thicker vertical divider ("splitter", "grippy", appears when the pane is hidden) remains visible until the width of the pane is adjusted. 

* __Item pane: Show / hide (sticky):__
    Show or hide the item pane.
    When the pane is show, the thicker vertical divider remains visible until the width of the pane is adjusted.
* __Collections pane: Show / hide (sticky):__
    Show or hide the collections pane.
    When the pane is show, the thicker vertical divider remains visible until the width of the pane is adjusted.

### Firefox Browser-Funktionen ###

Zutilo verfügt ein paar Funktionen, um in Firefox leichter mit den Anhängen von Dokumenten an Zotero Einträgen aus Seiten zu arbeiten.
Auf diese Funktionen wird vom Firefox-Browser aus zugegriffen, wenn sie nicht mit Zotero Standalone arbeiten.

* __Webseiten und Links an Zotero Eintrag anhängen:__
    Zutilo fügt dem Kontextmenü von Firefox Einträge hinzu, um für den aktuell ausgewählte Zotero Eintrag das Anhängen der aktuellen Seite oder des aktuellen Link-Ziels (wenn ein Link ausgewählt wird) zu ermöglichen.
    Wie die Anlage verarbeitet wird hängt von der in den Zutilo Einstellungen eingestellten Methode zum Anhängen ab.
    Wenn die Methode 'Import' gewählt ist, wird ein importierter Anhang von der Seite / dem Link erstellt.
    Wenn die Methode 'Für verlinkte Datei auffordern' ist, erscheint ein Datei Prompt, damit der Benutzer eine neue Datei angeben kann.
    Die Seite / Link wird in dieser Datei gespeichert und dann ein verlinkter Dateianhang (verbunden mit der heruntergeladenen Datei) erstellt.
    Wenn die Methode 'Nach dem Ersten auffordern' ist, wird ein importierter Anhang erstellt, wenn das ausgewählte Element keine früheren Anhänge hat (nicht mitgerechnet die Schnapschuss Anhänge).
    Andernfalls wird der Datei Prompt für einen verknüpften Dateianhang angezeigt.
    Wenn die Shift-Taste gedrückt wird, wenn die Anlage aktiviert ist, wird eine Aufforderung zur Eingabe eine verlinkten Datei angezeigt, unabhängig von der Voreinstellung in Zutilo.
    Wenn die Steuerung-Taste gedrückt wird, wird die Anlage unabhängig von der Voreinstellung in Zutilo importiert.

    Wenn Sie eine Tastenkombination erstellen wollen, um die aktuelle Seite an den aktuellen Zotero Eintrag entsprechend den Einstellungen in Zutilo anzuhängen, verwenden Sie `ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(window.content.location.href)` für den Befehl.
    Der allgemeine Funktions Anruf ist `ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(url, ProcessType)` wobei `url` ein String mit der Download URL ist und ProcessType "Zotero", 'prompt' oder 'promptAfterOne' sein könnte.
    Wenn ProcessType nicht angegeben oder auf etwas anderes gesetzt ist, wird die Anlage-Methode in den Zutilo Einstellungen benutzt.

* __einen Zotero Eintrag aus einer aktuellen Webseite mit / ohne Anhänge erstellen:__
    Zutilo fügt zusätzliche Menüpunkte im Kontextmenü des Zotero Symbols der Addressleiste hinzu, die ein Zitat aus der aktuellen Seite mit oder ohne zugehörigen PDF- und anderen Dateien extrahiert.
    Das heißt, wenn die Option "Automatisch PDFs und andere Dateien anhängen" Einstellung in Zotero ausgewählt ist, fügt Zutilo Menüpunkte zur Erstellung eines neuen Zotero Eintrag ohne Anhänge hinzu (ein Element für jede Methode, die auf der aktuellen Seite "in Zotero speichern" gilt).
    Wenn die Einstellung nicht ausgewählt ist, fügt Zutilo Menüpunkte hinzu, um einen neuen Zotero Eintrag mit den Anhängen zu speichern.

    Diese Funktion setzt die Funtionalität um, indem sie erst die zugehörige Einstellung Zoteros ändert, dann den Eintrag speichert, und anschließend die Einstellung wieder zurück in ihrem ursprünglichen Zustand versetzt.
    Da Zotero Seiten asynchron übersetzt (und damit gleichzeitig), sollten Übersetzungen mit dieser Funktion fertig sein, bevor die normalen Seiten Übersetzungen von Zotero benutzt werden (da sonst der Zustand der "Automatisch PDFs und andere Dateien anhängen" Einstellung vom Timing der Simultanübersetzung abhängt).

    Die Funktion, auf der diese Funktionen beruhen, ist `ZutiloChrome.firefoxOverlay.scrapeThisPage(translate, filesBool)`.
    Wenn `translate` (ein Zotero translate Objekt) falsch oder nicht gesetzt ist, wird der Standard-Übersetzer für die Seite verwendet.
    Wenn fileBool true ist, wird der Eintrag mit den dazugehörigen Anhang-Dateien erstellt.
    Wenn es false ist, wird das Element ohne die dazugehörigen Dateien erstellt.
    Wenn filesBool nicht angegeben ist, dann wird das Gegenteil von Zoteros "Automatisch PDFs und andere Dateien anhängen" Einstellung verwendet.
    Also, wenn in Zotero-Einstellungen die Option "Automatisch PDFs und andere Dateien anhängen"-Option ausgewählt ist, wird `ZutiloChrome.firefoxOverlay.scrapeThisPage(false)` einen Eintrag mit den Default-Seite Übersetzern ohne Anhänge erstellen.

### Reine Zotero-Funktionen ###

Als Referenz, sind hier ein paar andere Funktionen Zoteros aufgeführt, für die es der Verfasser nützlich findet, Tastenkombinationen zu erstellen:

* __Zotero öffnen / schließen:__
    Zeigt / verbirgt die Zotero-Panel in Firefox.
    (Name der Funktion: `ZoteroOverlay.toggleDisplay()`).
* __Webseite als Zotero Eintrag speichern:__
    Speichert die aktuelle Seite als Webseite Eintrag in Zotero.
    (Name der Funktion: `ZoteroPane.addItemFromPage()`).
* __Zotero Eintrag aus einer Webseite erstellen:__
    Fügt einen Eintrag in die Zotero-Bibliothek hinzu, der auf dem Referenz-Inhalt der aktuellen Webseite basiert (entspricht Klick auf die kleine Seite / Buch-Symbol in der Firefox-Adressleiste).
    (Name der Funktion: `Zotero_Browser.scrapeThisPage()`).

### Einige Anmerkungen über Anhänge ###

Zutilo bietet einige Funktionen, die mehr Kontrolle über die Verwaltung von Anhängen in Zotero geben.
Hier finden sich einige mögliche Verwendungen wie Zotero Anhänge überprüft und gefunden werden können. Dies sind einige der möglichen Nutzungen Zutilos.

Zotero bietet eine metadaten-reiche Schnittstelle für die Organisation und den Export von Referenzen.
Es kann auch als ein erweiterter Datei-Browser durch an Zotero Einträgen angehängte Dateien genutzt werden.
Diese Elemente können dann durch die Suche in den Zotero Datenbank Feldern (z.B. Autor, Titel, Tags, Publikation, Jahr, etc.) in einer feingranulareren Suche abgerufen werden, als es eine einfache Dateisystem Suche ermöglicht.

Zotero bietet zwei Arten von Anhängen: importierte Dateien und verlinkte Dateien.
Importierte Dateianhänge sind innerhalb des Zotero Storage-Verzeichnisses mit jedem Anhang in einem separaten Ordner, mit einem zufälligen Folge von Buchstaben und Zahlen benannt, gespeichert.
Verlinkte Dateianhänge speichern nur den Link, zu einem Anhang Speicherort der Datei auf dem Dateisystem (so können diese Anhänge in einer Datei Hierarchie ggf. außerhalb von Zotero für weitere Anwender zugänglicher gespeichert werden).

Zotero bietet eine bessere Unterstützung für importierte Datei-Anhänge als für verlinkte Dateianhänge.
Mit reinem Zotero, wenn ein neuer Eintrag durch Extraktion der Zitationinformation von einer Webseite erstellt wird, kann Zotero PDF (oder andere Dateien) herunterladen und mit dem Eintrag der Webseite als importierte Datei-Anhänge automatisch zugeordnet werden.
Zotero kann importierte Anhänge auch zum Zotero Server synchronisieren.

Die [ZotFile Erweiterung](http://www.columbia.edu/~jpl2136/zotfile.html) bietet zusätzliche Unterstützung für verlinkte Datei-Anhänge in Zotero.
ZotFile kann automatisch neue importierten Dateianhänge zu verlinkten Dateianhängen konvertieren und die Dateianhänge umbenennen und in einen auf der Anhangs Metadaten basierten Ort verschieben.
Diese Eigenschaft macht die Aufrechterhaltung der Gültigkeit der Verzeichnisse der verlinkten Dateianhänge so einfach wie mit Zotero die importierten Anhängezu verwalten.
ZotFile kann auch die bestehenden angehängten Dateien (linkten oder importierten) im Batch umbenennen und verschieben und die zuletzt geänderten Dateien im Firefox-Download-Ordner als verschobene und umbenannte verlinkte Dateianhänge mit Zotero Einträgen wieder verbinden.
(ZotFile hat auch Funktionen für Extrahieren von PDF-Annotationen als Zotero Notizen und für die Synchronisierung von Dateianhänge auf Tablet-Geräten.)

Mit ZotFile, ist es einfach eine Bibliothek von verlinkten Dateianhängen zu erstellen und zu pflegen.
Allerdings können diese Dateien nicht von Zotero mit dem Zotero Server synchronisiert werden.
Ab der Version 4.0 unterstützt Zotero relative Pfade für die verlinkten Dateianhänge.
Mit unter relativen Pfaden gespeicherten verlinkten Dateianhängen, kann die Zotero-Bibliothek eines Benutzers auf mehreren Rechnern synchronisiert werden und alle Datei-Links werden weiterhin funktionieren, solange das Basisverzeichnis, welches incl. aller verknüpften Dateianlagen auf jede Maschine kopiert wird, alle Daten enthält. (Alternativ könnten die Dateianhänge auf einem Netzlaufwerk gespeichert werden, das von jeder Maschine als Basis-Verzeichnis genutzt wird.)

Die 'Anhangpfade-Ändern-Funktion' von Zutilo ,kann die Arbeit mit verlinkten Dateianhängen deutlich vereinfachen. Sie ändert per Batch einen Teil der Pfade aller ausgewählten Anhänge.
Wenn eine Gruppe von Dateieanhängen in einen neuen Ordner verschoben wird, kann nun die 'Anhangpfade-Ändern-Funktion' Zutilos verwendet werden, um alle verlinkten Anhangpfade auf einmal zu aktualisieren.
Diese Funktion kann auch verwendet werden, um bei einem Betriebssystem Wechsel `/`` auf `\` im Anhangpfade zu ändern. Das Zotero 4.0 Merkmal 'relative Pfade' ersetzt im Prinzip die Notwendigkeit für diese Funktion, obwohl sie mit Anhängen weiter nützlich sein kann, die aus welchem ​​Grund auch immer nicht relativ sind.
Die 'Anhangpfade-Zeigen-Funktion' Zutilos ist auch nützlich für die Fehlersuche in derzeit in Zotero gespeicherten Anhangpfaden.
Insbesondere ungültige Pfade können ggf. mit einer Änderung der globelen Anhangpfade wieder zum Funktionieren gebracht werden, anstatt individuell neue Anhangpfade auswahlen zu müssen.

Die 'Seite-Anhängen' und 'Link-Anhängen' Funktionen Zutilos sind nützlich um Zotero Einträgen Dateien nachträglich hinzuzufügen, wenn dies verpasst wurde als der Eintrag ursprünglich erstellt wurde oder zum späteren Anhängen zusätzliche Elemente .
Anhänge werden nach dem üblichen Verfahren erstellt, so dass diese Funktionen auch benutzt werden können, um importierte Dateianhänge (Standardeinstellung) zu erstellen sowie auch verlinkte Dateianhänge anzupassen, wenn ZotFile so eingestellt ist, dass es versucht automatisch neue Anhänge umzubenennen und zu verschieben.
Beachten Sie, dass die Verwendung der "Für verlinkte Datei auffordern" Einstellung Zutilos auch ZotFile auslöst (es macht aber keinen Sinn, einen Dateiort über die Eingabeaufforderung auszuwählen).
In den Zutilo-Einstellungen können die 'Seite-Anhängen' und 'Link-Anhängen' Funktionen so eingestellt werden, so dass Zutilo nur einen Speicherort anfordert , wenn ein Eintrag bereits andere Anhänge hat.
Diese Einstellung funktioniert gut mit der "Nur nachfragen, wenn weitere Anh. vorhanden"-Option ZotFiles, so dass ZotFile den ersten Anhang verschiebt und umbenennt und dann über Zutilo die Namen / Orte der nachfolgenden Einträge eingegeben werden.

Manchmal ist es nützlich, Verweise auf ein Auflistung von Einträge für die zukünftige Verwendung zu speichern, aber es ist unwahrscheinlich, dass die Dokumente selbst konsultiert werden müssen.
In diesem Fall ist es am besten, für Einträge in Zotero die zugehörige Dokumente ohne Anhänge zu speichern.
Zutilo bietet Funktionen zum Speichern von Artikeln mit und ohne Anhänge.
Mit diesen Funktionen spart man sich den Aufwand der manuellen Anpassung der "automatisch zugehörige PDFs und andere Dateien anhängen" Einstellung Zoteros oder das manuelle Löschen nicht benötigter Anhänge.

### Grenzen ###

Im Moment arbeitet Zutilo mit Zotero als Firefox Browser-Ausschnitt oder App Tab und mit Zotero Standalone.
(In der Vergangenheit haben einige Funktionen nicht mit dem separaten Tab und Standalone-Versionen gearbeitet.
Wenn etwas scheint, nicht in einem dieser Modi zu arbeiten, versuchen Sie es mit Zotero als Browser-Ausschnitt in Firefox und schauen, ob es dort funktioniert.
Im Fehlerfall wenden Sie sich bitte an den Entwickler über die [Mozilla Add-ons Seite](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Mozilla Add-ons page") oder [GitHub Seite](https://github.com/willsALMANJ/Zutilo "GitHub page") Zutilos).
Einige Browser-spezifische Funktionen sind nicht in Zotero Standalone verfügbar.

Eine Warnung: Der Entwickler (und eine Reihe anderer Anwender) arbeiten mit Zutilo bereits seit einiger Zeit aktiv auf deren eigenen Zotero Sammlungen.
Wenn der Entwickler über Bugs umgehend alarmiert wird, versuche er, diese so schnell wie möglich zu beheben.
Das heißt aber dennoch, dass Sie bitte zunächst ein Backup Ihrer Daten erstellen oder die Zutilo-Funktionen zunächst auf einer kleinen Anzahl von Einträgen ausprobieren, ob es es so funktioniert, wie Sie es erwarten, wenn Sie es für das erste Mal nutzen!

Installieren
------------

### 1.

Der einfachste Weg, Zutilo für Zotero als Firefox-Erweiterung zu installieren, ist mit [der Mozilla Add-ons-Seite Zutilos](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Zutilo die Mozilla Add-ons-Seite").
Navigieren Sie in Firefox genau dorthin und klicken Sie auf die Schaltfläche "Zu Firefox hinzufügen".
Für Zotero Standalone, müssen Sie die .xpi-Datei herunterladen und manuell installieren (siehe unten).

Um die .xpi-Datei zu erhalten, navigieren Sie zur [Mozilla Add-ons-Seite Zutilos](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Zutilo die Mozilla Add gehen -ons-Seite ").
Wenn Sie Firefox verwenden, bitte anstatt auf den "Zu Firefox hinzufügen"-Button linkszuklicken, bitte auf den Button rechtsklicken und "Ziel speichern unter ..." wählen.
Sie bekommen dann einen Dialog, in dem Sie die .xpi-Datei speichern können.
Wenn Sie einen anderen Web-Browser als Firefox wählen, sollte der "Zu Firefox hinzufügen"-Button stattdessen eine "Jetzt herunterladen"-Schaltfläche sein. Sie können dann klicken, um die .xpi-Datei herunterzuladen.

Sobald Sie die Zutilo .xpi Datei haben, auf Extras-\>Add-ons sowohl in Firefox als auch Zotero Standalone gehen.
Klicken Sie auf den Zahnrad-Button im rechten oberen Bereich des Add-ons-Manager-Fensters und wählen Sie "Install Add-on Aus Datei".
Dann wählen Sie die .xpi-Datei zur Installation aus.

### 2.

####

Wenn Sie Probleme mit der Mozilla Add-ons-Seite haben, können Sie Zutilo auch von [den Downloads Abschnitt der GitHub Seite Zutilos](https://github.com/willsALMANJ/Zutilo/downloads "Zutilo's GitHub page") downloaden.

1. Klicken Sie auf die "Download as zip"-Schaltfläche.
2. Dann entpacken Sie die heruntergeladene Datei.
3. Nun zippen Sie den Ordner erneut und ändern die Dateiendung von "zip" auf "xpi" (warum die GitHub Version der Zip-Datei nicht direkt verwendet werden kann, sondern nur Entpacken und Rezippung funktionieren, weiß der Entwickler derzeit auch nicht).
.
4. .
5. .
6. . 
7. .

####

Wenn Sie Schwierigkeiten haben, die .xpi-Datei mit Firefox ans Funktionieren zu bringen, gibt es eine weitere Methode, die Sie ausprobieren können.

1. Speichern Sie alle entpackten Zutilo Dateien irgendwo an der Stelle auf Ihrem Computer, in der Sie Zutilo ablegen wollen.
2. Erstellen Sie eine Textdatei mit dem Namen zutilo@www.wesailatdawn.com
3. Tragen Sie den Verzeichnispfad zum Speicherort des Ordners Zutilos als einzige Textzeile ein
4. Speichern Sie die Datei in Ihrem Firefox-Profil-Ordner ab (diese Methode wird wahrscheinlich auch mit Zotero Standalone arbeiten, wenn Sie dessen Erweiterungen Ordner finden können).

Diese Methode ist nützlich, wenn Sie git verwenden, um ein aktuelles Zutilo aus GitHub zu ziehen (wenn Sie Zutilo von der Mozilla Add-ons-Seite verwenden, sollte Firefox (oder Zotero Standalone) automatisch Zutilo aktualisieren, nachdem die Updates von Mozilla genehmigt wurden ( der Ablauf benötigt immer ein wenig Zeit, nachdem eine Release von Änderungen auf GitHub eingecheckt wurde)).
.

Leistungsmerkmale vorschlagen und Bugs melden
---------------------------------------------

Die neuesten Quellcode für Zutilo finden Sie auf [GitHub](https://github.com/willsALMANJ/Zutilo "Zutilo's GitHub page").
Bugreports können durch Klicken auf die "New Issue"-Taste unter [die Issues Abschnitt](https://github.com/willsALMANJ/Zutilo/issues "GitHub Probleme gemeldet werden page") direkt auf der GitHub Webseite eingestellt werden.
Dort sollten Sie auch zunächst überprüfen, ob ein von Ihnen bemerktes Problem bereits von einem anderen Benutzer gemeldet wurde.
Achten Sie auf die "closed"-Reiter des Issues Abschnitt, um zu überprüfen ob der Fehler bereits behoben wurde.

Vorschläge für neue Leistungsmerkmale in Zutilo können gerne ganz einfach durch die Eröffnung eines neuen Issue-Tickets eingebracht werden.
Bitte öffnen Sie immer zunächst ein neues Ticket, bevor Sie neuen Code einsenden und beziehen Sie sich auf diese Ticket Nr..
Eine Beschreibung der Art von Funktionen, die für Zutilo vorgesehen oder geplant sind, kann auf [der Zutilo Wiki-Seite](https://github.com/willsALMANJ/Zutilo/wiki) gefunden werden.
Ein Fahrplan der geplanten Features steht auch in diesem Wiki zur Verfügung.

Die Übersetzungen zu Zutilo wurden bisher im Web Translation System von [BabelZilla](www.babelzilla.org) verwaltet.
Die Lokalisierungen sind derzeit auf github umgezogen.
Neue Sprachumgebungebungen können sowohl dort als auch als Fork über Pull-Requests hinzugefügt werden.
.

Log der wichtigsten Änderungen in Zutilo
----------------------------------------

Dieser Abschnitt ist kein vollständiges Protokoll aller Änderungen an Zutilo.
Es enthält nur die größeren Änderungen der Funktionalität oder zusätzlichen Features.
Wenn bei einem Upgrade von Zutilo Probleme auftauchen, versuchen Sie in diesem Abschnitt nach einer Erklärung zu suchen.

* In version 1.2.11:

	1. New shortcuts/menu items:
		- Copy Zotero select link
		- Copy Zotero URI
	2. New shortcuts:
		- Focus collections, items pane, and various item pane tabs
		- Attachments: recognize PDF, create parent item, and rename from parent

* In Version 1.2.5: 

    1. TODO
    2. TODO
    3. TODO

* In Version 1.2.4 wurde Zutilo auf Deutsch übersetzt.

* In Version 1.2.3 wurden Funktionen hinzugefügt, um Seiten und Links in Firefox im aktuell ausgewählten Zotero Eintrag anzuhängen und die aktuelle Seite zu Zotero sparen mit Anhängen, wenn die Standardeinstellung ist ohne Anhänge zu speichern (oder zu speichern, ohne Anhänge, wenn die Standardeinstellung ist, mit ihnen zu sparen).

* Ab der Version 1.2.1, kann Zutilo ohne Neustart von Firefox installiert und deinstalliert werden.

* Ab der Version 1.1.17, sollten Änderungen, die mit modifyAttachments gemacht wurden, auch nach einem Neustart Firefox erhalten bleiben.

* Ab der Version 1.1.16, können Sie mit modifyAttachments nun Elemente des Pfads ausgehend vom Wurzelverzeichnis ersetzen.

* Ab der Version 1.1.15, modifyAttachments sollte nun mit Windows-Pfaden arbeiten.

* Ab der Version 1.1.11 wurde das wichtigste JavaScript-Objekt, das Zutilo um die Funktionalität von Zotero herum anlegt, von "Zotero.Zutilo" auf "ZutiloChrome.zoteroOverlay" umbenannt.
In allen Tastenkombinationen, müssen nun in den Methodenaufrufen die dieses Objekt aufrufen die Namen entsprechend umbenannt werden.

Credits
-------

Zutilo basiert auf dem Firefox-Erweiterungs Format [XUL Schule Tutorial](https://developer.mozilla.org/en-US/docs/XUL_School).
Darüber hinaus wurden Beispiele aus der [Mozilla Developer Network](https://developer.mozilla.org/) Dokumentation und dem Zotero Quellcode übernommen.
Bei der Übersetzung dieser Dokumentation ins Deutsche wurde der ursprüngliche Text des Entwicklers Will Shanks von Armin Stroß-Radschinski redigiert und überarbeitet.
Das HTML der ersten deutschen Übersetzung aus [BabelZilla](www.babelzilla.org) wurde von ihm mithilfe von [pandoc](http://johnmacfarlane.net/pandoc/) wieder in markdown mit Einzelzeilen zurückübersetzt.
