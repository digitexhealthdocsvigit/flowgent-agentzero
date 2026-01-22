FROM node:18-bullseye
RUN curl -fsSL https://ollama.com/install.sh | bash
WORKDIR /app
COPY . .
RUN npm install
ENV OLLAMA_MODEL=mistral
ENV OLLAMA_API_URL=http://localhost:11434
EXPOSE 11434
CMD ["bash", "-c", "ollama serve & sleep 10 && node agent.js"]
