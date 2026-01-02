import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * STEP 1: Parse CSV file
 * Reads the Testing.csv file and converts it to JavaScript arrays
 */
function parseCSV(filePath) {
  console.log('\n📂 STEP 1: Reading CSV file...');

  const csvContent = fs.readFileSync(filePath, 'utf-8');
  const lines = csvContent.trim().split('\n');

  // Extract header (symptom names)
  const header = lines[0].split(',');
  const symptomNames = header.slice(0, -1); // All columns except last (prognosis)
  const numSymptoms = symptomNames.length;

  console.log(`   ✓ Found ${numSymptoms} symptoms`);
  console.log(`   ✓ Symptoms include: ${symptomNames.slice(0, 5).join(', ')}...`);

  // Extract data rows
  const dataRows = lines.slice(1); // Skip header
  console.log(`   ✓ Found ${dataRows.length} disease samples\n`);

  return { header, symptomNames, dataRows };
}

/**
 * STEP 2: Extract unique disease labels
 * Gets all unique disease names from the dataset
 */
function extractDiseaseLabels(dataRows) {
  console.log('🏥 STEP 2: Extracting disease labels...');

  const diseaseSet = new Set();

  dataRows.forEach(row => {
    const columns = row.split(',');
    const disease = columns[columns.length - 1].trim();
    diseaseSet.add(disease);
  });

  const diseaseLabels = Array.from(diseaseSet);
  console.log(`   ✓ Found ${diseaseLabels.length} unique diseases`);
  console.log(`   ✓ Diseases: ${diseaseLabels.slice(0, 5).join(', ')}...\n`);

  return diseaseLabels;
}

/**
 * STEP 3: Convert to TensorFlow format
 * Creates input vectors (symptoms) and output vectors (one-hot encoded diseases)
 */
function convertToTensorFlowFormat(dataRows, symptomNames, diseaseLabels) {
  console.log('🔄 STEP 3: Converting to TensorFlow format...');

  const inputs = [];
  const outputs = [];

  dataRows.forEach((row, index) => {
    const columns = row.split(',').map(val => val.trim());

    // Extract symptom values (all columns except last)
    const symptomValues = columns.slice(0, symptomNames.length).map(Number);
    inputs.push(symptomValues);

    // Extract disease label (last column)
    const disease = columns[columns.length - 1];

    // Create one-hot encoded output
    const oneHot = new Array(diseaseLabels.length).fill(0);
    const diseaseIndex = diseaseLabels.indexOf(disease);
    oneHot[diseaseIndex] = 1;
    outputs.push(oneHot);

    if ((index + 1) % 10 === 0) {
      console.log(`   ✓ Processed ${index + 1}/${dataRows.length} samples`);
    }
  });

  console.log(`   ✓ Created ${inputs.length} input vectors`);
  console.log(`   ✓ Created ${outputs.length} output vectors\n`);

  return { inputs, outputs };
}

/**
 * STEP 4: Generate JavaScript file
 * Writes the training data to a .js file that TensorFlow can use
 */
function generateTrainingDataFile(symptomNames, diseaseLabels, inputs, outputs, outputPath) {
  console.log('💾 STEP 4: Generating trainingData.js file...');

  // Format arrays in a more compact, readable way
  const formatArrayCompact = (arr) => {
    return '[\n  ' + arr.map(item => JSON.stringify(item)).join(',\n  ') + '\n]';
  };

  const fileContent = `// Auto-generated from Testing.csv
// Generated on: ${new Date().toISOString()}
// Total samples: ${inputs.length}
// Total symptoms: ${symptomNames.length}
// Total diseases: ${diseaseLabels.length}

// All ${symptomNames.length} symptom names from the dataset
export const symptomNames = ${formatArrayCompact(symptomNames)};

// All ${diseaseLabels.length} disease labels
export const diseaseLabels = ${formatArrayCompact(diseaseLabels)};

export const trainingData = {
  // Input: ${inputs.length} samples, each with ${symptomNames.length} symptom values (0 or 1)
  inputs: ${formatArrayCompact(inputs)},

  // Output: One-hot encoded disease labels
  // Each array has ${diseaseLabels.length} elements, one for each disease
  outputs: ${formatArrayCompact(outputs)}
};
`;

  fs.writeFileSync(outputPath, fileContent);

  const fileSizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
  console.log(`   ✓ File generated: ${outputPath}`);
  console.log(`   ✓ File size: ${fileSizeKB} KB\n`);
}

/**
 * STEP 5: Display statistics
 * Shows summary of the conversion process
 */
function displayStatistics(symptomNames, diseaseLabels, inputs) {
  console.log('📊 STEP 5: Conversion Summary');
  console.log('='.repeat(60));
  console.log(`   Input Features:  ${symptomNames.length} symptoms`);
  console.log(`   Output Classes:  ${diseaseLabels.length} diseases`);
  console.log(`   Training Samples: ${inputs.length} cases`);
  console.log(`   Data Format:     Binary (0/1)`);
  console.log('='.repeat(60));
  console.log('\n✅ Conversion completed successfully!\n');
  console.log('📝 Next steps:');
  console.log('   1. Review the generated trainingData.js file');
  console.log('   2. Run: node ml/trainModel.js');
  console.log('   3. Update GraphQL schema with new symptoms\n');
}

/**
 * Main conversion function
 */
function convertCSVToTrainingData() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 CSV to TensorFlow Training Data Converter');
  console.log('='.repeat(60));

  // File paths
  const csvPath = join(__dirname, 'prediction-datas', 'Testing.csv');
  const outputPath = join(__dirname, 'trainingData.js');

  // Execute conversion steps
  const { header, symptomNames, dataRows } = parseCSV(csvPath);
  const diseaseLabels = extractDiseaseLabels(dataRows);
  const { inputs, outputs } = convertToTensorFlowFormat(dataRows, symptomNames, diseaseLabels);
  generateTrainingDataFile(symptomNames, diseaseLabels, inputs, outputs, outputPath);
  displayStatistics(symptomNames, diseaseLabels, inputs);
}

// Run the converter
convertCSVToTrainingData();
