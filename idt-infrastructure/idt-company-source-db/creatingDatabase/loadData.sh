echo "create database. Ths might error, if the database already exists, but this error can be ignored"
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -Q "CREATE DATABASE idtCompanySource"
echo "Database created"

echo "creating Name Table"
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -i /var/opt/mssql/data/CreateNameTable.sql
echo "Name table created"

echo "creating Industry Table"
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -i /var/opt/mssql/data/CreateIndustryTable.sql
echo "Industry Table created"

echo "creating Financial Table"
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -i /var/opt/mssql/data/CreateFinancialTable.sql
echo "Financial Table created"

echo "creating Description Table"
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -i /var/opt/mssql/data/CreateDescriptionTable.sql
echo "Description Table created"

echo "creating Address Table"
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -i /var/opt/mssql/data/CreateAddressTable.sql
echo "Address Table created"

echo "Reset company Table. This might produce an error that can be ignored."
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -Q "USE [idtCompanySource]; DROP TABLE company"
echo "company Table deleted"

echo "combining Tables"
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -i /var/opt/mssql/data/combineTables.sql
echo "Tables combined"

echo "create Indices"
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -i /var/opt/mssql/data/createIndices.sql
echo "Indices created"
