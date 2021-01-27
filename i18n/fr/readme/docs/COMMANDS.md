### Fonctions du menu des documents Zotero
Chacune des fonctions ci-dessous peut être appelée à partir du menu contextuel d'un document Zotero, accessible par un clic-droit dans le volet des documents, le volet central de Zotero où la liste de tous les documents d'une collection est affichée.
Dans les préférences de Zutilo (accessibles depuis le menu "Outils" de Zotero), chacune de ces fonctions peut être configurée pour apparaître dans le menu contextuel de Zotero, dans un sous-menu Zutilo du menu contextuel de Zotero, ou pour ne pas apparaître du tout.

* __Copier les marqueurs :__ 
  A partir d'un clic-droit sur une sélection de documents dans la bibiothèque Zotero, copie les marqueurs de ces documents dans le presse-papiers sous la forme d'une liste délimitée "\r\n". 
  Une telle liste de marqueurs peut être collée dans la boîte d'ajout de marqueurs d'un document, pour ajouter tous les marqueurs d'un seul coup.

* __Retirer les marqueurs :__ 
  A partir d'un clic-droit sur une sélection de documents dans la bibiothèque Zotero, retire à ces documents tous les marqueurs.

* __Coller les marqueurs :__ 
  A partir d'un clic-droit sur une sélection de documents dans la bibiothèque Zotero, colle le contenu du presse-papiers dans ces documents. 
  Le contenu du presse-papiers doit être une liste délimitée par un "\r\n" ou un "\n", comme la liste créée par la fonction de copie des marqueurs décrite ci-dessus.

* __Copier les créateurs :__ 
  A partir d'un clic-droit sur une sélection de documents dans la bibiothèque Zotero, copie les créateurs de ces documents dans le presse-papiers sous la forme d'une liste délimitée "\r\n".

* __Afficher les chemins vers les pièces jointes :__
  Affiche les chemins vers les pièces jointes sélectionnées et vers les pièces jointes aux notices sélectionnées (un par un dans des fenêtres de dialogue séparées -- vous ne sélectionnerez probablement pas plus de deux documents à la fois de cette façon !).

* __Modifier les chemins vers les pièces jointes :__
  Modifie le début du chemin vers toutes les pièces jointes éligibles sélectionnées et vers toutes les pièces jointes des notices sélectionnées. 
  Deux fenêtres de dialogue apparaissent. 
  La première demande l'ancien chemin partiel, tandis que la seconde demande le nouveau chemin partiel. 
  Si vous saisissez "C:/userData/references/" pour le premier chemin et "E:/" pour le second, le chemin d'accès d'un fichier joint ayant pour chemin d'accès "C:/userData/references/journals/Nature/2008/coolPaper.pdf" sera modifié en "E:/journals/Nature/2008/coolPaper.pdf" . Un fichier joint ayant pour chemin d'accès "E:/journals/Science/2010/neatPaper.pdf" restera inchangé. 
  Cette fonction est principalement utile lorsque vous changez d'ordinateur ou de disque dur et que vous brisez les liens vers toutes vos pièces jointes. Notez toutefois que Zotero dispose d'une fonction de chemin d'accès relatif aux pièces jointes qui devrait résoudre ce problème pour les ensembles de pièces jointes stockés tous sous un même répertoire parent.

  Par défaut, l'ancien chemin partiel est comparé seulement avec le début du chemin de chaque pièce jointe.
  Pour remplacer des éléments de chemin de pièces jointes qui ne sont pas au début, cliquez sur la case à cocher "Remplacer toutes les instances du chemin partiel" dans la première fenêtre de dialogue.
  Cette option est utile si vous souhaitez renommer un sous-dossier ou passer d'un chemin de style Windows à un chemin de style Unix (en remplaçant "\" et "/").

* __Modifier l'URL des pièces jointes :__ 
  Cette fonction se comporte de la même manière que la fonction "Modifier les chemins vers les pièces jointes" ci-dessus, mais modifie l'URL des pièces jointes au lieu du chemin de fichier vers les pièces jointes liées.

* __Copier les chemins vers les pièces jointes :__
  Copie dans le presse-papiers le chemin vers chaque pièce jointe sélectionnée et/ou vers chaque pièce jointe enfant de chaque élément sélectionné. 
  Pour les pièces jointes sous forme de fichier, le chemin complet dans le système de fichiers est copié.
  Les pièces jointes avec des liens URL sont ignorées.

* __Associer les documents :__ 
  Etablit des liens de "Document connexe" entre tous les documents sélectionnés.

* __Copie rapide des documents :__ 
  Copie dans le presse-papiers les documents sélectionnés en utilisant le "Format par défaut" spécifié dans l'onglet "Exportation" des préférences de Zotero. 
  Il est également possible de définir d'autres paramétrages de copie rapide. 
  Par défaut, deux de ces paramétrages sont activés, intitulés "alt 1" et "alt 2". 
  Des paramétrages supplémentaires peuvent être activés en modifiant la préférence `extensions.zutilo.copyItems_alt_total` dans l'éditeur de configuration. 
  Les documents seront copiés dans le presse-papiers en utilisant d'autres convertisseurs d'export. 
  Pour sélectionner les convertisseurs utilisés par ces fonctions, les préférences correspondantes `extensions.zutilo.quickcopy_alt1`, `extensions.zutilo.quickcopy_alt2`, etc. doivent être définies dans l'éditeur de configuration. 
  Chaque préférence doit être réglée sur ce qui apparaît dans l'éditeur de configuration pour la préférence `export.quickCopy.setting` lorsque le convertisseurs souhaité est défini comme le "Format par défaut" dans les préférences de Zotero. 
  L'éditeur de configuration peut être ouvert à partir de l'onglet "Avancées" de la fenêtre des préférences de Zotero.

* __Copier les liens zotero://… des documents :__ 
  Copie dans le presse-papiers les liens sous la forme "zotero://select/library/items/ITEM_ID" pour chaque document sélectionné. 
  Suivre des liens depuis d'autres applications peut sélectionner des documents dans le client Zotero, mais cela peut nécessiter une configuration supplémentaire.

* __Copier les liens zotero.org/… des documents :__
  Copie dans le presse-papiers les liens (www.zotero.org) pour chaque document sélectionné. 
  Si vous avez un profil (www.zotero.org), suivre un tel lien ouvrira la page du document correspondant dans le profil sur (www.zotero.org). 
  Si vous n'avez pas de profil (www.zotero.org), un lien de remplacement est toujours généré mais cela peut s'avérer inutile.

* __Ouvrir les liens zotero://… des documents :__ 
  Ouvre les liens (www.zotero.org) pour chaque document sélectionné. 
  Voir la description de "Copier les liens zotero.org/… des documents"

* __Créer une notice "Chapitre de livre" :__ 
  Crée une notice de chapitre de livre à partir de la notice de livre sélectionnée.

  La nouvelle notice est créée en dupliquant la notice de livre et en changeant son type en "Chapitre de livre". 
  Les entrées d'auteur de la notice de livre sont converties en entrées "auteur de livre" dans la nouvelle notice de chapitre de livre. 
  La nouvelle notice de chapitre de livre est ajoutée en tant que document connexe à la notice de livre originale. 
  Enfin, le curseur est positionné dans la zone de texte du champ "Titre" de la nouvelle notice, de manière à ce qu'un nouveau titre pour le chapitre de livre puisse être saisi.

  Cette fonction n'est effective que lorsqu'une seule notice de livre est sélectionnée. 
  Notez que certains champs (nombre de pages et titre court, à partir de fin 2014) ne s'appliquent qu'aux notices de livre et non aux notices de chapitre de livre.
  Il n'y a pas de boîte de dialogue pour confirmer la perte de ces champs à partir de la notice de chapitre de livre créée.

* __Créer une notice "Livre" :__ 
  Crée une notice de livre à partir de la notice de chapitre de livre sélectionnée.

  La notice de chapitre de livre est d'abord dupliquée et convertie en une notice de livre. 
  Ensuite, le "Titre du livre" de la notice de chapitre de livre est utilisé comme titre pour cette nouvelle notice et le résumé est supprimé. 
  La nouvelle notice de livre est liée en tant que document connexe à la notice de chapitre de livre.
  Enfin, le champ "Titre" de la nouvelle notice est sélectionné, de manière à ce que le titre du livre puisse être modifié.

* __Copier les documents enfants :__ 
  Copie dans un presse-papiers interne de Zutilo (et non dans le presse-papiers du bureau) les documents enfants d'un document sélectionné. 
  Cette fonction est conçue pour être utilisée conjointement avec la fonction "Déplacer les documents enfants".

* __Déplacer les documents enfants :__ 
  Déplace tous les documents stockés dans le presse-papiers interne de Zutilo par la fonction "Copier les documents enfants" vers le document sélectionné.

* __Copier les champs de la notice :__ 
  Copie dans le presse-papiers tous les champs de métadonnées d'une notice source. 
  Les données copiées sont toutes les données visibles dans le volet du document Zotero uniquement (pas les marqueurs ni les notes).

* __Coller dans les champs vides  :__ 
  (Compléter les champs vides de la notice par les champs copiés) Colle les champs de la source si les champs de la cible sont vides. 
  Les auteurs sont fusionnés : les auteurs de la source sont ajoutés, même si la cible a déjà des auteurs.

* __Remplacer les champs :__ 
  (Remplacer les champs de la notice par les champs non-vides copiés) Colle les champs de la source qui ont une valeur. 
  Les auteurs sont remplacés dans la cible s'il y a un champ auteur dans les données sources collées.

* __Coller tout :__ 
  (Remplacer tous les champs de la notice par tous les champs copiés) Colle tous les champs de la source, même s'ils sont vides.
  
  Pour modifier seulement certains champs, sélectionnez une notice source et utilisez "Copier les champs de la notice".
  Collez dans un éditeur de texte, modifiez le texte JSON, puis recopiez le texte modifié dans le presse-papiers.
  Enfin, sélectionnez les notices cibles et utilisez "Coller tout".
  La paire nom/valeur `itemType` doit être conservée dans le texte JSON car Zutilo utilise sa présence pour décider d'utiliser les commandes JSON de collage dans le menu contextuel ; sa valeur n'est pas pertinente pour cette fonction.
  Vous pouvez, par exemple, effacer le champ URL dans plusieurs notices en collant `{"itemType" : "book", "url" : ""}`, ce qui ne modifiera pas le type de document dans les notices cibles sélectionnées.

* __Coller le type de document :__
  (Remplacer le type de document de la notice par le type de document de la notice copiée) Colle le type de document de la notice source dans les notices cibles.
  Cela ne change pas la valeur des autres champs dans les notices cibles.
  Cependant, changer le type d'un document Zotero modifie la liste des champs valides.
  Il est important de réaliser que les données saisies dans des champs non valides pour le type de document cible seront perdues !

### Fonctions du menu des collections Zotero
Chacune des fonctions ci-dessous peut être appelée à partir du menu contextuel de la collection Zotero, accessible par un clic droit sur une collection dans le volet des collections, le volet de gauche de Zotero où la liste de toutes les collections est affichée.
Dans les préférences de Zutilo (accessibles depuis le menu "Outils de Zotero"), chacune de ces fonctions peut être configurée pour apparaître dans le menu contextuel de Zotero, dans un sous-menu Zutilo du menu contextuel de Zotero, ou pour ne pas apparaître du tout.

* __Copier le lien zotero://… de la collection :__ 
  Copie dans le presse-papiers le lien de la collection sélectionnée sous la forme "zotero://select/library/collections/ITEM_ID". 
  Suivre des liens depuis d'autres applications peut sélectionner la collection dans le client Zotero, mais cela peut nécessiter une configuration supplémentaire.

* __Copier le lien zotero.org/…de la collection :__
  Copie dans le presse-papiers le lien (www.zotero.org) de la collection sélectionnée. 
  Si vous avez un profil (www.zotero.org), suivre un tel lien ouvrira la page du document correspondant dans le profil sur (www.zotero.org). 
  Si vous n'avez pas de profil (www.zotero.org), un lien de remplacement est toujours généré mais cela peut s'avérer inutile.

### Navigation dans l'interface utilisateur et modification de documents via des raccourcis clavier

Zutilo met actuellement en place plusieurs raccourcis clavier utiles pour modifier les éléments Zotero. 
Les fonctions suivantes sont effectives lorsqu'un seul document Zotero est sélectionné.

* __Modifier Info :__ 
  Sélectionne l'onglet "Info" dans le volet du document.
  Le curseur est positionné sur le premier champ modifiable du document.

* __Ajouter une note :__ 
  Sélectionne l'onglet "Notes" dans le volet du document. 
  Crée une nouvelle note. 
  Ajouté pour être complet, mais Zotero a déjà un raccourci clavier pour cela. 
  Il peut être défini dans les préférences de Zotero.

* __Ajouter un marqueur :__ 
  Sélectionne l'onglet "Marqueurs" du volet du document.
  Ouvre une zone de texte pour créer un nouveau marqueur.

* __Ajouter un document connexe :__ 
  Sélectionne l'onglet "Connexe" du volet du document.
  Ouvre la boîte de dialogue pour ajouter des documents liés.

Les quatre fonctions suivantes sont similaires aux quatre fonctions d'édition des documents ci-dessus, excepté le fait qu'elles se concentrent sur l'onglet correspondant dans le volet du document.

* __Curseur dans le volet du document : onglet Info :__
  Sélectionne l'onglet "Info" dans le volet du document.

* __Curseur dans le volet du document : onglet Notes :__ 
  Sélectionne l'onglet "Notes" dans le volet du document.

* __Curseur dans le volet du document : onglet Marqueurs :__ 
  Sélectionne l'onglet "Marqueurs" du volet du document.

* __Curseur dans le volet du document : onglet Connexe :__ 
  Sélectionne l'onglet "Connexe" du volet du document.

Les deux fonctions suivantes vous permettent de faire défiler les quatre mêmes onglets dans le volet du document.

* __Curseur dans le volet du document : onglet suivant :__ 
  Sélectionne l'onglet suivant dans le volet du document.

* __Curseur dans le volet du document : onglet précédent :__ 
  Sélectionne l'onglet précédent dans le volet du document.

Zutilo dispose de plusieurs raccourcis clavier utiles pour naviguer entre et dans les trois volets principaux.
Si le volet concerné est masqué, les fonctions suivantes l'affichent.

* __Curseur dans le volet des collections :__ 
  Positionne le curseur dans le volet des collections (volet de gauche, volet des bibliothèques). 
  Similaire au raccourci Zotero existant, sauf que cette fonction affiche le volet également s'il est caché.

* __Curseur dans le volet des documents :__ 
  Positionne le curseur dans le volet des documents (volet central).

Les deux fonctions suivantes vous permettent d'afficher ou de masquer facilement le volet des collections (volet de gauche) et le volet du document (volet de droite).

* __Volet du document : afficher / cacher :__ 
  Affiche ou cache le volet du document.

* __Volet des collections : afficher / cacher :__
  Affiche ou cache le volet des collections.

Comme les fonctions ci-dessus, les deux fonctions suivantes vous permettent d'afficher ou de masquer facilement le volet des collections (volet de gauche) et le volet du document (volet de droite).
Toutefois, lorsque le volet est affiché, le séparateur vertical plus épais (ou diviseur, qui apparaît lorsque le volet est caché) reste visible jusqu'à ce que la largeur du volet soit ajustée.

* __Volet du document : afficher / cacher (avec diviseur) :__ 
  Affiche ou cache le volet du document. 
  Lorsque le volet est affiché, le séparateur vertical plus épais reste visible jusqu'à ce que la largeur du volet soit ajustée.

* __Volet des collections : Afficher / Cacher (avec diviseur) :__ 
  Affiche ou cache le volet des collections. 
  Lorsque le volet est affiché, le séparateur vertical plus épais reste visible jusqu'à ce que la largeur du volet soit ajustée.

### Fonctions des pièces jointes

* __Joindre un lien vers un fichier :__ 
  Ouvre une boîte de dialogue de sélection de fichier pour choisir un fichier à joindre en tant que fichier lié au document sélectionné.

* __Joindre un lien vers un URI :__ 
  Ouvre une boîte de dialogue de texte pour joindre au document sélectionné un lien vers un URI.

* __Joindre une copie enregistrée d'un fichier :__
  Ouvre une boîte de dialogue de sélection de fichier pour choisir un fichier à joindre en tant que fichier importé au document sélectionné.

* __Créer un document parent :__ 
  Crée un document parent pour le document de type pièce jointe sélectionné qui n'a pas de parent.

* __Find available PDFs:__
    Find available PDFs for selected items.

* __Renommer les fichiers à partir des métadonnées du parent :__ 
  Utilise les métadonnées du document parent pour renommer ses pièces jointes.

* __Récupérer les métadonnées des PDF :__ 
  Essaye de rechercher les métadonnées de la pièce jointe en tant que fichier importé au format PDF.

### Fonctions diverses

* __Dupliquer le document :__ 
  Crée un duplicat du document sélectionné.

* __Établir un rapport :__ 
  Génére un rapport Zotero à partir d'une sélection de documents ou d'une collection. 
Si le curseur est positionné dans le volet des collections, le rapport est généré pour la collection sélectionnée. 
Sinon, le rapport est généré pour les documents sélectionnés.

* __Ouvrir le menu "Nouveau document" :__ 
  Ouvre le menu "Nouveau document" afin de pouvoir sélectionner le type du nouveau document à créer.
* __Ouvrir l'Éditeur de style :__ 
  Ouvre la fenêtre de l'éditeur de style, normalement accessible depuis l'onglet "Citer" des préférences de Zotero.

* __Localiser avec Google Scholar :__ 
  Cela équivaut à utiliser l'un des moteurs de recherche du menu de localisation accessible en haut du volet du document. 
  Le moteur par défaut est "Google Scholar Search". 
  Pour changer le moteur, modifiez la préférence `extensions.zutilo.locateItemEngine` dans l'éditeur de configuration. 
  L'éditeur de configuration peut être ouvert à partir de l'onglet "Avancées" de la fenêtre des préférences de Zotero. 
  Pour obtenir une liste des moteurs installés dans votre client Zotero, sélectionnez "Développeur->Run JavaScript" dans le menu "Outils" de Zotero, puis entrez et exécutez cette commande : `Zotero.LocateManager.getVisibleEngines().map(engine => engine.name)`.

### Fonctions de Better BibTeX

Les fonctions suivantes sont disponibles seulement lorsque [Better BibTeX](https://github.com/retorquere/zotero-better-bibtex) est installé.

* __Verrouiller la clé de citation :__ Verrouille la clé pour les documents sélectionnés.

* __Déverrouiller la clé de citation :__ Déverrouille la clé pour les documents sélectionnés.

* __Rafraîchir la clé de citation :__ Force à rafraîchir la clé pour les documents sélectionnés.

* __Pousser les références vers TeXstudio :__ Pousse les références vers TeXstudio.

### Fonctions de ZotFile

Les fonctions suivantes sont disponibles seulement lorsque [ZotFile](zotfile.com) est installé.

* __ZotFile : joindre un nouveau fichier :__ Attache au document sélectionné le fichier le plus récent dans le répertoire source de ZotFile.

* __ZotFile : déplacer et renommer les pièces jointes :__ Déplace et renomme les fichiers associés aux pièces jointes sélectionnées pour suivre le format configuré dans les préférences de ZotFile.

* __Extract annotations:__ Trigger ZotFile's "Extract Annotations" function.
