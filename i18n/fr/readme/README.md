# Zutilo

Zutilo est un module complémentaire pour [Zotero](http://www.zotero.org/).
Par le biais d'options de menu supplémentaires et de raccourcis clavier, Zutilo ajoute des fonctions non disponibles en standard dans Zotero. Voici quelques-unes des fonctionnalités de Zutilo.

* Copier, coller et retirer des ensembles de marqueurs.
* Créer des liens de "Connexe" entre les documents sélectionnés grâce à un clic-droit avec le bouton de la souris.
* Copier dans le presse-papiers des documents dans plusieurs formats différents.
* Modifier des documents, définir l'emplacement du curseur et masquer différents éléments de l'interface utilisateur Zotero grâce à des raccourcis clavier.

Zutilo s'efforce de réaliser tous vos souhaits en termes de flux de travail Zotero, et de rester à l'écart autrement. Tous les éléments graphiques de Zutilo peuvent être désactivés individuellement, de sorte que les fonctionnalités indésirables n'encombrent pas l'interface utilisateur.


**NOTE :** À partir de la version 3.0, Zutilo est distribué à partir de la [page des versions GitHub](https://github.com/wshanks/Zutilo/releases).
Les nouvelles mises à jour ne seront pas publiées à l'emplacement vérifié par les versions précédentes de Zutilo (la page des modules complémentaires de Mozilla).
Pour recevoir les nouvelles mises à jour de Zutilo, veuillez effectuer une mise à jour vers la dernière version de Zutilo.


## Installation

Télécharger le fichier `zutilo.xpi` de Zutilo à partir de [la page des versions GitHub de Zutilo](https://github.com/wshanks/Zutilo/releases).
Dans Zotero, aller dans le menu _Outils_ → _Extensions_.
Cliquer sur la roue dentée et choisir _Install Add-on From File_.
Sélectionner et charger le fichier `zutilo.xpi`.


**NOTE pour les utilisateurs de Firefox:** Firefox considère les fichiers `.xpi` comme des modules complémentaires de Firefox et essaie de les installer.
Plutôt que de cliquer sur le fichier `.xpi`, il est préférable de faire un clic droit et de choisir _Enregistrer la cible du lien sous..._
Dans certains cas (notamment sous Linux), Firefox ne permet pas non plus de cliquer avec le bouton droit de la souris et d'enregistrer le lien `.xpi`.
Dans ce cas, vous devez télécharger le fichier`.xpi` soit avec un autre navigateur, soit avec un outil en ligne de commande comme `curl` ou `wget`.

## Démarrer

Une fois Zutilo installé, il peut être personnalisé via sa fenêtre de préférences, accessible à partir du gestionnaire de modules complémentaires de Zotero ou à partir du menu _Outils_ >_Préférences de Zutilo..._

### Le menu Zutilo dans Zotero

Par défaut, Zutilo ajoute un ensemble d'options de menu dans un sous-menu `Zutilo` du menu contextuel d'un document Zotero, affiché par un clic droit sur un document.
Les options qui apparaissent peuvent être définies dans la fenêtre des préférences de Zutilo.
Les options peuvent être configurées pour apparaître dans le sous-menu Zutilo ou directement dans le menu contextuel d'un document Zotero.
Toutes les fonctions disponibles ne sont pas visibles par défaut dans le sous-menu de Zutilo .


### Raccourcis clavier

Toutes les fonctions qui peuvent apparaître dans le menu contextuel d'un document Zotero peuvent également être appelées par des raccourcis clavier.
Zutilo propose également quelques fonctions supplémentaires de raccourcis clavier qui ne sont pas disponibles depuis le menu le menu contextuel d'un document Zotero.
Par défaut, aucun raccourci clavier n'est défini.
Une combinaison de touches de raccourci peut être définie pour chaque fonction dans les préférences de Zutilo.
Si la combinaison de touches est déjà affectée à une autre fonction, un avertissement s'affiche.

## Notes d'utilisation

Pour des notes d'utilisation supplémentaires, voir [USAGE](docs/USAGE.md).

## Liste des commandes

Pour une liste détaillée des commandes de Zutilo, voir la [liste des commandes](docs/COMMANDS.md).

## Support

Pour les recommandations concernant les rapports de bogues, les demandes de fonctionnalités et l'aide à la traduction, veuillez consulter la [page de commentaires](docs/BUGS.md).

## Développement

Pour des notes sur le travail avec le code Zutilo, veuillez consulter le [document de construction](docs/DEVELOPERS.md).

## Crédits

Pour une liste des remerciements, veuillez consulter la [page des auteurs](AUTHORS.md).

## Changements

Pour un récapitulatif des changements par numéro de version, veuillez consulter [l'historique des versions](CHANGELOG.md).

## Comment contribuer

1. Étoilez le dépôt sur GitHub. Le nombre d'étoiles sur GitHub est l'une des mesures les plus visibles pour évaluer le niveau d'intérêt pour un projet.
2. Encouragez les autres à utiliser le projet, soit directement, soit en écrivant un article de blog. Outre les étoiles sur GitHub, l'autre indicateur de l'intérêt pour un projet est le nombre total de téléchargements du fichier xpi.
3. Soumettez de nouvelles fonctionnalités ou traductions. Toutefois, n'oubliez pas que les nouvelles fonctionnalités alourdissent la charge de maintenance du projet. Aussi prenez ontact avec nous avant de consacrer beaucoup de temps à une nouvelle fonctionnalité.
