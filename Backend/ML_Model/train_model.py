import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib

print(" Step 1: Reading cStick.csv Dataset")
df = pd.read_csv('cStick.csv')

# Strip trailing spaces from all column names in the CSV header
df.columns = df.columns.str.strip()

print("\n🔍 Detected Clean Column Names in CSV:")
print(list(df.columns))

# Verify if 'Decision' or 'decision' or similar is present
target_column = 'Decision' if 'Decision' in df.columns else 'decision'

print("\n Sample Data Loaded:")
print(df[['HRV', 'Sugar level', 'SpO2', target_column]].head(3))

# Step 2: Extract target features and risk decision label
feature_columns = ['HRV', 'Sugar level', 'SpO2']

X = df[feature_columns]
y = df[target_column]

print("\n Step 2: Splitting Data (80% Training, 20% Testing)...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\n🧠 Step 3: Training Random Forest Model on HRV, Sugar level, and SpO2...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

print("\n📊 Step 4: Model Evaluation...")
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"🎯 Accuracy Score: {accuracy * 100:.2f}%")

print("\n--- Detailed Classification Performance ---")
print(classification_report(y_test, y_pred))

print("\n--- Confusion Matrix ---")
print(confusion_matrix(y_test, y_pred))

print("\n Step 5: Exporting Trained Model...")
joblib.dump(model, 'fall_risk_model.joblib')
print("🎉 SUCCESS! Trained classifier saved as 'fall_risk_model.joblib'")