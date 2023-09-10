import matplotlib.pyplot as plt
import requests
import numpy as np
import pandas as pd
import json
from sklearn import datasets
from sklearn import metrics

#url = 'http://serverurl:8080/incidence?levelId=1'
#response = requests.get(url)

#data = response.json()

datafile = open("backedUpData_Iris_UMAP_WITH_TARGET.json")

iris = datasets.load_iris()
X = iris.data
labels_true = iris.target

data = json.load(datafile)

combination = np.zeros((150,150))
for matrix in data:
    combination += matrix['matrix']

df = pd.DataFrame(combination)
maximum = df.values.max()
threshold = (maximum / 100) * 75
df = df > threshold
df = df.drop_duplicates()

labels_heatmap = [-1]*150
cluster = 0
for rowindex, rowitem in df.iterrows():
    for i in range(len(rowitem)):
        if rowitem[i] == True:
            labels_heatmap[i] = cluster

    cluster += 1


print(f"Homogeneity: {metrics.homogeneity_score(labels_true, labels_heatmap):.3f}")
print(f"Completeness: {metrics.completeness_score(labels_true, labels_heatmap):.3f}")
print(f"V-measure: {metrics.v_measure_score(labels_true, labels_heatmap):.3f}")
print(f"Adjusted Rand Index: {metrics.adjusted_rand_score(labels_true, labels_heatmap):.3f}")
print("Adjusted Mutual Information:" f" {metrics.adjusted_mutual_info_score(labels_true, labels_heatmap):.3f}")
print(f"Silhouette Coefficient: {metrics.silhouette_score(X, labels_heatmap):.3f}")

print (labels_heatmap)

plt.imshow(combination, cmap='brg', aspect='auto')
plt.colorbar()
plt.title("Heatmap of player clustered datapoints")
plt.xlabel("Points")
plt.ylabel("Points")
plt.show()

