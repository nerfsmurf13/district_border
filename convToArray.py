import json

f = open("border.txt", "r")
rawTxtData = f.read()
newArr=[]
count = 0
buildSide = 0
subset=[]

for x in rawTxtData.split():
  if buildSide==0:
    subset=[]
    subset.append(float(x))
    buildSide=1
  elif buildSide==1:
    subset.append(float(x[:-1]))
    newArr.append(subset)
    buildSide=0
  count=count+1
  
print(newArr)
print(count)

test=json.dumps(newArr)

with open("border_autoGen.json", "w") as outfile:
    outfile.write(test)