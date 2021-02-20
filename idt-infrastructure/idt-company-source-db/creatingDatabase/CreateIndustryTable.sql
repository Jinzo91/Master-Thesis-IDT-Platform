USE [idtCompanySource]
GO

CREATE TABLE BvDIndustry (
    BvDID varchar(50) NOT NULL,
    NationalIndustryClassification varchar(255),
    PrimaryCode varchar(10),
    PrimaryCodeNationalDescription varchar(255),
    SecondaryCode varchar(10),
    SecondaryCodeNationalDescription varchar(255),
    NACEMain varchar(255),
    NACECoreCode varchar(4),
    NACECoreCodeDescription varchar(250),
    NACEPrimary varchar(10),
    NACEPrimaryCodeDescription varchar(250),
    NACESecondaryCode varchar(10),
    NACESecondaryCodeDescription varchar(250),
    NAICECoreCode varchar(10),
    NAICECoreCodeDescription varchar(250),
    NAICEPrimary varchar(10),
    NAICEPrimaryCodeDescription varchar(250),
    NAICESecondaryCode varchar(10),
    NAICESecondaryCodeDescription varchar(250),
    USSICCoreCode varchar(3),
    USSICCoreCodeDescription varchar(250),
    USSICPrimary varchar(10),
    USSICPrimaryCodeDescription varchar(250),
    USSICSecondaryCode varchar(10),
    USSICSecondaryCodeDescription varchar(250),
    BvDSector varchar(250)
)
GO

-- inserts raw data from txt file
BULK INSERT [idtCompanySource].[dbo].[BvDIndustry]
FROM N'/var/opt/mssql/data/Industry_classifications.txt'
WITH (
    BATCHSIZE = 1000000,
    FIELDTERMINATOR = '\t',
    ROWTERMINATOR = '\n',
    MAXERRORS = 1000000,
    FIRSTROW = 2 -- because first row is title
    ,LASTROW = 200000
);
GO

DELETE FROM BvDIndustry
WHERE NAICECoreCode IS NULL OR NAICECoreCode = '';
GO

CREATE TABLE classificationNAICS (
    SectorCode smallint NOT NULL,
    Description varchar(255),
    PRIMARY KEY (SectorCode)
);
GO

INSERT INTO classificationNAICS
VALUES
    (11,'Agriculture, Forestry, Fishing and Hunting'),
    (21,'Mining, Quarrying, and Oil and Gas Extraction'),
    (22,'Utilities'),
    (23,'Construction'),
    (31,'Manufacturing'),
    (32,'Manufacturing'),
    (33,'Manufacturing'),
    (42,'Wholesale Trade'),
    (44,'Retail Trade'),
    (45,'Retail Trade'),
    (48,'Transportation and Warehousing'),
    (49,'Transportation and Warehousing'),
    (51,'Information'),
    (52,'Finance and Insurance'),
    (53,'Real Estate and Rental and Leasing'),
    (54,'Professional, Scientific, and Technical Services'),
    (55,'Management of Companies and Enterprises'),
    (56,'Administrative and Support and Waste Management and Remediation Services'),
    (61,'Educational Services'),
    (62,'Health Care and Social Assistance'),
    (71,'Arts, Entertainment, and Recreation'),
    (72,'Accommodation and Food Services'),
    (81,'Other Services (except Public Administration)'),
    (92,'Public Administration');

GO

ALTER TABLE [BvDIndustry] ADD NAICSSector varchar(255)
GO

UPDATE [BvDIndustry]
SET BvDIndustry.NAICSSector = N.[Description]
FROM BvDIndustry c INNER JOIN classificationNAICS N
ON LEFT(c.NAICECoreCode, 2) = N.SectorCode

ALTER TABLE BvDIndustry
DROP COLUMN PrimaryCode,PrimaryCodeNationalDescription, NationalIndustryClassification, SecondaryCode, SecondaryCodeNationalDescription, NACEMain, NACECoreCode, NACECoreCodeDescription, NACEPrimary, NACEPrimaryCodeDescription,
    NACESecondaryCode, NACESecondaryCodeDescription, NAICEPrimary, NAICEPrimaryCodeDescription, NAICESecondaryCode, NAICESecondaryCodeDescription, USSICCoreCode, USSICCoreCodeDescription,
    USSICPrimary, USSICPrimaryCodeDescription, USSICSecondaryCode, USSICSecondaryCodeDescription, BvDSector, NAICECoreCodeDescription, NAICECoreCode;
GO

DROP TABLE classificationNAICS;
GO