FROM node:16

ENV APP_HOME /app

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY . $APP_HOME%

RUN npm install -g nodemon

EXPOSE 3001

CMD ["sh", "start.sh"]
