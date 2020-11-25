import os
from os import path

from wordcloud import WordCloud
import random
def grey_color_func(word, font_size, position, orientation, random_state=None,
                    **kwargs):
    r = random.randint(80, 256)
    g = random.randint(0, 150)
    b = random.randint(80, 256)
    return "rgb("+str(r)+","+str(g)+","+str(b)+")"

d = os.getcwd()

# Read the whole text.
text = open(path.join(d, 'words.txt')).read()

# Generate a word cloud image
wordcloud = WordCloud().generate(text)

# Display the generated image:
# the matplotlib way:
import matplotlib.pyplot as plt
#plt.imshow(wordcloud, interpolation='bilinear')
#plt.axis("off")

# lower max_font_size
wordcloud = WordCloud(max_font_size=180, relative_scaling = 1, width = 3600, height = 900).generate(text)
plt.figure()
plt.imshow(wordcloud.recolor(color_func=grey_color_func), interpolation="bilinear")
plt.axis("off")
plt.show()


# The pil way (if you don't have matplotlib)
# image = wordcloud.to_image()
# image.show()
