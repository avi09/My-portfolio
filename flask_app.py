from flask import Flask, render_template, url_for, request, redirect
import os

import json
from datetime import datetime
import random

f = open('projects.json')
X = json.load(f)
f.close()

f = open('education.json')
ED = json.load(f)
f.close()


for i in range(len(ED)):
    ED[i]["r"] = random.randint(100, 200)
    ED[i]["g"] = random.randint(0, 120)
    ED[i]["b"] = random.randint(100, 220)

for i in range(len(X)):
    X[i]["r"] = random.randint(100, 200)
    X[i]["g"] = random.randint(0, 120)
    X[i]["b"] = random.randint(100, 220)

app=Flask(__name__)
@app.route('/')
def home():
    return render_template("layout.html", X=X, ED=ED)

if __name__ == '__main__':
   app.run(debug=True)
