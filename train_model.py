# train_model.py
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import make_classification
import pickle

# Générer des données factices
X, y = make_classification(n_samples=1000, n_features=20, n_informative=15, n_redundant=5, random_state=42)

# Créer le modèle Gradient Boosting
model = GradientBoostingClassifier(n_estimators=100, learning_rate=1.0, max_depth=1, random_state=42)
model.fit(X, y)

# Sauvegarder le modèle entraîné
with open('transport_model.pkl', 'wb') as f:
    pickle.dump(model, f)
