# Usa imagem oficial do Node.js
FROM node:18

# Cria e define a pasta do app no container
WORKDIR /app

# Copia os arquivos do projeto pro container
COPY . .

# Instala as dependências
RUN npm install

# Expõe a porta usada pela API
EXPOSE 3000

# Inicia o app
CMD ["npm", "start"]
