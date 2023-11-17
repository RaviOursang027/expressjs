FROM node:16.20.0-alpine
ENV GENERATE_SOURCEMAP=false
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
ENV NODE-ENV production
ENV PORT 3000
CMD ["npm", "start"]
