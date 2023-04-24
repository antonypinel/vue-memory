
# Vue Memory

L'objectif de ce projet était de concevoir et développer une application de mémorisation basée sur la répétition espacée en utilisant Vue 3, vue-router et Pinia. Nous avons également décidé d'utiliser Tailwind en tant que framework CSS.

Le principe de la répétition espacée est détaillé ici :
https://ncase.me/remember/fr.html

## Auteurs

- [Antony PINEL](https://www.github.com/antonypinel)
- [Jonathan JAREMCZUK](https://www.github.com/Orion009)


## Architecture

```
src/               
├── views/                  
│   ├── Categories.vue          
│   ├── Themes.vue              
│   ├── Cards.vue               
│   └── Revision.vue            
├── router/                     
│   └── index.js 
├── stores/         
│   └── store.js        
├── App.vue                     
└── main.js 
```

## Fonctionnalités

- L'application permet de réviser des thèmes.
- Les thèmes contiennent des cartes de révision avec recto et verso (texte et/ou élément multimédia).
- Les thèmes peuvent être regroupés par catégorie créée par l'utilisateur.
- L'utilisateur peut créer des thèmes et des cartes de révision pour chaque thème.
- L'utilisateur peut choisir le nombre de niveaux et de nouvelles cartes vues chaque jour pour chaque thème.
- La révision commence par le niveau le plus haut avec le nombre de nouvelles cartes choisies, puis niveau 1.
- L'application peut configurer un rappel quotidien si l'utilisateur accepte les notifications du navigateur.
- L'application est responsive et fonctionne hors-ligne.


## Tester le projet en local

Cloner le projet :

```bash
  git clone https://link-to-project
```

Aller au dossier contenant le projet :

```bash
  cd my-project
```

Installer les dépendances :

```bash
  npm install
```

Démarrer le serveur local :

```bash
  npm run dev
```

Tester le projet en mode "build" :

```bash
  npm run build & npx http-server dist
```
