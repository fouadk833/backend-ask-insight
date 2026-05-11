# Usa Node.js como base
FROM node:18

# Define el directorio de trabajo
WORKDIR /app

# Copia el certificado y actualiza la lista de certificados del sistema
COPY sanofi-ca.crt /usr/local/share/ca-certificates/sanofi-ca.crt
RUN update-ca-certificates

# Configura las variables de entorno para que Node.js y otras herramientas lo reconozcan
ENV NODE_EXTRA_CA_CERTS="/usr/local/share/ca-certificates/sanofi-ca.crt"

# Copia los archivos de dependencias e instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto en el que corre NestJS
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]
