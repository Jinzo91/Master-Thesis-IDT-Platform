## Source: https://github.com/Microsoft/mssql-docker/blob/master/linux/preview/examples/mssql-agent-fts-ha-tools/Dockerfile


# Base OS layer: Latest Ubuntu LTS
FROM ubuntu:16.04

ENV ACCEPT_EULA=Y

# Install prerequistes since it is needed to get repo config for SQL server
RUN export DEBIAN_FRONTEND=noninteractive && \
    apt-get update -y && \
    apt-get install -y apt-utils && \
    apt-get install -yq curl apt-transport-https && \
    # Get official Microsoft repository configuration
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/ubuntu/16.04/mssql-server-2017.list | tee /etc/apt/sources.list.d/mssql-server.list && \
    #Get sqlcmd
    curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list | tee /etc/apt/sources.list.d/msprod.list && \
    apt-get update && \
    # Install SQL Server from apt
    apt-get install -y mssql-server && \
    # Install optional packages
    apt-get install -y mssql-server-ha && \
    apt-get install -y mssql-server-fts && \
    #install mssql-tools
    apt-get install -y mssql-tools unixodbc-dev && \
    # Cleanup the Dockerfile
    apt-get clean && \
    rm -rf /var/lib/apt/lists

ENV SA_PASSWORD=IDTRocks2019!

CMD /opt/mssql/bin/sqlservr

# RUN /opt/mssql/bin/sqlservr & sleep 15s & /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -Q "CREATE DATABASE idtCompanySource"


