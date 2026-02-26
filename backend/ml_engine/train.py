"""
AquaSynapse ML Engine - RandomForest Trainer
Trains on flood dataset, saves model + scaler to pkl files
"""
import os, sys
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
from sklearn.impute import SimpleImputer
import joblib

ENGINE_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(ENGINE_DIR, "flood_dataset.csv")
MODEL_PATH = os.path.join(ENGINE_DIR, "model.pkl")
SCALER_PATH = os.path.join(ENGINE_DIR, "scaler.pkl")
ENCODER_PATH = os.path.join(ENGINE_DIR, "label_encoder.pkl")

FEATURE_COLS = ["rainfall", "elevation", "population_density", "coastal_distance", "historical_index"]
TARGET_COL = "risk_level"

def generate_if_missing():
    if not os.path.exists(DATASET_PATH):
        print("[AquaSynapse ML] Dataset not found, generating synthetic data...")
        from generate_dataset import records
        import pandas as pd
        pd.DataFrame(records).to_csv(DATASET_PATH, index=False)
    return DATASET_PATH

def train():
    generate_if_missing()
    
    print("[AquaSynapse ML] Loading dataset...")
    df = pd.read_csv(DATASET_PATH)
    
    # Handle missing values
    imputer = SimpleImputer(strategy="mean")
    X_raw = df[FEATURE_COLS].values
    X = imputer.fit_transform(X_raw)
    
    # Encode labels
    le = LabelEncoder()
    y = le.fit_transform(df[TARGET_COL].values)
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)
    
    # Train RandomForest
    print("[AquaSynapse ML] Training RandomForestClassifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\n{'='*50}")
    print(f"[AquaSynapse ML] Accuracy: {acc:.4f} ({acc*100:.2f}%)")
    print("="*50)
    print(classification_report(y_test, y_pred, target_names=le.classes_))
    
    # Save artifacts
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(le, ENCODER_PATH)
    print(f"[AquaSynapse ML] Model saved to {MODEL_PATH}")
    print(f"[AquaSynapse ML] Feature importances: {dict(zip(FEATURE_COLS, model.feature_importances_.tolist()))}")
    
    return model, scaler, le, acc

if __name__ == "__main__":
    train()
