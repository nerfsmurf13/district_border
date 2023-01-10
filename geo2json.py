
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


f = open("EL_23_24_GRADE_K_5_LayerToKM.JSON", "r")
inputJson = json.loads(f.read())
inputType = "Elementary"


outputJson=[]
# for x in inputJson['features']:
# 	tempFetch = grabLoc(f"{x['properties']['Name']} {inputType}")
# 	tempJson={}
# 	tempJson['name']=f"{x['properties']['Name']} {inputType}"
# 	tempJson['type']=inputType
# 	tempJson['grades']=x['properties']['Grades']
# 	tempJson['location']={ 'lat': 33.1812999, 'lng': -96.75180379999999 }
# 	tempJson['location']=tempFetch['location']
# 	tempJson['url']=''
# 	tempJson['color']=''
# 	tempJson['address']='123 fakestreet'
# 	tempJson['address']=tempFetch['formatted_address']
# 	tempJson['border']=x['geometry']['coordinates'][0][0]
# 	outputJson.append(tempJson)

# Testing, without Fetching
for x in inputJson['features']:
	tempJson={}
	tempJson['name']=f"{x['properties']['Name']} {inputType}"
	tempJson['type']=inputType
	tempJson['grades']=x['properties']['Grades']
	tempJson['location']={ 'lat': 33.1812999, 'lng': -96.75180379999999 }
	tempJson['url']=''
	tempJson['color']=''
	tempJson['address']='123 fakestreet'
	tempJson['border']=x['geometry']['coordinates']
	outputJson.append(tempJson)

##Finding Duplicates
# duplicates = []
# for x in inputJson['features']:
#   borderPointer = x['geometry']['coordinates'][0][0]
#   count=1
#   for y in inputJson['features']:
#     borderPointer2 = y['geometry']['coordinates'][0][0]
#     if borderPointer==borderPointer2:
#       count=count+1
#       print(y['properties']['name'])
#   # print(borderPointer)

# print(outputJson)
outputStr=json.dumps(outputJson)
with open("pyOutput.json", "w") as outfile:
	outfile.write(outputStr)
