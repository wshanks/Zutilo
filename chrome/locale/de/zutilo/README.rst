Zutilo
======

Zutilo ist eine kleine Firefox-Erweiterung, die als Plug-In für
den\ `Zotero Firefox-Erweiterung <http://www.zotero.org/>`__\ dient.
Zutilo wurde als Dienstprogramm für mehrere Funktionen konzipiert, die
in Zotero nicht vorhanden sind. Der Name wurde durch Erweiterung des
Wortstamms "utility" gewählt, so dass es nach "Zotero" klingt. Die UI
Elemente von Zutilo (Menü, Kontextmenü) können einzeln auf verschiedenen
Ebenen deaktiviert werden, so dass Zutilo nicht die Benutzeroberfläche
überfrachtet.

Aktuelle Feature-Liste
----------------------

Tastenkombinationen
~~~~~~~~~~~~~~~~~~~

Die meisten Zutilo-Funktionen können über das Kontextmenü (welches mit
der rechten Maustaste auf relevanten Elementen in Zotero oder Firefox
erscheint) erreicht werden. Es kann effektiver sein, viele der
Funktionen von Zutilo direkt über die Tastatur anstatt über Kontextmenüs
zu aktivieren. Shortcuts für viele Funktionen Zutilos (und einige
Funktionen des reinen Zoteros) können in der Zutilo
Einstellungen-Fenster (erreichbar von der Add-ons-Manager oder der
Zotero Aktionen Menü (das "Zahnrad"-Symbol) eingestellt werden.

Wenn Sie möchten, können Sie auch die Verknüpfungen Zutilos mit der
`Customizable Shortcuts
Firefox-Plugin <https://addons.mozilla.org/en-US/firefox/addon/customizable-shortcuts/>`__
setzen. Einstellungen mit dieser Erweiterung gemacht überschreibt alle
Einstellungen gemachten im Zutilo Einstellungen Fenster. Einstellen der
Verknüpfungen Zutilos mit dem `KeyConfig
Erweiterung <http://forums.mozillazine.org/viewtopic.php?t=72994>`__
wird nicht empfohlen (die Einstellungen arbeiten für eine Sitzung, aber
sie werden durch Zutilo überschrieben wenn Firefox neu gestartet wird).

Die Funktionen Zutilos können Tastenkombinationen mithilfe einer anderen
Firefox-Plugin zugeordnet werden, wie z.B.
`KeyConfig <http://forums.mozillazine.org/viewtopic.php?t=72994>`__,
welches eine einfache Schnittstelle für die Zuordnung von
Tastenkombinationen zu Javascript-Befehlen bietet und sowohl mit Firefox
und Zotero Standalone funktioniert, oder
`Pentadactyl <http://5digits.org/pentadactyl/index>`__ oder
`Vimperator <http://www.vimperator.org/vimperator>`__, die beide eine
erweiterte Kommandozeilen-Schnittstelle für Firefox bieten (Pentadactyl
Benutzer könnten an
`Zoterodactyl <https://github.com/willsALMANJ/Zoterodactyl>`__
interesiert sein, eine Gruppe Pentadactyl Plugins, die viele
Tastenkombinationen zu Pentadactyl fügt). In den Beschreibungen der
Funktionen unten sind die entsprechende Funktion Namen angegeben. Dies
sind die Namen der Funktionen, die zugeordnet werden müssen, um diese
Funktionen ohne Kontextmenüs aufzurufen.

Kontextmenü Funktionen
~~~~~~~~~~~~~~~~~~~~~~

Jede der folgenden Funktionen können aus dem Zotero Kontextmenü
aufgerufen werden (zugänglich mit der rechten Maustaste in der zentralen
List von Zotero, wo alle Einträge einer Sammlung aufgeführt sind). In
den Zutilo Einstellungen (zugänglich im gleichen Menü wie die
Zotero-Einstellungen), kann jede dieser Funktionen so eingestellt
werden, damit diese im Zotero Kontextmenü, in einem Zutilo Untermenü des
Zotero Kontextmenü oder überhaupt nicht angezeigt zu werden.

-  **Kopieren Tags:**

   Machen sie einen Rechtsklick auf einen oder mehrere markierte
   Einträge in der Zotero-Bibliothek und kopieren ihre Tags in die
   Zwischenablage als eine '\\r\\n' getrennte Liste. Ab Zotero 4.0 kann
   eine solche Liste von Tags in einem neuen tag Feld eingefügt werden,
   um alle der Tags zu einem Element sogleich hinzuzufügen. (Name der
   Funktion: ``ZutiloChrome.zoteroOverlay.copyTags()``).

-  **Einfügen Tags:**

   Machen sie einen Rechtsklick auf einen oder mehrere markierte
   Einträge auf Elemente in der Zotero-Bibliothek und fügen Sie den
   Inhalt der Zwischenablage in ihnen als Tags ein. Der Inhalt der
   Zwischenablage muss eine '\\r\\n' oder '\\n' getrennte Liste (wie die
   Liste durch die oben beschriebene "Tags Kopieren" Funktion erstellt).
   (Name der Funktion: ``ZutiloChrome.zoteroOverlay.pasteTags()``).

-  **Autor Kopieren:**

   Machen sie einen Rechtsklick auf einen oder mehrere markierte
   Einträge auf Elemente in der Zotero-Bibliothek und kopieren ihre
   Autoren in die Zwischenablage als eine '\\r\\n' getrennte Liste.
   (Name der Funktion: ``ZutiloChrome.zoteroOverlay.copyCreators()``).

-  **Anhangpfade zeigen:**

   Zeigen Sie die Pfade zu ausgewählten Anhängen und die Anhänge der
   ausgewählten regulären Einträge (nacheinander als separate
   Dialogfenster - Sie wollen wahrscheinlich nicht mehr als ein paar
   Artikel zu einem Zeitpunkt auf diese Weise auswählen). (Name der
   Funktion: ``ZutiloChrome.zoteroOverlay.showAttachments()``).

-  **Anhangpfade ändern:**

   Ändern Sie den Anfang der Pfade für alle zugelassenen ausgewählten
   Anhänge und aller Anhänge der ausgewählten regulären Einträge. Zwei
   Prompt Fenster werden angezeigt. Das erste fragt nach dem alten
   partiellen Pfad, während das zweite nach dem neuen Teilstrecke fragt.
   Wenn Sie "C:/userData/references/" für den ersten Pfad und "E:/" für
   den zweiten Pfad eingeben, dann wird der Pfad eines verlinkten
   Anhangs von
   "C:/userData/references/journals/Nature/2008/coolPaper.pdf" zu
   "E:/journals/Nature/2008/coolPaper.pdf" geändert, während ein Anhang
   mit Pfad "E:/journals/Science/2010/neatPaper.pdf" unverändert bleibt.
   Diese Funktion ist vor allem nützlich, wenn Sie verschiedene Computer
   oder Festplatten nutzen und die Links zu allen Ihren Anhängen
   erhalten bleiben sollen.

   Standardmäßig wird der alte Teilpfad nur mit dem Beginn eines jeden
   Anhangpfads verglichen. Um Teile der verlinkten Pfade nicht am Anfang
   zu ändern, klicken Sie auf das "Alle Instanzen der Teilpfad
   Zeichenkette ersetzen" Kontrollkästchen in der ersten
   Eingabeaufforderung. Diese Option ist nützlich, wenn Sie einen
   Unterordner oder zwischen Windows-und Unix-Pfade ("\\" und "/"
   ersetzen) umbenennen möchten. (Name der Funktion:
   ``ZutiloChrome.zoteroOverlay.modifyAttachments()``).

-  **Zugehörige Einträge verbinden:**

   Sogt dafür, dass alle ausgewählten Elemente als miteinander zugehörig
   verbunden werden. (Name der Funktion:
   ``ZutiloChrome.zoteroOverlay.relateItems()``).

Editierfunktionen für die Einträge
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Zutilo implementiert derzeit mehrere Funktionen, die für die Bearbeitung
von Zotero Einträge mit der Tastatur nützlich sind. Diese Funktionen
können nicht von jedem UI Element aus aufgerufen werden (sie können
aber, wie oben beschrieben, auf eine Tastenkombination zugewiesen
werden). Die folgenden Funktionen arbeiten nur, wenn ein einziges Zotero
Eintrag ausgewählt ist:

-  **Eintraginfo bearbeiten:** Wählen Sie den Tab "Infos" im
   Eintragsbereich rechts. Setzen Sie den Fokus auf das erste
   editierbare Feld des Eintraginfo. (Name der Funktion:
   ``ZutiloChrome.zoteroOverlay.editItemInfoGUI()``).
-  **Notizen hinzufügen:** Wählen Sie den Tab "Notizen" im
   Eintragsbereich rechts. Erstellen Sie eine neue Notiz. Der
   Vollständigkeit halber: Zotero hat bereits eine Tastenkombination,
   die das tut. Diese kann in Zotero-Einstellungen festgelegt werden.
   (Name der Funktion: ``ZutiloChrome.zoteroOverlay.addNoteGUI()``).
-  **Tag hinzufügen:** Wählen Sie den Tab "Tags" im Eintragsbereich
   rechts. Öffnet ein neues Textfeld, um einen neuen Tag zu eingeben.
   (Name der Funktion: ``ZutiloChrome.zoteroOverlay.addTagGUI()``).
-  **Einträge zugehörigen:** Wählen Sie den "Zugehörig" Tab im
   Eintragsbereich rechts. Öffnen Sie den Dialog, um zugehörige Einträge
   zu verbinden. (Name der Funktion:
   ``ZutiloChrome.zoteroOverlay.addRelatedGUI()``).

Firefox Browser-Funktionen
~~~~~~~~~~~~~~~~~~~~~~~~~~

Zutilo verfügt ein paar Funktionen, um in Firefox leichter mit den
Anhängen von Dokumenten an Zotero Einträgen aus Seiten zu arbeiten. Auf
diese Funktionen wird vom Firefox-Browser aus zugegriffen wenn sie nicht
mit Zotero Standalone arbeiten.

-  **Webseiten und Links an Zotero Eintrag anhängen:**

   Zutilo fügt dem Kontextmenü von Firefox Einträge hinzu, um für den
   aktuell ausgewählte Zotero Eintrag das Anhängen der aktuellen Seite
   oder des aktuellen Link-Ziels (wenn ein Link ausgewählt wird) zu
   ermöglichen. Wie die Anlage verarbeitet wird hängt von der in den
   Zutilo Einstellungen eingestellten Methode zum Anhängen ab. Wenn die
   Methode 'Import' gewählt ist, wird ein importierter Anhang von der
   Seite / Link erstellt. Wenn die Methode 'Für verlinkte Datei
   auffordern' ist, erscheint ein Datei Prompt, damit der Benutzer eine
   neue Datei angeben kann. Die Seite / Link wird in dieser Datei
   gespeichert und dann ein verlinkter Dateianhang (verbunden mit der
   heruntergeladenen Datei) erstellt. Wenn die Methode 'Nach dem Ersten
   auffordern' ist, wird ein importierter Anhang erstellt, wenn das
   ausgewählte Element keine früheren Anhänge hat (nicht mitgerechnet
   die Schnapschuss Anhänge). Andernfalls wird der Datei Prompt für
   einen verknüpften Dateianhang angezeigt. Wenn die Shift-Taste
   gedrückt wird, wenn die Anlage aktiviert ist, wird eine Aufforderung
   zur Eingabe eine verlinkten Datei angezeigt, unabhängig von der
   Voreinstellung in Zutilo. Wenn die Steuerung-Taste gedrückt wird,
   wird die Anlage unabhängig von der Voreinstellung in Zutilo
   importiert.

   Wenn Sie eine Tastenkombination erstellen wollen, um die aktuelle
   Seite an den aktuellen Zotero Eintrag entsprechend den Einstellungen
   in Zutilo anzuhängen, verwenden Sie
   ``ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(window.content.location.href)``
   für den Befehl. Der allgemeine Funktions Anruf ist
   ``ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(url, ProcessType)``
   wobei ``url`` ein String mit der Download URL ist und ProcessType
   "Zotero", 'prompt' oder 'promptAfterOne' sein könnte. Wenn
   ProcessType nicht angegeben oder auf etwas anderes gesetzt ist, die
   Anlage-Methode in Zutilo Einstellungen benutzt ist.

-  **einen Zotero Eintrag aus einer aktuellen Webseite mit / ohne
   Anhänge erstellt:**

   Zutilo fügt zusätzliche Menüpunkte im Kontextmenü des Zotero Symbols
   der Addressleiste hinzu, die ein Zitat aus der aktuellen Seite mit
   oder ohne zugehörigen PDF-und anderen Dateien zu extrahiert. Das
   heißt, wenn die Option "Automatisch PDFs und andere Dateien anhängen"
   Einstellung in Zotero ausgewählt ist, fügt Zutilo Menüpunkte zur
   Erstellung eines neuen Zotero Eintrag ohne Anhänge hinzu (ein Element
   für jede Methode, die auf der aktuellen Seite "in Zotero speichern"
   gilt) . Wenn die Einstellung nicht ausgewählt ist, fügt Zutilo
   Menüpunkte hinzu, um einen neuen Zotero Eintrag mit den Anhängen zu
   speichern.

   Diese Funktion setzt die Funtionalität um, indem sie erst die
   zugehörige Einstellung Zoteros ändert, dann den Eintrag speichert,
   und anschließend die Einstellung wieder zurück in ihrem
   ursprünglichen Zustand versetzt. Da Zotero Seiten asynchron übersetzt
   (und damit gleichzeitig), sollten Übersetzungen mit dieser Funktion
   fertig sein, bevor die normalen Seiten Übersetzungen von Zotero
   benutzt werden (da sonst der Zustand der "Automatisch PDFs und andere
   Dateien anhängen" Einstellung vom Timing der Simultanübersetzung
   abhängt).

   Die Funktion, auf der diese Funktionen beruhen, ist
   ``ZutiloChrome.firefoxOverlay.scrapeThisPage(translate, filesBool)``.
   Wenn ``translate`` (ein Zotero translate Objekt) falsch oder nicht
   gesetzt ist, wird der Standard-Übersetzer für die Seite verwendet.
   Wenn fileBool true ist, wird der Eintrag mit den dazugehörigen
   Anhang-Dateien erstellt. Wenn es false ist, wird das Element ohne die
   dazugehörigen Dateien erstellt. Wenn filesBool nicht angegeben ist,
   dann wird das Gegenteil von Zoteros "Automatisch PDFs und andere
   Dateien anhängen" Einstellung verwendet. Also, wenn in
   Zotero-Einstellungen die Option "Automatisch PDFs und andere Dateien
   anhängen"-Option ausgewählt ist, wird
   ``ZutiloChrome.firefoxOverlay.scrapeThisPage(false)`` einen Eintrag
   mit den Default-Seite Übersetzern ohne Anhänge erstellen.

Reine Zotero-Funktionen
~~~~~~~~~~~~~~~~~~~~~~~

Als Referenz, sind hier ein paar andere Funktionen Zoteros aufgeführt,
für die es der Verfasser nützlich findet, Tastenkombinationen zu
erstellen:

-  **Zotero öffnen / schließen:** Zeigt / verbirgt die Zotero-Panel in
   Firefox. (Name der Funktion: ``ZoteroOverlay.toggleDisplay()``).
-  **Webseite als Zotero Eintrag speichern:** Speichert die aktuelle
   Seite als Webseite Eintrag in Zotero. (Name der Funktion:
   ``ZoteroPane.addItemFromPage()``).
-  **Zotero Eintrag aus einer Webseite erstellen:** Fügt einen Eintrag
   in die Zotero-Bibliothek hinzu, der auf dem Referenz-Inhalt der
   aktuellen Webseite basiert (entspricht Klick auf die kleine Seite /
   Buch-Symbol in der Firefox-Adressleiste). (Name der Funktion:
   ``Zotero_Browser.scrapeThisPage()``).

Ein Notiz über Anhänge
~~~~~~~~~~~~~~~~~~~~~~

Zutilo bietet einige Funktionen, die mehr Kontrolle über die Verwaltung
von Anhängen in Zotero geben. Hier einige mögliche Verwendungen von
Zotero Anhänge überprüft werden, um darauf hinzuweisen, ein paar
mögliche Nutzungen Zutilos.

Zotero bietet eine Metadaten-reiche Schnittstelle für die Organisation
und den Export Referenzen. Es kann auch als eine erweiterte
Datei-Browser durch Anhängen von Dateien an Zotero Einträge
funktionieren. Diese Elemente können dann durch die Suche der Zotero
Datenbank Felder (zB Autor, Titel, Tags, Publikation, Jahr, etc.) in
einer mehr feinkörnigen Weg abgerufen werden, als ein einfaches
Dateisystem Suche.

Zotero bietet zwei Arten von Anhänge, importierte Dateien und linkte
Dateien. Importierte Dateianhänge sind innerhalb Zotero
Storage-Verzeichnis mit jedem Anhang in einem separaten Ordner mit einem
zufälligen Folge von Buchstaben und Zahlen benannt gespeichert. Linkte
Dateianhänge speichern nur den Link, um einen Anhang Speicherort der
Datei auf dem Dateisystem (so diese Anhänge können in einer Datei
Hierarchie zugänglicher für Mitglieder außerhalb von Zotero gespeichert
werden).

Rein Zotero bietet größere Unterstützung für importierte Datei-Anhänge
als für linkten Dateianhänge. Mit reinem Zotero, wenn ein neuer Eintrag
durch Extraktion der Zitationinformation von einer Webseite erstellt
wird, kann Zotero herunterladen PDF (oder andere Dateien) mit dem
Eintrag von der Webseite als importierte Datei-Anhänge automatisch
zugeordnet. Es kann auch synchronisieren importierten Anhänge zum Zotero
Server.

Die `ZotFile
Erweiterung <http://www.columbia.edu/~jpl2136/zotfile.html>`__ bietet
zusätzliche Unterstützung für verlinkte Datei-Anhänge in Zotero. ZotFile
kann automatisch neue importierten Dateianhänge zu linkten Dateianhänge
konvertieren und die Dateianhänge umbenennen und in einem auf der
Anhangs Metadaten basierten Ort verschieben. Diese Eigenschaft macht die
Aufrechterhaltung eines Verzeichnisses der linkten Dateianhänge so
einfach wie mit Zotero die importierten Anhänge. ZotFile können auch
Batch umbenennen und verschieben bestehenden angehängten Dateien
(linkten oder importierten) und die zuletzt geänderten Dateien in den
Firefox-Download-Ordner zu Zotero Einträge befestigen als verschoben und
umbenannt linkten Dateianhänge. (ZotFile hat auch Funktionen für
Extrahieren von PDF-Annotationen als Zotero Notizen und für die
Synchronisierung Dateianhänge in Tablet-Geräten.)

Mit ZotFile, ist es einfach eine Bibliothek von linkten Dateianhänge zu
erstellen und zu pflegen. Allerdings können diese Dateien nicht von
Zotero mit der Zotero Server synchronisiert werden. Ab der Version 4.0
unterstützt Zotero relative Pfade für linkten Dateianhänge. Mit linkten
Dateianhänge als relative Pfade gespeichert, kann eines Benutzers
Zotero-Bibliothek auf mehreren Rechnern syncronisiert werden und alle
linkte Datei-Links werden weiterhin arbeiten, solange das
Basisverzeichnis enthält alle verknüpften Dateianlagen zu jeder Maschine
kopiert wird. (Alternativ könnte die Dateianhänge auf einem Netzlaufwerk
gespeichert werden, das jede Maschine als Basis-Verzeichnis nutzt.)

Die Anhangpfade-Ändern-Funktion Zutilos kann mit der Arbeit mit linkten
Dateianhänge helfen. Sie ändert per Batch ein Teil der Pfade aller
ausgewählten Anhänge. Also, wenn eine Gruppe von Dateieanhänge in einen
neuen Ordner verschoben wird, kann die Anhangpfade-Ändern-Funktion
Zutilos verwendet werden, um alle linkten Anhangpfade auf einmal zu
aktualisieren. Diese Funktion kann auch verwendet werden, um "/" auf
"\\" im Anhangpfade mit Wechsel Betriebssysteme zu ändern. Die relative
Pfade Merkmal Zotero 4,0 ersetzt die Notwendigkeit für diese Funktion,
obwohl sie mit Anhänge nützlich sein kann, die welchem ​​Grund auch
immer nicht relative sind. Die Anhangpfade-Zeigen-Funktion Zutilos ist
auch nützlich für die Fehlersuche der Anhangpfade derzeit in Zotero
gespeicherten, insbesondere für gebrochene Pfade, so dass die Pfade mit
einer Änderung der Anhangfade funktionieren, anstatt individuell neue
Anhangpfade auswahlen zu müssen.

Die Seite- und Link-Anhangen Funktionen Zutilos sind nützliche für das
Anhängen von Dateien an Zotero Einträge die verpasst wurden, wenn der
Eintrag ursprünglich erstellt wurde, oder nur für Anhängen zusätzliche
Elemente später. Anhänge werden nach dem üblichen Verfahren geschaffen,
so dass diese Funktionen benutzt werden können, um importierte
Dateianhänge (Standardeinstellung) zu erstellen, auch linkte
Dateianhänge, wenn ZotFile festgelegt ist, automatisch neue Anhänge zu
umbenennen und verschieben. Beachten Sie, dass die Verwendung der "Für
linkte Datei auffordern" Einstellung Zutilos auch ZotFile auslöst (es
macht keinen Sinn, eine Datei locaiton über die Eingabeaufforderung
auszuwählen). In Zutilo-Einstellungen können die Seite- und
Link-Anhangen Funktionen eingestellt werden, so dass Zutilo nach einem
Speicherort auffordert nur, wenn ein Eintrag bereits andere Anhänge hat.
Diese Einstellung funktioniert gut mit der "Nur nachfragen, wenn weitere
Anh. vorhanden"-Option ZotFiles, so dass ZotFile den ersten Anhang
verschiebt und umbenennt und dann Zutilo über die Namen / Lage der
nachfolgenden eingibt.

Manchmal ist es nützlich, um Verweise auf einer Auflistung von Einträge
für die zukünftige Verwendung zu speichern, aber es ist
unwahrscheinlich, dass die Dokumente selbst müssen konsultiert werden.
In diesem Fall ist es am besten, um die Elemente in Zotero die
zugehörige Dokument ohne Anhänge zu speichern. Zutilo bietet Funktionen
zum Speichern Artikel mit und ohne Anhänge. Mit diesen Funktionen spart
man sich die Mühe der manuellen Änderung die "automatisch zugehörige
PDFs und andere Dateien anhängen" Einstellung Zoteros oder der manuell
Löschen nicht benötigter Anhänge.

Grenzen
~~~~~~~

Im Moment arbeitet Zutilo mit Zotero als Firefox Browser-Ausschnitt oder
App Tab und mit Zotero Standalone. (In der Vergangenheit haben einige
Funktionen nicht mit dem separaten Tab und Standalone-Versionen
gearbeitet. Wenn etwas scheint nicht zu einem dieser Modi arbeiten,
versuchen Sie es mit Zotero als Browser-Ausschnitt in Firefox und sehen,
ob es dort funktioniert. Dann wenden Sie sich bitte mich über die
`Mozilla Add-ons
Seite <https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/>`__
oder `GitHub Seite <https://github.com/willsALMANJ/Zutilo>`__ Zutilos).
Einige Browser-spezifische Funktionen sind nicht in Zotero Standalone
verfügbar.

Eine Warnung: Ich (und eine Reihe anderer heute) arbeite mit Zutilo für
eine Weile jetzt auf meinem eigenen Zotero Sammlung ohne Frage. Wenn ich
über irgendwelche Bugs alarmiert bin, versuche ich, sie so schnell wie
möglich zu beheben. Das heißt, entweder machen Sie ein Backup Ihrer
Daten oder probieren Sie Zutilo-Funktionen auf einer kleinen Anzahl von
Einträge, dass es so funktioniert, wie Sie erwarten, wenn Sie es für das
erste Mal nutzen!

Installieren
------------

Der einfachste Weg, Zutilo für Zotero als Firefox-Erweiterung zu
installieren, ist mit `der Mozilla Add-ons-Seite
Zutilos <https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/>`__.
Genau dorthin navigieren in Firefox und klicken Sie auf die Schaltfläche
"Zu Firefox hinzufügen". Für Zotero Standalone, müssen Sie die
.xpi-Datei herunterladen und manuell installieren (siehe unten).

Um die .xpi-Datei zu bekommen, navigieren Sie zur `Mozilla Add-ons-Seite
Zutilos <https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/>`__.
Wenn Sie Firefox verwenden, anstatt auf den "Zu Firefox
hinzufügen"-Button zu linksklicken, rechtsklicken Sie auf ihn und wählen
Sie "Ziel speichern unter ...." Sie bekommen dann einen Dialog, damit
Sie die .xpi-Datei speichern können. Wenn Sie einen Web-Browser anderen
von Firefox, sollte die "Zu Firefox hinzufügen"-Button stattdessen eine
"Jetzt herunterladen"-Taste sein. Sie können darauf klicken, um die
.xpi-Datei herunterzuladen.

Sobald Sie die Zutilo .xpi Datei haben, auf Extras->Add-ons in beiden
Firefox oder Zotero Standalone gehen. Klicken Sie auf das Zahnrad-Button
in der rechten oberen Bereich des Add-ons-Manager-Fenster, und wählen
Sie "Install Add-on Aus Datei." Dann wählen Sie die .xpi-Datei.

Wenn Sie Probleme mit dem Mozilla Add-ons-Seite haben, können Sie auch
downloaden Zutilo von `den Downloads Abschnitt der GitHub Seite
Zutilos <https://github.com/willsALMANJ/Zutilo/downloads>`__. Klicken
Sie auf den "Download as zip"-Schaltfläche. Dann entpacken Sie die
heruntergeladene Datei, zip es wieder zurück, und ändern Sie die
Dateiendung von "zip" auf "xpi" (Ich weiß nicht, warum die GitHub
Version des Zip-Datei kann nicht direkt verwendet werden, sondern
Entpacken und rezippung funktionieren).

Wenn Sie Schwierigkeiten haben, die .xpi-Datei mit Firefox arbeiten zu
machen, gibt es eine weitere Methode, die Sie ausprobieren können.
Speichern Sie alle entpackten Zutilo Dateien irgendwo auf Ihrem
Computer, wo Sie Zutilo behalten wollen. Erstellen Sie eine Textdatei
mit dem Namen zutilo@www.wesailatdawn.com, legte den Verzeichnispfad zur
Ordner Zutios als einzige Textzeile, und speichern Sie die Datei in den
Ordner Ihrer Firefox-Profil-Ordner (diese Methode wäre wahrscheinlich
auch mit Zotero Standalone arbeiten, wenn Sie könnte seine Erweiterungen
Ordner finden). Diese Methode ist nützlich, wenn Sie git verwenden, um
aktuelles Zutilo aus GitHub zu ziehen (wenn Sie Zutilo von der Mozilla
Add-ons-Seite verwenden, sollte Firefox (oder Zotero Standalone)
automatisch Zutilo aktualisieren, nachdem Updates von Mozilla genehmigt
bekommen (ein wenige Zeit, nachdem sie GitHub gebucht werden)).

Leistungsmerkmalanforderungen und Bugeingabes
---------------------------------------------

Die neuesten Quellcode für Zutilo ist auf
`GitHub <https://github.com/willsALMANJ/Zutilo>`__. Bugs können durch
Klicken auf den "New Issue"-Taste unter `die Issues
Abschnitt <https://github.com/willsALMANJ/Zutilo/issues>`__ der GitHub
Ort ausgeweist werden. Dort können Sie auch überprüfen, um
festzustellen, ob ein Fehler, den Sie erleben bereits von einem anderen
Benutzer gemeldet wurde. Achten Sie auf die "closed"-Reiter des Issues
Abschnitt zu überprüfen, um zu sehen, ob der Fehler bereits behoben
wurde.

Leistungsmerkmalanforderungen kann auch durch die Eröffnung einer neuen
Issue vorgelegt werden. Bitte öffnen Sie eine neue Frage vor dem
Absenden Ihrer Code. Eine Beschreibung der Arten von Funktionen, die für
Zutilo zugehörig sind, kann auf `der Zutilo
Wiki-Seite <https://github.com/willsALMANJ/Zutilo/wiki>`__ gefunden
werden. Ein Fahrplan der geplanten Features ist auch auf dem Wiki zur
Verfügung.

Zutilo ist derzeit im Web Translation System von
`BabelZilla <www.babelzilla.org>`__ hochgeladen. Wenn irgendwelche
Sprachumgebungen außer Englisch ausgefüllt werden, werden sie auf Zutilo
hinzugefügt werden.

Log von importanten Änderungen Zutilos
--------------------------------------

Dieser Abschnitt ist nicht ein vollständiges Protokoll über Änderungen
an Zutilo. Es enthält nur die größeren Änderungen der Funktionalität
oder zusätzlichen Features. Wenn etwas kaputt geht auf einem Upgrade
Zutilo, versuchen Sie in diesem Abschnitt nach einer Erklärung.

-  In Version 1.2.4 wurde Zutilo auf Deutsch übersetzt.

-  In Version 1.2.3 wurden Funktionen hinzugefügt, um Seiten und Links
   in Firefox auf den aktuell ausgewählten Zotero Eintrag anzuhangen und
   die aktuelle Seite zu Zotero sparen mit Anhängen, wenn die
   Standardeinstellung ist ohne Anhänge zu speichern (oder zu speichern,
   ohne Anhänge, wenn die Standardeinstellung ist, mit ihnen zu sparen).

-  Ab der Version 1.2.1, kann Zutilo installiert und deinstalliert
   werden, ohne Neustart von Firefox.

-  Ab der Version 1.1.17, Änderungen mit modifyAttachments gemacht
   sollten immer nach einem Neustart Firefox fortbestehen.

-  Ab der Version 1.1.16, können Sie mit modifyAttachments nun Elemente
   des Weg anderen als der Anfang ersetzen.

-  Ab der Version 1.1.15, modifyAttachments sollte eigentlich mit
   Windows-Pfade arbeiten.

-  Ab der Version 1.1.11 hat die wichtigsten JavaScript-Objekt, das
   Zutilo erstellt, um die Funktionalität Zotero legen aus dem
   "Zotero.Zutilo" auf "ZutiloChrome.zoteroOverlay" umbenannt. Alle
   Tastenkombinationen, die Methoden dieses Objekts aufrufen, müssen
   Namen wechseln, um weiter zu arbeiten.

Credits
-------

Zutilo wurde auf der Firefox-Erweiterung Format im `XUL Schule
Tutorial <https://developer.mozilla.org/en-US/docs/XUL_School>`__
basiert. Darüber hinaus wurden Beispiele aus dem `Mozilla Developer
Network <https://developer.mozilla.org/>`__ Dokumentation und die Zotero
Quellcode übernommen. Hilfe bei der Übersetzung von Armin
Stroß-Radschinski bereitgestellt.
