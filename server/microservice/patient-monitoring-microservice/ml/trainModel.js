import * as tf from '@tensorflow/tfjs';
import { trainingData, diseaseLabels } from './trainingData.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Model architecture
function createModel() {
  const model = tf.sequential();

  // Input layer: 132 symptoms
  model.add(tf.layers.dense({
    inputShape: [132],
    units: 64,
    activation: 'relu',
    kernelInitializer: 'heNormal'
  }));

  // Hidden layer 1
  model.add(tf.layers.dropout({ rate: 0.3 })); // Prevent overfitting
  model.add(tf.layers.dense({
    units: 48,
    activation: 'relu'
  }));

  // Hidden layer 2
  model.add(tf.layers.dropout({ rate: 0.3 }));
  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu'
  }));

  // Hidden layer 3
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({
    units: 24,
    activation: 'relu'
  }));

  // Output layer: 41 diseases (one-hot encoded)
  model.add(tf.layers.dense({
    units: 41,
    activation: 'softmax' // For multi-class classification
  }));
  
  // Compile model
  model.compile({
    optimizer: tf.train.adam(0.001), // Adam optimizer with learning rate
    loss: 'categoricalCrossentropy', // For multi-class classification
    metrics: ['accuracy']
  });
  
  return model;
}

// Main training function
async function trainModel() {
  console.log('🚀 Starting TensorFlow model training...\n');
  
  // Convert training data to tensors 
  const xs = tf.tensor2d(trainingData.inputs);
  const ys = tf.tensor2d(trainingData.outputs);
  
  console.log('📊 Training data shape:');
  console.log('  Inputs:', xs.shape);
  console.log('  Outputs:', ys.shape);
  console.log(`  Total samples: ${trainingData.inputs.length}\n`);
  
  // Create model
  const model = createModel();
  
  console.log('🏗️  Model architecture:');
  model.summary();
  console.log();
  
  // Training configuration
  const epochs = 300;
  const batchSize = 8;
  
  console.log(`🎯 Training for ${epochs} epochs...\n`);
  
  // Train the model 
  const history = await model.fit(xs, ys, {
    epochs: epochs,
    batchSize: batchSize,
    shuffle: true,
    validationSplit: 0.2, // 20% for validation
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if ((epoch + 1) % 20 === 0) {
          console.log(
            `Epoch ${epoch + 1}/${epochs} - ` +
            `Loss: ${logs.loss.toFixed(4)} - ` +
            `Accuracy: ${(logs.acc * 100).toFixed(2)}% - ` +
            `Val Loss: ${logs.val_loss.toFixed(4)} - ` +
            `Val Accuracy: ${(logs.val_acc * 100).toFixed(2)}%`
          );
        }
      }
    }
  });
  
  console.log('\n✅ Training complete!\n');
  
  // Evaluate model
  const finalLoss = history.history.loss[history.history.loss.length - 1];
  const finalAcc = history.history.acc[history.history.acc.length - 1];
  
  console.log('📈 Final Training Metrics:');
  console.log(`  Loss: ${finalLoss.toFixed(4)}`);
  console.log(`  Accuracy: ${(finalAcc * 100).toFixed(2)}%\n`);
  
  // Save the model weights as JSON
  const modelPath = join(__dirname, 'saved-model');
  const fs = await import('fs');

  // Create directory if it doesn't exist
  if (!fs.existsSync(modelPath)) {
    fs.mkdirSync(modelPath, { recursive: true });
  }

  // Get model topology and weights
  const modelJSON = model.toJSON();
  const weights = await model.getWeights();
  const weightsData = weights.map(w => ({
    name: w.name,
    shape: w.shape,
    data: Array.from(w.dataSync())
  }));

  // Save model architecture
  fs.writeFileSync(
    join(modelPath, 'model.json'),
    JSON.stringify({ modelTopology: modelJSON, weightsData }, null, 2)
  );

  console.log(`💾 Model saved to: ${modelPath}\n`);
  
  // Test prediction with sample data
  console.log('🧪 Testing model with sample from training data:');
  const testSymptoms = trainingData.inputs[0]; // First sample (Fungal infection)
  const prediction = model.predict(tf.tensor2d([testSymptoms]));
  const probabilities = await prediction.data();

  console.log('  Input: First sample from dataset (should predict: Fungal infection)');
  console.log('  Predictions:');
  diseaseLabels.forEach((disease, index) => {
    console.log(`    ${disease}: ${(probabilities[index] * 100).toFixed(2)}%`);
  });
  
  // Cleanup tensors
  xs.dispose();
  ys.dispose();
  prediction.dispose();
  
  console.log('\n✨ Training script completed successfully!');
}

// Run training
trainModel().catch(console.error);
