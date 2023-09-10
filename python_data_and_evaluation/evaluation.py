import numpy as np
import umap
import matplotlib.pyplot as plt
import json

from sklearn import datasets
from sklearn.cluster import DBSCAN
from sklearn import metrics

np.random.seed(5)

iris = datasets.load_iris()
X = iris.data
labels_true = iris.target
umapped_Iris = umap.UMAP().fit_transform(X)
umapped_Iris = umapped_Iris * 100

plt.scatter(umapped_Iris[:, 0], umapped_Iris[:, 1], c=labels_true, cmap='viridis')
plt.title("UMAP reduction of Iris Dataset without target")
plt.show()


clustering_targeted = DBSCAN(eps=1000, min_samples=2).fit(umapped_Iris, y=labels_true)
labels_dbscan = clustering_targeted.labels_

print(f"Homogeneity: {metrics.homogeneity_score(labels_true, labels_dbscan):.3f}")
print(f"Completeness: {metrics.completeness_score(labels_true, labels_dbscan):.3f}")
print(f"V-measure: {metrics.v_measure_score(labels_true, labels_dbscan):.3f}")
print(f"Adjusted Rand Index: {metrics.adjusted_rand_score(labels_true, labels_dbscan):.3f}")
print("Adjusted Mutual Information:" f" {metrics.adjusted_mutual_info_score(labels_true, labels_dbscan):.3f}")
print(f"Silhouette Coefficient: {metrics.silhouette_score(X, labels_dbscan):.3f}")



umapped_Iris = umap.UMAP().fit_transform(X, labels_true)

plt.scatter(umapped_Iris[:, 0], umapped_Iris[:, 1], c=labels_true, cmap='viridis')
plt.title("UMAP reduction of Iris Dataset with target")
plt.show()