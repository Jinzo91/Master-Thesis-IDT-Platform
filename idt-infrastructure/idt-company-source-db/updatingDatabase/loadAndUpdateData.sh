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

echo "combining Tables"
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -i /var/opt/mssql/data/combineTables.sql
echo "Tables combined"

echo "Update old company Table"
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "IDTRocks2019!" -i /var/opt/mssql/data/updateCompanyTable.sql
echo "Update Done. Enrich Companies on Platform to make updates visible."