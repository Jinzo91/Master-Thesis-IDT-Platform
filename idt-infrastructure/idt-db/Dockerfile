FROM microsoft/mssql-server-linux:2017-latest

# Create app directory
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app

# RUN npm install

# Bundle app source
# COPY . /usr/src/app

# RUN npm run start
ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=IDTRocks2019!

# RUN /opt/mssql/bin/sqlservr & sleep 30s & /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -Q "CREATE DATABASE idt"


# Grant permissions for the import-data script to be executable

CMD /opt/mssql/bin/sqlservr

RUN /opt/mssql/bin/sqlservr & sleep 15s & /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -Q "CREATE DATABASE idt"


# RUN sleep 30s

# CMD /opt/mssql/bin/sqlservr && sqlcmd -i setup.sql && .\start -sa_password $env:sa_password \
# -ACCEPT_EULA $env:ACCEPT_EULA -Verbose