import numpy as np
import json

from sklearn.datasets import make_blobs

n_samples = 200
n_bins = 4  # use 3 bins for calibration_curve as we have 3 clusters here

# Generate 4 blobs with 2 classes where the second blob contains
# half positive samples and half negative samples. Probability in this
# blob is therefore 0.5.
centers = [(-10, -10), (0, 0), (10, 10), (10, 0)]
X, y = make_blobs(n_samples=n_samples, centers=centers, shuffle=False, random_state=42)

scaled = X * 100

scaled = np.trunc(scaled)

formatted = [{"x": x, "y": y} for x, y in scaled]

encodedScaled = json.dumps(formatted)

print(encodedScaled)