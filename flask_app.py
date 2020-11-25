from flask import Flask, render_template, url_for, request, redirect
import os

from datetime import datetime

X = [
                  ['OBJECT DETECTION SYSTEM', 'An object detection system based on tensorflow and flask web framework. It detects objects in image frames, videos and also a batch of images. \n A threshold level of 60% is set by default to classify an object. It uses the COCO dataset. It also has been incorporated with multi threading for faster results. The average time taken to classify a frame of 600x400 is 0.25 seconds.'
                  ,'../static/obdt.jpg','https://www.github.com/avi09/Object-Detection'
                  ],
                  ['ALS MUSIC RECOMMENDATION SYSTEM - ALS | Apache Spark | Python | Pandas', 'Made a music recommendation system in a distributed environment. The dataset was taken from a collection of oepn music listening history of 50 million streams. The data for top 50 users was taken. Since the artists can have slightly different names for different albums though they are same, so the artists are first mapped to canonical artist IDs. Then the data is used to implicitly train the Alternating Least Squares algorithm. After this, the test data which is about 20% is then used to predict and validate the choice.'
                  ,'../static/ca.jpg',''],
                  ['DETECTION OF DEFECTS ON TEXTURED SURFACES - Keras | CNN | UNET | Python', 'In manufacturing industries, often surfaces of metals and other objects cannot be manually checked for defects. Thus this job is done by machines. Using Convolutional Neural Network and UNET architexture, I built a complete model through training the network on dataset and thus infer this on test data. The test data was about 20% of the total. There were total 5 convolutional layers and 5 for deconvolution. The model did pretty well on the test dataset.'
                  ,'../static/ca.jpg','https://www.github.com/avi09/Mach'],
                  ['ADWORDS ORGANIZATION AND CALCULATION OF REVENUE - Python','Whenever a company is placing ads, for example the Google search Engine, the ads are targeted on the basis of keywords that the users enter in the query. There are different companies that give ad requests to such companies and they have several keywords which trigger their ads. Due to limited daily budgets and different bid amounts, the sequence of ads to be shown and the revenue generated from them becomes a complex problem. Using bipartite graphs I calculated the revenue and competitive ratio for such a problem. I used balanced, greedy and MSVV algorithm for it. The maximum revenue came to be 16721 and the maximum calculated competitive ratio was 0.99 using the dataset which I used.'
                  ,'../static/ca.jpg','https://github.com/avi09/Adwords_Placement_On_Customer_Bids'],
                  ['MARKET INFLUENCE ON THE COMMUNITY USING ATTRIBUTED GRAPH - Python', 'Whenever a company targets ads to a user, usually the users are the ones which spread the word about the product and thus make the product popular. So in advertising if we target the right ser of people in a community, then we can get maximum advertising. To solve thus problem, attributed graph communities are used which define not just the people in a group but rather their information and the connection between them.'
                  ,'../static/ca.jpg','https://github.com/avi09/Market_Influence_On_Attributed_Graph'],
                  ['BREAST CANCER DATASET PREDICTION - Scikit-learn | Pandas | Python', 'Trained KNN and SVM algorithms on breast cancer dataset. The model was trained using Sk-learn library. It helped to datermine that bare_nuclei and thickness are the two most important factors affecting the malignancy of cancer. Also after this I implemented the algorithms from scratch and they were also working with good accuracy. The K I took in K Nearest Neighbours is 3. Also later I visualized it.'
                  ,'../static/ca.jpg','https://github.com/avi09/Mach']
               ]
app=Flask(__name__)

@app.route('/')
def home():
    return render_template("layout.html", X=X)

if __name__ == '__main__':
   app.run(debug=True)
