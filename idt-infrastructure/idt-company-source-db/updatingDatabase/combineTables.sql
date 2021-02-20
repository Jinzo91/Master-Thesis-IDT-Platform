USE [idtCompanySource]
GO

CREATE TABLE BvDFilteredCompanies (
    BvDID varchar(50) NOT NULL,
    Name varchar(255) NOT NULL,
    PRIMARY KEY (BvDID)
);
GO

WITH joinedTable AS (
    SELECT C.*, F.ClosingDate, F.OperatingRevenue, F.Employees
    FROM BvDCompanies C LEFT JOIN filteredBvDFinancials F ON C.BvDID = F.BvDID
),
maxEmployees AS (
    SELECT CompanyName, MAX(Employees) AS Employees
    FROM joinedTable
    GROUP BY CompanyName
),
maxEmployeesEntry AS (
    SELECT j.*
    FROM joinedTable j INNER JOIN maxEmployees m ON j.CompanyName = m.CompanyName AND (j.Employees = m.Employees OR (m.Employees IS NULL AND j.Employees IS NULL))
),
firstID AS (
    SELECT MIN(BvDID) AS BvDID
    FROM maxEmployeesEntry
    GROUP BY CompanyName
)

INSERT INTO BvDFilteredCompanies
SELECT C.*
FROM BvDCompanies C INNER JOIN firstID I ON C.BvDID = I.BvDID

DROP TABLE BvDCompanies;
GO

CREATE TABLE companyUpdated(
    BvDID varchar(50) NOT NULL UNIQUE,
    Name varchar(255) NOT NULL UNIQUE,
    FullOverview varchar(5000),
    OperatingRevenue BIGINT,
    Employees Integer,
    Street varchar(1020),
    Postcode varchar(50),
    City varchar(255),
    Country varchar(255),
    Website varchar(255),
    NAICSSector varchar(255),
    PRIMARY KEY (BvDID),
);
GO

WITH fullTable AS (SELECT C.BvDID
    ,[Name]
    ,[FullOverview]
    ,[OperatingRevenue]
    ,[Employees]
    ,CONCAT([StreetLine1]
    ,[StreetLine2]
    ,[StreetLine3]
    ,[StreetLine4]) AS Street
    ,[Postcode]
    ,[City]
    ,[Country]
    ,[Website]
    ,[NAICSSector]
FROM BvDFilteredCompanies C
LEFT JOIN BvDOverviews O ON C.BvDID = O.BvDID
LEFT JOIN filteredBvDFinancials F ON C.BvDID = F.BvDID
LEFT JOIN BvDIndustry I ON C.BvDID = I.BvDID
LEFT JOIN BvDAddresses A ON C.BvDID = A.BvDID)

INSERT INTO companyUpdated
SELECT *
FROM fullTable

DROP TABLE BvDAddresses;
DROP TABLE filteredBvDFinancials;
DROP TABLE BvDIndustry
DROP TABLE BvDFilteredCompanies;
DROP TABLE BvDOverviews;
GO

DELETE FROM companyUpdated
WHERE Employees < 10 OR (
    (FullOverview IS NULL OR FullOverview = '')
    AND (OperatingRevenue IS NULL OR OperatingRevenue = 0)
    AND (Employees IS NULL OR Employees = 0)
    AND (Street IS NULL OR Street = '')
    AND (Postcode IS NULL OR Postcode = '')
    AND (City IS NULL OR City = '')
    AND (Website IS NULL OR Website = '')
)
GO