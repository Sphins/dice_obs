# Dice OBS Overlay (Foundry VTT v13)

Module Foundry VTT v13 pour diffuser les jets de dés dans une page d'overlay HTML/CSS dédiée à OBS, sans dépendances externes.

## Installation

1. Créez un dossier dans `Data/modules/dice-obs-overlay`.
2. Copiez-y les fichiers suivants :
   - `module.json`
   - `main.js`
   - `overlay.html`
   - `overlay.css`
3. Redémarrez votre instance Foundry si le module n'apparaît pas.
4. Activez **Dice OBS Overlay** dans le monde Foundry.

## URL OBS à utiliser

```
https://<VOTRE_DOMAINE_FOUNDRY>/modules/dice-obs-overlay/overlay.html
```

Sur Molten Hosting, remplacez `<VOTRE_DOMAINE_FOUNDRY>` par l'URL fournie par Molten.

## Conseils OBS

- Source Navigateur : définissez une taille de base cohérente avec votre scène (ex : 1920x1080).
- Transparence : l'overlay utilise un fond transparent.
- FPS : 30 fps suffisent pour des pop-ups simples.
- Si le rendu paraît flou, ajustez la largeur dans les réglages du module.

## Configuration

Dans **Paramètres du module** :

- Durée d'affichage (ms)
- Nombre max de pop-ups visibles
- Position X/Y
- Largeur
- Ignorer les jets du MJ
- Ignorer les whispers
- Filtrage whitelist/blacklist (noms séparés par des virgules)

## Fonctionnement

- Le module écoute `createChatMessage` et filtre uniquement les messages contenant des jets.
- Chaque jet déclenche une émission socket `module.dice-obs-overlay`.
- L'overlay se connecte via Socket.IO et affiche les pop-ups en file d'attente (max configurable).

## Déploiement sur Molten Hosting

Workflow recommandé :

1. Uploadez le dossier du module via le file manager ou WebDAV.
2. Vérifiez la présence du dossier `dice-obs-overlay` et du fichier `module.json`.
3. Redémarrez l'instance si le module n'apparaît pas immédiatement.
4. Activez le module dans le monde Foundry.

### Checklist de troubleshooting

- [ ] Dossier présent dans `Data/modules/dice-obs-overlay`
- [ ] `module.json` valide et compatible Foundry v13
- [ ] Instance redémarrée si le module n'apparaît pas
- [ ] Module activé dans le monde

## Checklist de test

### Local

- Lancer Foundry v13.
- Activer le module dans un monde.
- Faire un jet (ex : `/roll 1d20`).
- Ouvrir l'URL `modules/dice-obs-overlay/overlay.html` dans un navigateur.
- Vérifier l'apparition des pop-ups.

### Molten

- Activer le module dans le monde Molten.
- Configurer la Source Navigateur OBS avec l'URL de l'overlay.
- Lancer un jet dans Foundry et vérifier l'affichage.

## Améliorations possibles

- Animations CSS supplémentaires (glow, slide, scale).
- Thèmes (clair/sombre) via CSS variables.
- Filtrage avancé (par type de jet, par système).
- Support multi-systèmes via parsers dédiés.
- Option de stack horizontal ou vertical.
