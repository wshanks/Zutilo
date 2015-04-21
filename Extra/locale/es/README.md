Zutilo
======

Zutilo es una pequeña extensión para Firefox que funciona como un plugin para el [Zotero Firefox extensión](http://www.zotero.org/).
Zutilo fue diseñado como una herramienta para proporcionar varias funcionalidades pequeños que no están presentes en Zotero.
Su nombre fue elegido por tomar la palabra "utilidad" y hacerlo que suene más como "Zotero".
Todos los elementos gráficos de Zutilo se pueden desactivar individualmente, de modo que los rasgos no deseados no saturan la interfaz de usuario.

Lista de características presentes
----------------------------------

### Atajos de teclado ###
La mayoría de las características de Zutilo se puede acceder a través de menús contextuales que aparecen al hacer clic derecho en los elementos relevantes en Zotero o Firefox.
Puede ser útil para llamar a muchas de las funciones de Zutilo directamente desde el teclado en lugar de utilizar los menús contextuales.
Accesos directos para muchas de las funciones de Zutilo (y algunas funciones de básico Zotero) se pueden establecer en la ventana de preferencias de Zutilo (accesible desde el menú acciones de Zotero (el icono de "herramientas") o Herramientos-\>Add-ons.

Si lo prefiere, también puede usar [la Customizable Shortcuts extensión](https://addons.mozilla.org/en-US/firefox/addon/customizable-shortcuts/) para configurar los atajos de teclado de Zutilo.
Los ajustes realizados con esta extensión anularán todos los ajustes realizados en la ventana de preferencias de Zutilo.
Configuración de métodos abreviados de Zutilo con [la Keyconfig extensión](http://forums.mozillazine.org/viewtopic.php?t=72994) no se recomienda (la configuración funciona para una sesión, pero será reemplazado por Zutilo cuando Firefox se reinicie).

Funciones de Zutilo se pueden asignar a atajos de teclado con cualquier otro plugin de Firefox como [Keyconfig](http://forums.mozillazine.org/viewtopic.php?t=72994), que ofrece un interfaz sencilla para el mapeo de atajos de teclado para los comandos de Javascript y funciona tanto con Firefox y Zotero Standalone o [Pentadactyl](http://5digits.org/pentadactyl/index) o [Vimperator](http://www.vimperator.org/vimperator), que a la vez proporciona una interfaz de línea de comandos más avanzada para Firefox (usuarios de Pentadactyl podrían estar interesadas en [Zoterodactyl](https://github.com/willsALMANJ/Zoterodactyl), un conjunto de Pentadactyl plugins que proporcionan asignaciones de teclas para Zotero y Zutilo).
En las descripciones de las características a continuación, los nombres de las funciones correspondientes se dan.
Estos son los nombres de las funciones que deben asignarse a llamar a estas funciones sin necesidad de utilizar los menús contextuales.

### Funciones del ítem menú ###
Cada una de las siguientes funciones se pueden llamar desde el Zotero ítem menú (accesado con un clic derecho en el panel de ítems en el medio de Zotero en la que todos los elementos de una colección están en la lista).
En las preferencias de Zutilo (se accede desde el mismo menú como las preferencias de Zotero), cada una de estas funciones se pueden configurar para que se muestre en el Zotero ítem menú, en un Zutilo submenú del Zotero ítem menú, o no aparecer en absoluto.

* __Copiar marcas:__
    Haga clic en los elementos de la biblioteca de Zotero y copia sus marcas al portapapeles como un '\r\n' delimitada lista.
    A partir de Zotero 4.0, una lista de las marcas se pueden pegar en una caja nueva marca para añadir todas las marcas a un elemento a la vez.
    (Nombre de la función: `ZutiloChrome.zoteroOverlay.copyTags()`).

* __Pegar marcas:__
    Haga clic en los elementos en la biblioteca de Zotero y pega el contenido del portapapeles a ellos como nuevas marcas.
    El contenido del Portapapeles debe ser un '\r\n' o '\n' delimitada lista (por ejemplo, la lista creada por la función de copia de marcas descrita anteriormente).
    (Nombre de la función: `ZutiloChrome.zoteroOverlay.pasteTags()`).

* __Copiar creadores:__
    Haga clic en los elementos de la biblioteca de Zotero y copia sus creadores en el portapapeles como un '\r\n' delimitada lista.
    (Nombre de la función: `ZutiloChrome.zoteroOverlay.copyCreators()`).

* __Mostrar caminos de adjuntos:__
    Muestra las rutas de acceso a los elementos seleccionados y los adjuntos de artículos regulares (uno a uno como ventanas de diálogo por separado - es probable que no desee seleccionar más de un par de cosas a la vez de esta manera).
    (Nombre de la función: `ZutiloChrome.zoteroOverlay.showAttachments()`).

* __Modificar caminos de adjuntos:__
    Cambie el inicio del camino a todos los adjuntos elegibles seleccionados y todos los adjuntos de seleccionados artículos regulares.
    Dos ventanas de solicitud aparece.
    El primero pregunta por el camino viejo parcial mientras que el segundo pide la ruta parcial nuevo.
    Si escribe "C:/userData/referencias/" para el primer camino y "E:/" por el segundo camino, entonces un adjunto con un camino de "C:/userData/referencias/journals/Nature/2008/coolPaper.pdf" tendrá su ruta cambiada a "E:/journals/Nature/2008/coolPaper.pdf", mientras que un adjunto con la ruta "E:/journals/Science/2010/neatPaper.pdf" se deja sin cambios.
    Esta función es especialmente útil para cuando se cambia de ordenador o discos duros y romper los vínculos de todos sus adjuntos.

    De forma predeterminada, la ruta de acceso parcial viejo es sólo en comparación con el inicio de cada ruta de los adjuntos.
    Para reemplazar elementos de caminos no al comienzo, haga clic en la "Reemplazar todas las instancias del texto del camino parcial" casilla de verificación en la ventana que aparece en primer lugar.
    Esta opción es útil si desea cambiar el nombre de una subcarpeta o cambiar entre Windows y Unix caminos de estilo (reemplazando `\` y `/`).
    (Nombre de la función: `ZutiloChrome.zoteroOverlay.modifyAttachments()`).

* __Relacionar ítems:__
    Relaciona todos los ítems seleccionados entre sí.
    (Nombre de la función: `ZutiloChrome.zoteroOverlay.relateItems()`).

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

### Funciones de edición de ítems ###

Zutilo actualmente implementa varias funciones que son útiles para la edición de ítems de Zotero con el teclado.
Estas funciones no se pueden llamar desde cualquier elemento gráfico (pero puede ser asignado a un acceso directo del teclado como se ha descrito anteriormente).
Las siguientes funciones funcionan cuando un solo ítem de Zotero está seleccionado:

* __Editar ítem información:__
    Seleccione la pestaña "Información" en el ítem-panel.
    Ajuste el foco al primer campo editable de información del ítem.
    (Nombre de la función: `ZutiloChrome.zoteroOverlay.editItemInfoGUI()`).
* __Añadir nota:__
    Seleccione la ficha "Notas" del ítem-panel.
    Crea una nueva nota.
    Fue agregado por completo, pero Zotero ya tiene un atajo de teclado que hace esto.
    Se puede configurar en las preferencias de Zotero.
    (Nombre de la función: `ZutiloChrome.zoteroOverlay.addNoteGUI()`).
* __Añadir marca:__
    Seleccione la ficha "Marcas" del ítem-panel.
    Abre un cuadro de texto para crear una marca nueva.
    (Nombre de la función: `ZutiloChrome.zoteroOverlay.addTagGUI()`).
* __Añadir ítem relacionado:__
    Seleccione la ficha "Relacionado" del ítem-panel.
    Abre el diálogo para agregar elementos relacionados.
    (Nombre de la función: `ZutiloChrome.zoteroOverlay.addRelatedGUI()`).

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

### Funciones del Firefox navegador ###

Zutilo añade algunas funciones para ayudar con adjuntar documentos a los ítems de Zotero de páginas en Firefox.
Estas funciones se accede desde el navegador Firefox y no funcionan con Zotero Standalone.

* __Colocación de páginas web y enlaces a ítems de Zotero:__
    Zutilo añade elementos a menú contextual de Firefox para fijar la página actual o el destino del enlace actual (si se selecciona un enlace) para el ítem seleccionado en ese momento en Zotero.
    Cómo el apego se procesa depende del método de conexión definido en las preferencias de Zutilo.
    Si el método es "Importar", un adjunto importado se crea de la página / link.
    Si el método es "Preguntar por adjunto enlazado", un sistema de archivo aparece para permitir al usuario especificar un archivo nuevo.
    La página / enlace se guarda en el archivo y a continuación un archivo adjunto vinculado (vinculado al archivo descargado) se crea.
    Si el método es "Preguntar después de la primera", un adjunto importado se crea si el elemento seleccionado no tiene apegos anteriores (sin contar las web páginas instantáneas).
    De lo contrario, el archivo del sistema para la creación de un adjunto enlazado se muestra.
    Si la tecla de mayúsculas se pulsa cuando la función de accesorio está activado, la solicitud de un adjunto enlazado se muestra independientemente de la configuración de preferencia de Zutilo.
    Si la tecla de control se presiona, el adjunto es importado independientemente de la configuración de preferencia Zutilo.

    Si desea crear un atajo de teclado para fijar la página actual al ítem seleccionado en Zotero utilizando el método definido en las preferencias Zutilo, utilice `ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(window.content.location.href)` para el comando.
    La llamada a la función general es `ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(url, processType)`, donde `url` es una cadena con la URL para descargar y processType puede ser 'Zotero', 'prompt', o 'promptAfterOne'.
    Si processType no se especifica o se establece en cualquier otra cosa, el método de conexión definido en las preferencias Zutilo se utiliza.

* __Extraer un ítem de Zotero desde una página web actual con / sin adjuntos:__
    Zutilo añade elementos adicionales al menú contextual del Zotero icono de la barra de direcciones que extraer citas de la página actual con o sin extracción a PDFs y otros archivos de la página asociada.
    Es decir, si el "Añadir automáticamente archivos PDFs y de otros tipos" preferencia está seleccionada en Zotero, Zutilo añade elementos de menú (un punto por cada "Guardar en Zotero" método que se aplica a la página actual) para crear un nuevo elemento de Zotero sin los adjuntos.
    Si la preferencia no está seleccionada, Zutilo añade elementos de menú para crear un nuevo ítem de Zotero con los adjuntos.

    Esta función se activa por cambiando la preferencia de los archivos asociados en Zotero, creando el ítem y, a continuación, cambiando la preferencia a su estado original.
    Porque Zotero traduce páginas de forma asíncrona (y por tanto al mismo tiempo), las traducciones hechas con esta función se debe permitir que termine antes de iniciar las traducciones de página normales con Zotero (pues de lo contrario el estado de la "Archivos asociados" preferencia dependerá del calendario de las traducciones simultáneas) .

    La función en que esta característica se basa es `ZutiloChrome.firefoxOverlay.scrapeThisPage(traductor, filesBool)`.
    Si traductor (un objeto traductor de Zotero) se establece en false o no establecido, el traductor defecto de la página se utiliza.
    Si fileBool es true, el ítem se crea con los adjuntos asociados.
    Si es false, el ítem se crea sin los adjuntos asociados.
    Si filesBool no se especifica, entonces el opuesto de la preferencia de Zotero se utiliza.
    Así que, si en las preferencias de Zotero la "Añadir automáticamente archivos PDFs y de otros tipos" opción está seleccionada, `ZutiloChrome.firefoxOverlay.scrapeThisPage(false)` se creará un elemento utilizando el traductor de página predeterminado sin adjuntar ningún archivo.

### Funciones de Zotero puro ###

Para referencia, aquí hay algunas funciones otras de Zotero que he encontrado que es útil para asignar atajos de teclado:

* __Abrir / cerrar Zotero:__
    Muestra / oculta el panel de Zotero en Firefox.
    (Nombre de la función: `ZoteroOverlay.toggleDisplay()`).
* __Guardar página web como un ítem de Zotero:__
    Guardar la página actual como un ítem de página web en Zotero.
    (Nombre de la función: `ZoteroPane.addItemFromPage()`).
* __Extraer Zotero ítem de una página web:__
    Agrega un ítem a la biblioteca Zotero basado en el contenido de referencia de la página web actual (equivalente a hacer clic en el pequeño página / libro icono en la barra de direcciones de Firefox).
    (Nombre de la función: `Zotero_Browser.scrapeThisPage()`).

### Una nota sobre los archivos adjuntos de Zotero ###

Zutilo ofrece algunas funciones que proporcionan un mayor control sobre la gestión de los adjuntos en Zotero.
Aquí algunos usos posibles de los accesorios Zotero son revisados con el fin de señalar a unas pocas usos posibles de Zutilo.

Zotero ofrece una interfaz de metadatos ricos para organizar y exportar referencias.
También se puede utilizar como un navegador de archivos mejorada por adjuntar archivos a los artículos Zotero.
Esos artículos se pueden recuperar mediante la búsqueda en los campos de la base de datos de Zotero (por ejemplo, autor, título, marcas, publicación, año, etc) de una manera más fina que un sistema de búsqueda de archivos simple.

Zotero soporta dos tipos de adjuntos, adjuntos importados y adjuntos enlazados.
Importados adjuntos se almacenan en el directorio de almacenamiento de Zotero con cada adjunto guardado en una carpeta independiente llamada con una cadena aleatoria de letras y números.
Enlazados adjuntos guardan sólo el enlace a la ubicación de un archivo adjunto en el sistema de archivos (por lo que estos accesorios se pueden guardar en una jerarquía de archivos más susceptibles a la navegación fuera de Zotero).

Base Zotero ofrece un mayor apoyo para los archivos importados que para los adjuntos enlazados.
Con Zotero puro, cuando un nuevo ítem se crea mediante la extracción de información de referencia de una página web, Zotero puede descargar el PDF (u otros archivos asociados) con la referencia de la página web como adjuntos importados automáticamente.
También puede sincronizar datos adjuntos importados a Zotero Server.

[La ZotFile extensión](http://www.columbia.edu/~jpl2136/zotfile.html) proporciona apoyo adicional para los adjuntos enlazados en Zotero.
ZotFile se puede configurar para convertir automáticamente los archivos adjuntos nuevos importados en los archivos adjuntos enlazados y cambiar el nombre y mover los archivos adjuntos a una ubicación de archivos basado en los metadatos del padre adjunto.
Esta característica hace que el mantenimiento de un directorio de archivos adjuntos enlazados sea tan fácil como usar los accesorios importados de Zotero.
ZotFile también puede por lotes cambiar el nombre y mover los archivos existentes de fijación (vinculada o importada) y adjuntar a un ítem de Zotero los archivos modificados más recientemente en la carpeta de descargas de Firefox como renombradaos y enlazados adjuntos.
(ZotFile también tiene funciones para la extracción de anotaciones PDF como elementos de notas de Zotero y para la sincronización de adjuntos en los dispositivos de tableta.)

Con ZotFile, es fácil de crear y mantener una biblioteca de adjuntos enlazados.
Sin embargo, estos archivos no se sincronizarán con Zotero Server.
Desde la versión 4.0, Zotero soporta rutas relativas para los adjuntos enlazados.
Con los adjuntos enlazados guardados como rutas relativas, una biblioteca de un usuario de Zotero se pueden sincronizar través de múltiples máquinas y todos los enlaces de archivos enlazados seguirá trabajando siempre si el directorio base que contiene todos los adjuntos enlazados se copie en cada máquina (como alternativa, los adjuntos pueden ser almacenados en una unidad de red que cada máquina señala como su directorio base).

La función de Zutilo de modificar las rutas puede ayudar con el trabajo con los adjuntos enlazados por modificación por lotes de las trayectorias de todos los adjuntos seleccionados.
Así que si un grupo de archivos adjuntos se mueve a una carpeta nueva, la función de Zutilo de modificar los adjuntos se pueden utilizar para actualizar todos los caminos emparejados a la vez.
Esta función también puede utilizarse para cambiar `/` a `\` en los caminos emparejados al cambiar los sistemas operativos.
La característica de caminos relativos de Zotero 4,0 reemplaza la necesidad de esta función, aunque modificar caminos también pueden ser útiles para las rutas de fijación que no se pueden ser relativas a la razón que sea.
La función de Zutilo de mostrar caminos también es útil para la depuración de los caminos almacenados actualmente en Zotero, especialmente para caminos rotos, de modo que las trayectorias pueden ser modificadas con la modificar caminos función en lugar de ser reenlazados individualmente.

Los funciones de Zutilo para adjuntar páginas y enlaces son útiles para adjuntar adjuntos a los ítems de Zotero que se perdieron cuando el artículo fue creado originalmente o simplemente para colocar elementos adicionales más adelante.
Los adjuntos se creó siguiendo el procedimiento normal, por lo que estas funciones se pueden utilizar para crear adjuntos importados (comportamiento por defecto) o adjuntos enlazados si se establece ZotFile para cambiar los nombres y mover adjuntos nuevos.
Tenga en cuenta que con la opción de Zutilo para "Preguntar por adjunto enlazado" también se activará ZotFile (por lo que es inútil para seleccionar un archivo a través del ventana).
En las preferencias de Zutilo, las funciones de adjuntar enlace / página se puede configurar para que solicite una ubicación de adjuntos sólo cuando un ítem ya tiene otros adjuntos.
Esta preferencia funciona bien con la "Sólo le pido si el artículo tiene otros archivos adjuntos" opción de ZotFile, que permite ZotFile mover / cambiar el nombre del adjunto y luego solicita el Nombre / ubicación de las subsiguientes

A veces, es útil para guardar las referencias a una colección de artículos para su uso futuro, pero es poco probable que los documentos se necesita para ser consultado.
En este caso, lo mejor es guardar los elementos en Zotero sin asociar los archivos de documentos asociados.
Zutilo proporciona funciones para guardar los elementos con o sin archivos adjuntos.
El uso de estas funciones ahorra la molestia de un cambio manual de la "adjuntar archivos PDF y otros archivos asociados" preferencia de Zotero o la borradura manualmente de los adjuntos que no sean necesarios.

### Limitaciones ###

Por el momento, Zutilo funciona con Zotero como un panel del navegador Firefox o ficha independiente y Zotero Standalone.
(En el pasado, algunas funciones no han trabajado con la ficha independiente y Zotero Standalone.
Si algo no parece funcionar con uno de estos modos, trate de usar Zotero como un panel del navegador de Firefox y ver si funciona allí.
Entonces, por favor póngase en contacto conmigo a través de [la Mozilla Add-Ons página de Zutilo](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Mozilla Add-ons página") o [la GitHub página](https://github.com/willsALMANJ/Zutilo "GitHub página")).
Algunas de las características específicas del navegador no están disponibles en Standalone Zotero.

Una advertencia: yo (y varios otros ahora) han estado utilizando Zutilo desde hace un tiempo en mi propia colección Zotero sin problema.
Si estoy alertado a cualquier error, trato de corregirlos lo antes posible.
Dicho esto, por favor, crea una copia de seguridad de sus datos o prueba a cabo funciones de Zutilo sobre un pequeño número de ítems para asegurarse de que funciona de la forma esperada cuando se utiliza por primera vez

Cómo instalar
-------------

### 1. addons.mozilla.org (facíl)

La forma más fácil de instalar Zutilo para Zotero como una extensión de Firefox es a través de [la Mozilla Add-ons página de Zutilo](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Mozilla Zutilo de Add-ons página").
Simplemente navega allí en Firefox y haz clic en el "Añadir a Firefox" botón.
Para Zotero Standalone, usted tendrá que descargar el .xpi archivo e instalarlo manualmente (vee más abajo).

Para obtener el .xpi archivo, vaya a [la Mozilla Add-ons página de Zutilo](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Añadir Zutilo de Mozilla Complementos página").
Si está usando Firefox, en lugar de hacer clic en "Añadir a Firefox" botón, haga clic en el botón con el botón derecho de ratón y elege la opción "Guardar destino como ...." Se abrirá un cuadro de diálogo que le permite guardar el .xpi archivo.
Si usted está usando un navegador web distinto de Firefox, un "Descargar ahora" botón debe ser en el lugar de el "Añadir a Firefox" botón.
Puede hacer clic en él para descargar el .xpi archivo.

Una vez que tenga el .xpi archivo, vaya a Herramientas-\>Add-ons en Firefox o Zotero Standalone.
Haga clic en el botón de artes en la zona superior derecha de la ventana del Administrador de complementos que aparece y elige la opción "Instalar Add-on desde archivo".
A continuación, seleccione el .xpi archivo.

### 2. GitHub

#### Metódo 1: Crear el xpi

Si tiene problemas con la Mozilla Add-ons página, también puede descargar Zutilo de [la Downloads sección de la página Zutilo de GitHub](https://github.com/willsALMANJ/Zutilo/downloads "Zutilo's GitHub página").

1. Haga clic en el "Download as zip" botón allí.
2. Luego descomprima el archivo descargado
3. Zip de nuevo el contenido.
.
4. Cambia la extensión del archivo de "zip" a "xpi".
5. Vaya a Herramientas->Add-ons en Firefox o Zotero Standalone.
6. Haga clic en el botón de artes en la zona superior derecha de la ventana del Administrador de complementos que aparece y elige la opción "Instalar Add-on desde archivo". 
7. Seleccione el .xpi archivo.

#### Metódo 2: Codigo descargado

Si tiene problemas para obtener el .xpi archivo para funcionar con Firefox, hay un método que usted puede intentar.

1. Guarde todos los descomprimidos de los archivos de Zutilo en algún lugar en su computadora donde desea guardar Zutilo.
2. Crea un archivo de texto llamado zutilo@www.wesailatdawn.com.
3. Pon la ruta del directorio a la carpeta de Zutilo como su única línea de texto.
4. Guarde el archivo en la carpeta de extensiones de la carpeta de perfil de Firefox (este método no trabaja con Zotero Standalone).

Este método es útil si desea usar git para tirar de cambios a Zutilo de GitHub (aunque si se utiliza Zutilo en Firefox e instalarlo desde el Mozilla Add-ons Firefox página se actualizará automáticamente actualizaciones de Zutilo desde que sea aprobadas por Mozilla (un poco poco después de que se publiquen en GitHub)).
Alternativamente puede renombrar la carpeta de Zutilo a "zutilo@www.wesailatdawn.com" y moverla en la carpeta de extensiones (este método funciona con Firefox o Zotero Standalone).

Pedir de funciones nuevas y informar sobre bugs
-----------------------------------------------

El último código fuente para Zutilo se mantiene en [GitHub](https://github.com/willsALMANJ/Zutilo "Zutilo's GitHub página").
Los errores (de código o de traducción) pueden ser reportados haciendo clic en la "New Issue" que aparece debajo [la Issues sección](https://github.com/willsALMANJ/Zutilo/issues "GitHub página") de la GitHub sitio.
También puede consultar para ver si hay un error usted experimenta ya ha sido reportado por otro usuario.
Asegúrese de verificar la "Closed" sección para ver si el fallo ya ha sido solucionado.

Peticiones de funciónes nuevos también podrán ser presentadas por la apertura de una nueva Issue.
Por favor, abra una nueva Issue antes de enviar su código.
Una descripción de los tipos de características que son apropiadas para Zutilo se puede encontrar en la [Zutilo wiki](https://github.com/willsALMANJ/Zutilo/wiki) página.
Una hoja de ruta de características planeadas también está disponible en el wiki.

Zutilo está subido al [BabelZilla](www.babelzilla.org) Web Translation System.
Cuando los nuevos locales distintos de Inglés se han completado, que se añadirá a Zutilo.
.
.

Diario de importantes cambios de Zutilo
---------------------------------------

Esta sección no es un registro completo de los cambios en Zutilo.
En él se incluirán todos los cambios importantes en la funcionalidad de Zutilo o características adicionales.
Si algo se rompe en una actualización de Zutilo, intente buscar en esta sección para una explicación.

* In version 1.2.11:

	1. New shortcuts/menu items:
		- Copy Zotero select link
		- Copy Zotero URI
	2. New shortcuts:
		- Focus collections, items pane, and various item pane tabs
		- Attachments: recognize PDF, create parent item, and rename from parent

* En la versión 1.2.5: 

    1. Se añadió atajos teclados a Zutilo y se añadióuna QuickCopy menú ítem.
    2. Un bug que impedía Zutilo se cargue in la Firefox pestaña de Zotero se fijó.
    3. Se añadió una zh-CN locale parcial.

* En la versión 1.2.4, Zutilo fue traducido en Español.

* En la versión 1.2.3, las funciones se han añadido a añadir páginas y enlaces en Firefox para el ítem seleccionado actualmente en Zotero y guardar la página actual en Zotero con adjuntos si la configuración por defecto es salvar sin archivos adjuntos (o ahorrar sin adjuntos si la configuración por defecto es ahorrar con ellos).

* Partir de la versión 1.2.1, Zutilo puede instalarse y desinstalarse sin necesidad de reiniciar Firefox.

* Partir de la versión 1.1.17, los cambios realizados con modifyAttachments siempre debe persistir después de reiniciar Firefox.

* Partir de la versión 1.1.16, con modifyAttachments ahora es posible sustituir los elementos de la ruta que no sean el principio.

* Partir de la versión 1.1.15, modifyAttachments realmente debería trabajar con rutas de Windows.

* Partir de la versión 1.1.11, el principal objeto de JavaScript que Zutilo crea para agregar funcionalidad a Zotero ha cambiado el nombre de "Zotero.Zutilo" a "ZutiloChrome.zoteroOverlay".
Los atajos de teclado llamar a los métodos de este objeto necesitan cambiar los nombres con el fin de seguir trabajando.

Créditos
--------

Zutilo se basa en el formato de extensión Firefox se sugiere en la [XUL School](https://developer.mozilla.org/en-US/docs/XUL_School).
Además, los ejemplos fueron tomados de la documentación de [red de desarrolladores de Mozilla](https://developer.mozilla.org/) y el código fuente de Zotero.
Sus atajos teclados se modelaron en los que se desarrollen en [la Keyconfig extensíon](http://forums.mozillazine.org/viewtopic.php?t=72994).
Ayuda con la traducción proporcionada por Urko de BabelZilla.
