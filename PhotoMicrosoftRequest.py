# User Interface: 
# User opens web app on Phone. Gives access to camera

# Registering (Max's) 
# Man behind the mirror - Objective, Them seeing the reuslt, 
# Have that be that accurate (Each one, could be 4 points. Prove it could determine)
# Demo: Spoof. 

# User interfaces. 
# Using pictures of the ground. User going to register 

#Picture data constantly streaming to Vish's Neural Net results on server
# Result in Interface being brought up. ()
# Once you tilt, gyroscope. UI 

# Meter. 


#### Persistent Registration ####
# Chooses from list of options to tie "Value"
#	-- Value is List of Objects {Speaker, Alarm}
# "Take picture of the object you want to represent your {$Interface}"
# User is able to take picture 
# Picture is captured. (Still Image) -> Could extend to take multiple
# User clicks register. -> Call goes out w/Picture & Value 
# Picture goes to Microsoft API. 
# We put results into [existing] hashmap
# User receives Success Method


#### Usage #####
# - User mapped "A bottle of water" -> Speaker 
# -- "Bottle" -> Speaker # Not necesarily getting exact match, on second picture 
# -- "Water" -> Speaker

# - User mapped "orange on table" -> Alarm
# -- "Orange" -> Alarm
# -- "Table" -> Alarm

# User opens application. Camera opens, points it at the Object. 
# Button ("Open Interface") Clicked.
# Sends to Microsoft API
# Result is parsed, we look @GCD's hashmap. Return string of interface/value
# Open interface/value 
# "User will be prompted, web app is trying to open "Application""
# Application opened on user end. 




# Given a photo (From front end phone) -> given some link "*.jpg"
# Send as post argument to Microsoft & Save the result into a dict

import http.client, urllib.request, urllib.parse, urllib.error, base64, json, requests
from nltk.corpus import stopwords
#import nltk
#nltk.download()

stop = {"a", "or","and", "the", "in", "of", "on"}

#s=set(stopwords.words('english'))

headers = {
    # Request headers. Replace the key below with your subscription key.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '3923fb2c84184cbd9a73dbe45fc9d7b7',
}

params = urllib.parse.urlencode({
    # Request parameters. All of them are optional.
    'visualFeatures': 'Categories, Tags, Description',

    #'details': '{string}',
    'language': 'en',
})

# Replace the three dots below with the URL of a JPEG image of a celebrity.
body = "{'url':'http://cdn.embed.ly/providers/logos/imgur.png'}"
res = ""

try:
    conn = http.client.HTTPSConnection('westus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/analyze?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()
    res = json.loads(data)
    #print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

descr_res = res["description"]["captions"][0]["text"].split()
#print(descr_res)
#print(res["description"]["captions"][0]["text"]) # Resulting string
user_value = "Speaker"
export_dict = {}
for w in descr_res:
	if w not in stop:
		if (w not in export_dict):
			export_dict[w] = user_value
print (export_dict)

#filtered_words = [word for word in descr_res if word not in stopwords.words('english')]

##TODO Upload to Google Data


#print filter(f(w) for w in s, descr_res.split())

# b'{"categories":[{"name":"abstract_shape","score":0.25390625},{"name":"others_","score":0.48046875}],
#    "tags":[],
#    "description":{"tags":["bird"],"captions":[{"text":"a bird flying in the air","confidence":0.23963414962281721}]},
#    "requestId":"9d71c4c4-916b-4c73-8f92-e343ca329d69","metadata":{"width":1024,"height":372,"format":"Png"}}'

### Actual Usage ###
#- User wants to use remote, points at bottle (near orange)
#- Microsoft API returns "Bottle of water on orange table " 
# PQ is decision maker 
#Get("Bottle") # PQ {Pair: Speaker, 1}
#Get("Water") # PQ {Pair: Speaker, 2}
#Get("Table") # PQ {Pair: Speaker, 2, Pair: Alarm, 1}
#Get("orange") # PQ {Pair: Speaker, 2, Pair: Alarm, 2} - 
			  # Naive solution, return list of two interfaces


# Pair<String, Integer>
#-- PQ: (Speaker(2), Alarm(1))
#Return Speaker Interface

#Value -> key
