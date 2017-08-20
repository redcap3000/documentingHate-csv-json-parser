

/*

	documentingHate cvs json parser 


	This project attempts to sanatize the data from 

	https://raw.githubusercontent.com/GoogleTrends/data/gh-pages/20170816_Documenting_Hate.csv
	
	to produce a json file with 'good rows' grouped by state

	The first thing I did was removed the summary column which was littered with commas.

	Next I normalized the state column to only show state abbreviations.

	Next I sentence-cased all city columns.

	And I attempt to remove some records that do not have a city/state field, or a poorly formed state field, which on some
	rows included an address.

	I put these rows in another object and grouped the 'good rows' by state.

	Finally I created a basic count of every occurance reported organized by state.


	Use:

	node index.js <CvsToParse>

	-Outputs the object grouped by cities.

	Please use for good and generally non commercial purposes. Thank you.
	
	Ronaldo Barbachano 2017
*/

fs = require('mz/fs')
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
var sanatizeState = function(state){
	//console.log(state)
	if(typeof state == 'undefined'){
		console.log(state + ' is undefined????')
	}

	if(state == 'D.C.'){
		return 'DC'
	}
	state = state.toUpperCase().trim();
	//console.log(state)
	if(state.length > 2){
		var usStates = 
		    { 'ALABAMA' : 'AL',
		      'ALASKA' : 'AK',
		     'AMERICAN SAMOA' : 'AS',
		     'ARIZONA' : 'AZ',
		     'ARKANSAS' : 'AR',
		     'CALIFORNIA' : 'CA',
		     'COLORADO' : 'CO',
		     'CONNECTICUT' : 'CT',
		     'DELAWARE' : 'DE',
		     'DISTRICT OF COLUMBIA' : 'DC',
		     'FEDERATED STATES OF MICRONESIA' : 'FM',
		     'FLORIDA' : 'FL',
		     'GEORGIA' : 'GA',
		     'GUAM' : 'GU',
		     'HAWAII' : 'HI',
		     'IDAHO' : 'ID',
		     'ILLINOIS' : 'IL',
		     'INDIANA' : 'IN',
		     'IOWA' : 'IA',
		     'KANSAS' : 'KS',
		     'KENTUCKY' : 'KY',
		     'LOUISIANA' : 'LA',
		     'MAINE' : 'ME',
		     'MARSHALL ISLANDS' : 'MH',
		     'MARYLAND' : 'MD',
		     'MASSACHUSETTS' : 'MA',
		     'MICHIGAN' : 'MI',
		     'MINNESOTA' : 'MN',
		     'MISSISSIPPI' : 'MS',
		     'MISSOURI' : 'MO',
		     'MONTANA' : 'MT',
		     'NEBRASKA' : 'NE',
		     'NEVADA' : 'NV',
		     'NEW HAMPSHIRE' : 'NH',
		     'NEW JERSEY' : 'NJ',
		     'NEW MEXICO' : 'NM',
		     'NEW YORK' : 'NY',
		     'NORTH CAROLINA' : 'NC',
		     'NORTH DAKOTA' : 'ND',
		     'NORTHERN MARIANA ISLANDS' : 'MP',
		     'OHIO' : 'OH',
		     'OKLAHOMA' : 'OK',
		     'OREGON' : 'OR',
		     'PALAU' : 'PW',
		     'PENNSYLVANIA' : 'PA',
		     'PUERTO RICO' : 'PR',
		     'RHODE ISLAND' : 'RI',
		     'SOUTH CAROLINA' : 'SC',
		     'SOUTH DAKOTA' : 'SD',
		     'TENNESSEE' : 'TN',
		     'TEXAS' : 'TX',
		     'UTAH' : 'UT',
		     'VERMONT' : 'VT',
		     'VIRGIN ISLANDS' : 'VI',
		     'VIRGINIA' : 'VA',
		     'WASHINGTON' : 'WA',
		     'WEST VIRGINIA' : 'WV',
		     'WISCONSIN' : 'WI',
		     'WYOMING' : 'WY' }
		;
		if(typeof usStates[state] != 'undefined'){
			return usStates[state]
		}else{
			console.log("ERROR")
			console.log(state+'-')
			console.log(usStates[state])
			console.log("\n")
			return false
		}
	}
	return state;
}
try{
	let cvsFile = fs.readFileSync(process.argv[2]);
	if(cvsFile){
		// reset /set resultObjects
		resultObjects = []
		cvsFile = cvsFile.toString()
		keys = []
		stats = []
		errorObjects = []
		if(typeof cvsFile != 'undefined'){
			cvsFile.toString().split('\n').filter(function(o,i){
				if(i === 0){
					let row = o.split(',')
					keys = row
					// get rid of summary field
					keys.pop()
				}else{
					let row = o.split(',')
					if(row[3] == '' || row[2] == ''){
						// no location
					}else{
						let obj = {}
						row.filter(function(value,order){
							// filter out articles without a location
							if(value != '' && typeof keys[order] != 'undefined'){
								if(keys[order] == 'State'){
									// some states are lowercase, some states are abbreviated, some states aren't.
									obj[ keys[order]] = sanatizeState(value)
								}else{
									obj[ keys[order]] = value.trim()
								}
							}else{
								//console.log('no value')
							}
						
						})
						if(obj['State']){
							resultObjects.push(obj)
						}else{
							errorObjects.push([i,o])
						}
						//resultObjects.push(obj)
					}

				}
			})
			if(resultObjects.length > 0){
				commonLocations = {}
				resultObjects.filter(function(row,i){
					if(typeof commonLocations[row.State] == 'undefined'){
						commonLocations[row.State] = [row]
					}else {
						commonLocations[row.State].push(row)
					}
				})
				var commonTotals = {}
				var commonCount = {}
				var duplicates = []
				for(var place in commonLocations){
					commonCount[place] = commonLocations[place].length
					
				}
				console.log("Occurance totals by state:")

				console.log(commonCount)
				
				console.log('Good rows:' + resultObjects.length)
				console.log('Errant rows:' + errorObjects.length)

				fs.writeFile('./'+process.argv[2]+'_parsed.json', JSON.stringify(commonLocations, null, 2) , 'utf-8');
			}
		}
	}
}catch(err){
	console.log(err)
	console.log("Problem with file")
}
