import json
import requests
API_KEY='AIzaSyBMobqGzdmYFvsxeZJ3YunRull6NYefekM'

response = requests.get(f'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key={API_KEY}')
resp_json_payload = response.json()
print(resp_json_payload['results'][0]['geometry']['location'])

f = open("pyInput.json", "r")
inputJson = json.loads(f.read())
inputType = "Middle School"


outputJson=[]
# print(inputJson['type'])
# print(inputJson['features'])
for x in inputJson['features']:
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
	tempJson['location']='{ lat: 33, lng: -96 }'
	tempJson['color']=''
	tempJson['address']=''
	tempJson['border']=x['geometry']['coordinates'][0][0]
	
	outputJson.append(tempJson)
# print(outputJson)
outputStr=json.dumps(outputJson)
with open("pyOutput.json", "w") as outfile:
  outfile.write(outputStr)
  
  
  # {
  #   name: "Lebanon Trail High School",
  #   type: "High School",
  #   grades: [9, 10, 11, 12],
  #   location: { lat: 33.122112, lng: -96.7994581 },
  #   color: "#00843d",
  #   address: "5151 Ohio Dr, Frisco, TX 75035",
  #   border: [
  #     [-96.81385388787812, 33.132939303124616],
  #     [-96.80828468412992, 33.10712681071162],
  #     [-96.77270666406858, 33.11722628573172],
  #     [-96.78081715496401, 33.13850837199895],
  #   ],
  # },

# newArr=[]
# count = 0
# buildSide = 0
# subset=[]

# for x in rawTxtData.split():
#   if buildSide==0:
#     subset=[]
#     subset.append(float(x))
#     buildSide=1
#   elif buildSide==1:
#     subset.append(float(x[:-1]))
#     newArr.append(subset)
#     buildSide=0
#   count=count+1
  
# print(newArr)
# print(count)

# test=json.dumps(newArr)

# with open("border_autoGen.json", "w") as outfile:
#     outfile.write(test)