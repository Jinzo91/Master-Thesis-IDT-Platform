These files are used for creating and updating the database for the IDT company source.

Both procedures require that the necessary .txt-files are in the /var/opt/massql/data folder of the database container.
The necessary files include:
1. BvD_ID_and_Name.txt
2. Contact_info.txt
3. Industry_classifications.txt
4. Key_financials.txt
5. Overviews.txt
All these files must be named as shown here and the data must be in the Orbis Format. The files can be found at \\nas.ads.mwn.de\tuze\bib\public\orbis. They get updated every 6 month.

Creation:
0. Take the IDT company source API offline. Oterwise the process will fail.
1. Create an Image, based on the Dockerfile in the "Docker" folder. 
	Note that the IDT company source cannot work with the regular MSSQL Image, so it is mandatory to use the here provided Dockerfile.
2. Create a container based on this image or (if used with kubernetes) run the script in the kubernetes folder
3. Load all mentioned files together with the script and the sql-queries in the specified folder of the container.
4. Run the "loadData.sh" script

Updating:
1. Load all mentioned files together with the script and the sql-queries in the specified folder of the container.
2. Run the "loadAndUpdateData.sh" script.
3. If the performance is not sufficient, check whether the indices are to fragmented and reorganize/rebuild them if so.
