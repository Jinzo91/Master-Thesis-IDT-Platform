USE [idtCompanySource]
GO

-- creates the table
CREATE TABLE BvDFinancials (
    BvDID varchar(50),
    ConsolidationCode varchar(5),
    FilingType varchar(50),
    ClosingDate varchar(8), -- format of date is not consistent, so it has to be varchar
    Months varchar(5),
    AuditStatus varchar(50),
    AccountingPractice varchar(50),
    Source varchar(50),
    OriginalUnits varchar(20),
    OriginalCurrency char(3),
    ExchangeRate DECIMAL,
    -- has to be bigint because overflow otherwise
    OperatingRevenue BIGINT,
    PLBeforeTax BIGINT,
    NetIncome BIGINT,
    CashFlow BIGINT,
    TotalAssets BIGINT,
    ShareholdersFunds DECIMAL,
    CurrentRatio DECIMAL,
    ProfitMargin DECIMAL,
    ROE DECIMAL,
    ROCE DECIMAL,
    Solvency DECIMAL,
    PriceEarning DECIMAL,
    Employees INTEGER,
    MarketCap DECIMAL

);
GO

-- inserts raw data from txt file
BULK INSERT dbo.BvDFinancials
FROM N'/var/opt/mssql/data/Key_financials.txt'
WITH (
    BATCHSIZE = 1000000,
    FIELDTERMINATOR = '\t',
    ROWTERMINATOR = '\n',
    MAXERRORS = 1000000,
    FIRSTROW = 2 -- because first row is title
    ,LASTROW = 200000 --comment out in production
);
GO

-- filters the financial data
-- current key is BvDID, FilingType, ClosingDate, ConsolidationCode
-- This query is elimination each key one by one (except for BvdID) always in order to get the entry with the most preferrable option
-- preferable are a recent ClosingDate, an annual report as FilingType, and a good (see definition) consolitdation code
-- Also, it filters out all entries without employees or revenue entry
WITH latestEntryDate AS (
    SELECT BvDID, MAX(ClosingDate) AS ClosingDate
    FROM [idtCompanySource].[dbo].[BvDFinancials]
    GROUP BY BvDID),
latestEntry AS (
    SELECT BvDFinancials.*
    FROM BvDFinancials INNER JOIN latestEntryDate
    ON BvDFinancials.BvDID = latestEntryDate.BvDID AND BvDFinancials.ClosingDate = latestEntryDate.ClosingDate
    WHERE Employees IS NOT NULL AND OperatingRevenue IS NOT NULL),
bestFilingType AS (
    SELECT BvDID, MIN(FilingType) AS FilingType
    FROM latestEntry
    GROUP BY BvDID),
bestFilingEntry AS (
    SELECT latestEntry.*, ConsolidationValue = 
        CASE ConsolidationCode
            -- ranking of consolidation codes, 0 is best, 10 is worst
            WHEN 'C1' THEN 0
            WHEN 'CA2' THEN 1
            WHEN 'C2' THEN 2
            WHEN 'UA2' THEN 3
            WHEN 'U2' THEN 4
            WHEN 'U1' THEN 5
            WHEN 'LF' THEN 6
            WHEN 'NF' THEN 7
            WHEN 'NRF' THEN 8
            WHEN 'NRLF' THEN 9
            ELSE 10
        END
    FROM latestEntry INNER JOIN bestFilingType
    ON latestEntry.BvDID = bestFilingType.BvDID AND latestEntry.FilingType = bestFilingType.FilingType),
bestConsolidationCode AS (
    SELECT BvDID, MIN(ConsolidationValue) AS ConsolidationValue
    FROM bestFilingEntry
    GROUP BY BvDID),
bestConsolidationEntry AS (
    SELECT bestFilingEntry.*
    FROM bestFilingEntry INNER JOIN bestConsolidationCode
    ON bestFilingEntry.BvDID = bestConsolidationCode.BvDID AND bestFilingEntry.ConsolidationValue = bestConsolidationCode.ConsolidationValue)

-- inserts result in new table
SELECT BvDID, ConsolidationCode, FilingType, ClosingDate, Employees, OperatingRevenue
INTO filteredBvDFinancials
FROM bestConsolidationEntry
ORDER BY BvDID

-- deletes old table
DROP TABLE BvDFinancials