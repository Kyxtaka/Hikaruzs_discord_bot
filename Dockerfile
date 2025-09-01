# Étape 1 : Utiliser une image Node.js officielle
FROM node:20-alpine

# Étape 2 : Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3 : Copier les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier le reste des fichiers du projet
COPY . .

# Étape 6 : Compiler les fichiers TypeScript en JavaScript
RUN npx tsc

# Étape 7 : Exposer le port (si nécessaire, par exemple pour un serveur HTTP)
# EXPOSE 3000

# Étape 8 : Commande pour exécuter le bot
CMD ["node", "./dist/main/index.js"]