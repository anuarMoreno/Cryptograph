# Imagen Node base
FROM node:latest

# Directorio de Trabajo
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto 80 que usa la pagina Web
EXPOSE 80

# Comando para iniciar la aplicación
CMD [ "npm", "start" ]