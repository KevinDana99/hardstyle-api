# 1. Usamos la imagen que ya tiene TODO lo de Playwright
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

# 2. Carpeta de trabajo
WORKDIR /app

# 3. Copiamos los archivos de dependencias
COPY package.json yarn.lock ./

# 4. Instalamos todo (Yarn ya viene en esta imagen)
# Cambiá la línea 11 por esta:
RUN yarn install --ignore-engines

# 5. Copiamos el resto del código
COPY . .

# 6. Compilamos el TypeScript a JavaScript
RUN yarn tsc

# 7. Render te asigna un puerto, pero nosotros avisamos que usamos el 3001 por defecto
EXPOSE 3001

# 8. Arrancamos el servidor
CMD ["node", "dist/index.js"]