USE [idtCompanySource]
GO

-- creates the table
CREATE TABLE BvDAddresses (
    BvDID varchar(50) NOT NULL,
    NameInternat varchar(255),
    NameNative varchar(255),
    StreetLine1 varchar(255),
    StreetLine11 varchar(255),
    StreetLine2 varchar(255),
    StreetLine21 varchar(255),
    StreetLine3 varchar(255),
    StreetLine31 varchar(255),
    StreetLine4 varchar(255),
    StreetLine41 varchar(255),
    Postcode varchar(50),
    City varchar(255),
    City1 varchar(255),
    Country varchar(255),
    CountryCode varchar(5),
    MetropolitanArea varchar(255),
    USState varchar(255),
    County varchar(255),
    Telephone varchar(255),
    Fax varchar(255),
    Website varchar(255),
    EMail varchar(255),
    Region varchar(255),
    RegionType varchar(255),
    NUTS1 varchar(255),
    NUTS2 varchar(255),
    NUTS3 varchar(255),
    PRIMARY KEY (BvDID)
);
GO

-- inserts raw data from txt file
BULK INSERT dbo.BvDAddresses
FROM N'/var/opt/mssql/data/Contact_info.txt'
WITH (
    BATCHSIZE = 1000000,
    FIELDTERMINATOR = '\t',
    ROWTERMINATOR = '\n',
    MAXERRORS = 1000000, -- set to batchsize
    FIRSTROW = 2 -- because first row is title
    ,LASTROW = 50000
);
GO

ALTER TABLE BvDAddresses
DROP COLUMN NameInternat, NameNative, StreetLine11, StreetLine21, StreetLine31, StreetLine41, City1, CountryCode, MetropolitanArea, USState, County, Telephone, Fax, EMail, Region, RegionType, NUTS1, NUTS2, NUTS3

/*
-- filters entries (taking a random adress if multiple are available) and creates new table with result
-- There exist companies with more than 200 addresses
WITH entryCount AS (
    SELECT *, row_number() OVER(PARTITION BY BvDID ORDER BY StreetLine1) AS EntryNo
    FROM BvDAddresses)

SELECT BvDID, StreetLine1, StreetLine2, StreetLine3, StreetLine4, Postcode, City, Country
INTO filteredBvDAddresses
FROM entryCount
WHERE EntryNo = 1;
GO

-- deletes old table
DROP TABLE BvDAddresses
*/