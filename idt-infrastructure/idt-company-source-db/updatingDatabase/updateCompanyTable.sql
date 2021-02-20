USE [idtCompanySource]
GO

UPDATE company
SET [dbo].[company].[Name] = [dbo].[companyUpdated].[Name]
      ,company.[FullOverview] = companyUpdated.[FullOverview]
      ,company.[OperatingRevenue] = companyUpdated.[OperatingRevenue]
      ,company.[Employees] = companyUpdated.[Employees]
      ,company.[Street] = companyUpdated.[Street]
      ,company.[Postcode] = companyUpdated.[Postcode]
      ,company.[City] = companyUpdated.[City]
      ,company.[Country] = companyUpdated.[Country]
      ,company.[Website] = companyUpdated.[Website]
      ,company.[NAICSSector] = companyUpdated.[NAICSSector]
FROM company
INNER JOIN companyUpdated
ON company.BvDID = companyUpdated.BvDID;
GO

INSERT INTO company
SELECT *
FROM companyUpdated cu
WHERE
    NOT EXISTS (SELECT *
        FROM company c
        WHERE c.BvDID = cu.BvDID);
GO

DROP TABLE companyUpdated
