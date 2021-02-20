USE [idtCompanySource]
GO

CREATE TABLE BvDCompanies (
    BvDID varchar(255) NOT NULL,
    CompanyName varchar(255) NOT NULL,
    PRIMARY KEY (BvDID)
);
GO

BULK INSERT dbo.BvDCompanies
FROM N'/var/opt/mssql/data/BvD_ID_and_Name.txt'
WITH (
    BATCHSIZE = 0,
    FIELDTERMINATOR = '\t',
    ROWTERMINATOR = '\n',
    FIRSTROW = 2
    ,LASTROW = 50000
)