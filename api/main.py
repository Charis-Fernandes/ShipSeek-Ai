# shipseek_api/main.py

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from PIL import Image
import io
import tensorflow as tf
import base64

app = FastAPI()

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your pre-trained U-Net model with custom object scope
try:
    model = tf.keras.models.load_model(
        "model/ship.h5",
        compile=False  # Load without compilation to avoid optimizer issues
    )
    # Recompile the model with current optimizer version
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
except Exception as e:
    print(f"Error loading model: {e}")
    raise

# Preprocessing function to match training pipeline
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((768, 768))
    image_array = np.array(image) / 255.0
    return np.expand_dims(image_array, axis=0)

# Postprocessing to get a mask overlay and confidence score
def postprocess_mask(prediction):
    # Get the raw predictions
    pred_mask = prediction[0, :, :, 0]
    
    # Calculate confidence score (average probability in detected regions)
    detected_regions = pred_mask > 0.5
    if np.any(detected_regions):
        confidence = float(np.mean(pred_mask[detected_regions]) * 100)
    else:
        confidence = 0.0
    
    # Convert to binary mask
    binary_mask = (pred_mask > 0.5).astype(np.uint8) * 255
    mask_image = Image.fromarray(binary_mask)
    
    return mask_image, confidence

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    preprocessed = preprocess_image(contents)
    prediction = model.predict(preprocessed)
    mask_image, confidence = postprocess_mask(prediction)

    # Convert mask to base64
    buffer = io.BytesIO()
    mask_image.save(buffer, format="PNG")
    buffer.seek(0)
    mask_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return {
        "filename": file.filename,
        "mask_base64": mask_base64,
        "confidence": confidence
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
