import * as tf from '@tensorflow/tfjs';
import { diseaseLabels, symptomNames } from './trainingData.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let model = null;

// Load the trained model
export async function loadModel() {
  if (model) {
    return model;
  }

  try {
    const fs = await import('fs');
    const modelPath = join(__dirname, 'saved-model', 'model.json');

    // Read the saved model JSON
    const modelData = JSON.parse(fs.readFileSync(modelPath, 'utf-8'));

    // Parse the model topology (it's stored as a string)
    const topology = typeof modelData.modelTopology === 'string'
      ? JSON.parse(modelData.modelTopology)
      : modelData.modelTopology;

    // Recreate the model from topology
    model = await tf.models.modelFromJSON(topology);

    // Load weights
    const weights = modelData.weightsData.map(w => {
      return tf.tensor(w.data, w.shape);
    });
    model.setWeights(weights);

    console.log('✅ TensorFlow model loaded successfully');
    return model;
  } catch (error) {
    console.error('❌ Error loading TensorFlow model:', error.message);
    throw new Error('TensorFlow model not found. Please train the model first by running: node ml/trainModel.js');
  }
}

// Predict disease based on symptoms
export async function predictDisease(selectedSymptoms) {
  try {
    // Ensure model is loaded
    if (!model) {
      await loadModel();
    }

    // Create 132-element array, all initialized to 0
    const symptomsArray = new Array(132).fill(0);

    // Map selected symptoms to their positions in the array
    selectedSymptoms.forEach(symptom => {
      const index = symptomNames.indexOf(symptom);
      if (index !== -1) {
        symptomsArray[index] = 1;
      } else {
        console.warn(`⚠️  Unknown symptom: "${symptom}"`);
      }
    });

    console.log(`🔍 Input: ${selectedSymptoms.length} symptoms selected`);
    console.log(`   Symptoms: ${selectedSymptoms.join(', ')}`);

    // Make prediction
    const inputTensor = tf.tensor2d([symptomsArray]);
    const prediction = model.predict(inputTensor);
    const probabilities = await prediction.data();

    // Clean up tensors
    inputTensor.dispose();
    prediction.dispose();

    // Format results
    const results = diseaseLabels.map((disease, index) => ({
      disease,
      confidence: probabilities[index]
    }));

    // Sort by confidence (highest first)
    results.sort((a, b) => b.confidence - a.confidence);

    console.log('🔬 TensorFlow Prediction Results:');
    results.slice(0, 5).forEach((result, idx) => {
      console.log(`  ${idx + 1}. ${result.disease}: ${(result.confidence * 100).toFixed(2)}%`);
    });

    // Return top 3 predictions
    return results.slice(0, 3);

  } catch (error) {
    console.error('❌ Error making prediction:', error);
    throw error;
  }
}
