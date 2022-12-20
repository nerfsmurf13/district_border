
from urllib.request import urlopen
import urllib.parse
import json
API_KEY='AIzaSyBMobqGzdmYFvsxeZJ3YunRull6NYefekM'


def grabLoc(x):
	QUERY=urllib.parse.quote_plus(x)
	with urlopen(f'https://maps.googleapis.com/maps/api/geocode/json?address={QUERY}+Frisco+TX&key={API_KEY}') as response:
		body = response.read()

	tempLoc = {}
	responseCoords = json.loads(body)
	tempLoc['formatted_address']=responseCoords['results'][0]['formatted_address']
	tempLoc['location']=responseCoords['results'][0]['geometry']['location']

	print(responseCoords['results'][0]['geometry']['location'])
	print(responseCoords['results'][0]['formatted_address'])
	return tempLoc


f = open("pyInput.json", "r")
inputJson = json.loads(f.read())
inputType = "Middle School"


outputJson=[]
# print(inputJson['type'])
# print(inputJson['features'])
for x in inputJson['features']:
	tempFetch = grabLoc(f"{x['properties']['Name']} {inputType}")
	tempJson={}
	# Names
	# print(x['properties']['Name'])
	#Grades
	# print(x['properties']['Grades'])
	#Polygon
	# print(x['geometry']['coordinates'][0][0])
	tempJson['name']=f"{x['properties']['Name']} {inputType}"
	tempJson['type']=inputType
	tempJson['grades']=x['properties']['Grades']
	tempJson['location']=tempFetch['location']
	tempJson['url']=''
	tempJson['color']=''
	tempJson['address']=tempFetch['formatted_address']
	tempJson['border']=x['geometry']['coordinates'][0][0]
	
	outputJson.append(tempJson)
# print(outputJson)
outputStr=json.dumps(outputJson)
with open("pyOutput.json", "w") as outfile:
	outfile.write(outputStr)
