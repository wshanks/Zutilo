### Pièces jointes

#### Pièces jointes liées (chemins relatifs)

Zotero peut fonctionner soit avec des pièces jointes importées, stockées dans le répertoire "storage" de Zotero et pouvant être synchronisées avec les serveurs de Zotero, soit avec des pièces jointes liées, stockées en tant que chemins vers l'emplacement des fichiers joints dans le  système de fichiers.
Lorsque les pièces jointes sont stockées sous forme de fichiers liés, la fonctionnalité de chemin relatif intégrée à Zotero peut être utile.
Grâce à cette fonctionnalité, un répertoire de base pour les pièces jointes est sélectionné, et toutes les pièces jointes liées sont enregistrées dans ce répertoire avec des chemins relatifs à ce chemin.
Comme ces chemins sont relatifs, vous pouvez aisément déplacer toutes vos pièces jointes vers un nouveau répertoire : il vous suffit de mettre à jour le paramètre de répertoire de base dans Zotero, plutôt que de mettre à jour le chemin de chaque pièce jointe individuelle.
Si vous utilisez plus d'un ordinateur, vous pouvez paramétrer le répertoire de base des pièces jointes pour un emplacement différent sur chaque machine (par exemple, un dossier DropBox ou SyncThing). Vous serez assuré que tous les liens vers les pièces jointes fonctionnent en paramétrant cette préférence pour le bon emplacement sur chaque machine.
Les chemins relatifs des pièces jointes peuvent être configurés sous l'onglet "Fichiers et dossiers" de la section "Avancées" des préférences de Zotero.

#### Organisation des pièces jointes liées (ZotFile)

L'extension [ZotFile](http://www.columbia.edu/~jpl2136/zotfile.html) fournit des fonctionnalités supplémentaires pour les pièces jointes liées dans Zotero.
ZotFile peut être configuré pour convertir automatiquement les nouvelles pièces jointes importées en pièces jointes liées, et pour renommer et déplacer les fichiers joints vers un emplacement de fichier basé sur les métadonnées de leur document parent.
Cette fonctionnalité rend la maintenance d'un répertoire de pièces jointes liées aussi facile que l'utilisation des pièces jointes importées  dans Zotero.
Vous pouvez, par exemple, faire en sorte que ZotFile stocke les pièces jointes dans des répertoires portant le nom de la revue avec un sous-dossier pour l'année de publication, puis nommer le fichier joint en fonction de l'auteur et du titre de l'article.
ZotFile dispose de plusieurs autres fonctionnalités pour travailler avec des pièces jointes, qui méritent d'être étudiées dans sa documentation.

#### Joindre du contenu à un document à partir du navigateur

Zutilo fournit des fonctionnalités permettant de joindre un lien web ou la page web en cours au document en cours de sélection.
Dans les préférences de Zutilo, ces fonctionnalités peuvent être configurées soit pour créer des pièces jointes liées ou importées, soit pour importer la première pièce jointe à un document  et proposer ensuite de lier les fichiers.
Notez que la méthode de Zutilo pour les fichiers liés déclenche ZotFile. Aussi, si ZotFile est configuré pour renommer et déplacer les pièces jointes, il renommera et déplacera celles enregistrées de cette façon, peu importe où vous choisissez de les enregistrer avec l'invite de Zutilo.
ZotFile dispose d'une option "Demander seulement si le doc. a d'autres PJ".
Cette option fonctionne bien avec l'option de Zutilo qui demande l'emplacement des pièces jointes après la première.

### Fonctionnalités de modification des champs d'un document

Zutilo dispose de plusieurs fonctionnalités pour copier et coller les champs d'un document.
Ces fonctionnalités sont destinées à aider la complétion manuelle des métadonnées. Voici quelques cas d'usage.

#### Copier + Coller dans les champs vides : Compléter des notices

Vous avez une série de PDF pour lesquels les métadonnées ne sont pas reconnues automatiquement, comme les chapitres d'un livre.
Vous souhaitez copier un ensemble de métadonnées de la "notice source" vers les "notices cibles", sans écraser les informations déjà disponibles dans les notices cibles.

1. Vous complétez une notice "Chapitre de livre" pour le premier PDF (y compris les éditeurs, le titre du livre, l'année de publication, etc.)

2. Vous utilisez ensuite la fonction "Copier les champs de la notice" pour cette notice, et "Coller dans les champs vides" pour toutes les autres notices.
 Dans ce cas, vous n'avez pas à vous préoccuper des métadonnées existantes dans les notices cibles, car elles ne sont pas écrasées.

Par exemple, si les notices cibles comportent déjà des titres et des auteurs, ces titres sont conservés tandis que les éditeurs, le titre du livre, l'année de publication, etc. sont introduits à partir de la notice source.
Vous pouvez être sûr qu'aucune information des notices cibles n'est perdue. Avec cette option, vous complétez en effet les champs vides de la notice cible par les champs copiés de la notice source.

#### Copier + Remplacer les champs : Rendre conformes des notices

Vous avez une série de PDF pour lesquels les métadonnées ont été reconnues, comme les articles contenus dans un même volume de revue.
Cependant, le nom de la revue et l'année du volume sont incorrects.

1. Créez une nouvelle notice d'article de revue et saisissez les informations requises (nom de la revue et année).

2. Utilisez ensuite la fonction "Copier les champs de la notice" pour cette notice.

3.  Pour les notices cibles, utilisez la fonction "Remplacer les champs". Cela copie tous les champs non-vides de la source vers la cible.

En conséquence, les notices cibles ont maintenant tous le même nom de journal et la même année, indépendamment des paramétrages précédents. Avec cette option, vous remplacez en effet les champs de la notice cible par les champs non-vides copiés de la notice source.

#### Copie des auteurs

"Copier + Coller dans les champs vides", "Copier + Remplacer les champs" et "Copier + Coller tout" se comportent différemment s'agissant de la copie des auteurs.

* "Copier + Coller dans les champs vides" fusionne les auteurs supplémentaires : les auteurs présents dans la source sont conservés et sont ajoutés à ceux de la cible.

*  "Copier + Remplacer les champs" remplace les auteurs : les auteurs présents dans la source remplacent les auteurs présents dans la cible.
En d'autres termes, les auteurs présents dans la cible sont supprimés, et les auteurs de la source sont ajoutés à la cible.

* "Copier + Coller tout" : si le champ auteur dans la source est vide, alors les auteurs dans la cible sont également effacés.

L'option ci-dessus propose plusieurs cas d'usage potentiels, tout en limitant le nombre d'options de collage à trois seulement.
Voici trois exemples qui ne sont pas couverts.

1.  Compléter des notices mais ne pas ajouter d'auteurs.
 Pour ce faire, dupliquez la notice source, supprimez les auteurs, puis effectuez un "Copier + Coller dans les champs vides".

2. Rendre conformes des notices mais ne pas remplacer les auteurs.
 Pour ce faire, dupliquez la notice source, supprimez les auteurs, puis effectuez un "Copier + Remplacer les champs".

3. Rendre conformes des notices mais fusionner les auteurs.
 Pour ce faire, dupliquez la notice source, supprimez les auteurs et effectuez un "Copier + Remplacer les champs".
 Ensuite, copiez la notice source originale et effectuez un "Coller dans les champs vides".

#### Copier + Coller tout : Copier des documents entre plusieurs bibliothèques

Si vous utilisez "Copier + Coller tout" de façon consécutive et sur le même type de document, vous reportez tous les champs sources dans la cible ;  vous dupliquez en quelque sorte le document.
Un cas d'usage pour cela est de synchroniser facilement des documents entre deux bibliothèques.
Vous avez un document avec des métadonnées correctes dans une bibliothèque, mais avec des métadonnées incorrectes dans une autre bibliothèque.
La commande "Copier + Coller tout" copie toutes les métadonnées du document d'une des bibliothèques vers l'autre.
Elle met à jour les champs de la cible à partir de la source.
Elle efface également tous les champs de la cible qui sont vides dans la source. Avec cette option, vous remplacez en effet tous les champs de la notice cible par tous les champs copiés de la notice source.

1. Un document a été copié de la bibliothèque A vers la bibliothèque B.
 Les métadonnées de la bibliothèque A sont ensuite corrigées et doivent maintenant être copiées sur le document cible de la bibliothèque B.

2. Copier le document source dans la bibliothèque A en utilisant "Copier les champs de la notice"

3. Coller tout dans le document cible dans la bibliothèque B en utilisant "Coller tout"

4. Les métadonnées du document cible sont désormais identiques à celles du document source.

Notez que "Copier + Coller tout" est de fait similaire à dupliquer.
Cependant, dans certaines circonstances, il est plus facile de procéder ainsi.

* Par exemple, entre des bibliothèques, vous devriez d'abord dupliquer le document, puis faire glisser le document ainsi créé, puis déplacer les pièces jointes dans la nouvelle bibliothèque.
 La date de création ne serait pas non plus conservée.

* Supposons que vous créez un document, puis que vous le dupliquez.
Vous déplacez tous les PDF vers le duplicat selon les besoins.
Vous remarquez alors une erreur impliquant un champ vide, par exemple déplacer le contenu de "Collection" vers "Titre de la coll.", tout en effaçant la "Collection".
Il vous suffit de corriger la notice originale et d'utiliser la fonction "Coller tout".
Dans la notice cible, le champ  "Collection" est vidé, tandis que le champ "Titre de la coll." est complété.

#### Copier + modifier + Coller tout : Effacer le contenu de certains champs dans un grand nombre de notices

Vous créez une bibliothèque publique B à partir d'une bibliothèque A.
Dans ce processus, vous voulez effacer certains champs d'un ensemble de documents de la bibliothèque B.
Par exemple, vous pouvez souhaiter supprimer pour un ensemble de notice le contenu du champ "Loc. dans l'archive", "Extra", ou similaire.

1. Créez un document vierge (du même type), copiez-le.

2. Modifiez le JSON du presse-papiers pour ne conserver que les champs à effacer, en supprimant tous les autres champs.

3. Utilisez ensuite la fonction "Coller tout" pour effacer ces champs dans les notices.

