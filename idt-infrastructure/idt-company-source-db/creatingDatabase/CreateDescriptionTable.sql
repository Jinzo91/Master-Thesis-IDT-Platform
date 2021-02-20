USE [idtCompanySource]
GO

CREATE TABLE BvDOverviews (
    BvDID varchar(50) NOT NULL,
    FullOverview varchar(5000),
    History varchar(2000),
    PrimaryBusinessLine varchar(2000),
    SecondaryBusinessLine varchar(2000),
    MainActivity varchar(2000),
    SecondaryActivity varchar(2000),
    MainProduct varchar(5000),
    SizeEstimate varchar(2000),
    Strategy varchar(2000),
    StrategicAlliances varchar(2000),
    Memberships varchar(2000),
    MainBrandNames varchar(2000),
    DomesticCountry varchar(2000),
    ForeignCountries varchar(2000),
    ProductionDites varchar(2000),
    DistributionSites varchar(2000),
    SalesRepresentation varchar(2000),
    MainCustomers varchar(2000),
    PRIMARY KEY (BvDID)
);
GO
-- inserts raw data from txt file
BULK INSERT dbo.BvDOverviews
FROM N'/var/opt/mssql/data/Overviews.txt'
WITH (
    BATCHSIZE = 1000000,
    FIELDTERMINATOR = '\t',
    ROWTERMINATOR = '\n',
    MAXERRORS = 10000,
    FIRSTROW = 2 -- because first row is title
    ,LASTROW = 50000
);
GO

ALTER TABLE BvDOverviews
DROP COLUMN History,
    PrimaryBusinessLine,
    SecondaryBusinessLine,
    MainActivity,
    SecondaryActivity,
    MainProduct,
    SizeEstimate,
    Strategy,
    StrategicAlliances,
    Memberships,
    MainBrandNames,
    DomesticCountry,
    ForeignCountries,
    ProductionDites,
    DistributionSites,
    SalesRepresentation,
    MainCustomers;