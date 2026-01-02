import { predictDisease } from './diseasePrediction.js';

// Test Case 1: Fungal infection symptoms
const fungalSymptoms = [
  'itching',
  'skin_rash',
  'nodal_skin_eruptions',
  'dischromic _patches'
];

// Test Case 2: Common Cold symptoms
const coldSymptoms = [
  'continuous_sneezing',
  'runny_nose',
  'congestion',
  'throat_irritation',
  'headache'
];

// Test Case 3: Diabetes symptoms
const diabetesSymptoms = [
  'fatigue',
  'weight_loss',
  'increased_appetite',
  'polyuria',
  'excessive_hunger'
];

async function runTests() {
  console.log('\n🧪 Testing TensorFlow Disease Prediction Service\n');
  console.log('='.repeat(60));

  // Test 1: Fungal infection symptoms
  console.log('\n📋 Test 1: Fungal Infection Symptoms');
  console.log('Input:', fungalSymptoms);
  const fungalPredictions = await predictDisease(fungalSymptoms);
  console.log('\nTop 3 Predictions:');
  fungalPredictions.forEach((pred, idx) => {
    console.log(`  ${idx + 1}. ${pred.disease}: ${(pred.confidence * 100).toFixed(2)}%`);
  });

  console.log('\n' + '='.repeat(60));

  // Test 2: Common Cold symptoms
  console.log('\n📋 Test 2: Common Cold Symptoms');
  console.log('Input:', coldSymptoms);
  const coldPredictions = await predictDisease(coldSymptoms);
  console.log('\nTop 3 Predictions:');
  coldPredictions.forEach((pred, idx) => {
    console.log(`  ${idx + 1}. ${pred.disease}: ${(pred.confidence * 100).toFixed(2)}%`);
  });

  console.log('\n' + '='.repeat(60));

  // Test 3: Diabetes symptoms
  console.log('\n📋 Test 3: Diabetes Symptoms');
  console.log('Input:', diabetesSymptoms);
  const diabetesPredictions = await predictDisease(diabetesSymptoms);
  console.log('\nTop 3 Predictions:');
  diabetesPredictions.forEach((pred, idx) => {
    console.log(`  ${idx + 1}. ${pred.disease}: ${(pred.confidence * 100).toFixed(2)}%`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ All tests completed successfully!\n');
}

runTests().catch(console.error);
