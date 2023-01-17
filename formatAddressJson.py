import json
f = open("addressPoints copy.JSON", "r")
inputJson = json.loads(f.read())
outFilename = 'addressMin.json'

# print(inputJson)
print(len(inputJson))


outputJson=[]
for x in inputJson:
	# print(x)
	tempJson={}
	tempJson['a']=f"{x['address']}, {x['city']}"
	# tempJson['type']=inputType
	# tempJson['grades']=x['properties']['Grades']
	tempJson['l']=[x['lat'],x['long']]
	# tempJson['location'][1]=x['long']
	# tempJson['url']=''
	# tempJson['color']=''
	# tempJson['address']=tempFetch['formatted_address']
	# tempJson['border']=x['geometry']['coordinates']
	outputJson.append(tempJson)

print('done')
outputStr=json.dumps(outputJson)
with open(outFilename, "w") as outfile:
	outfile.write(outputStr)