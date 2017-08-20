##documentingHate cvs json parser


This project attempts to sanatize the data from GoogleTrends Documenting Hate project to produce a json file with 'good rows' grouped by state

1) The first thing I did was removed the summary column which was littered with commas.

2) Next I normalized the state column to only show state abbreviations.

3) Next I sentence-cased all city columns.

4) And I attempt to remove some records that do not have a city/state field, or a poorly formed state field, which on some
	rows included an address.

5) I put these rows in another object and grouped the 'good rows' by state.

6) Finally I created a basic count of every occurance reported organized by state.


	Use:

	node index.js <CvsToParse>

-Outputs the object grouped by cities.



Please use for good and generally non commercial purposes. Thank you.
	
####Ronaldo Barbachano 2017
