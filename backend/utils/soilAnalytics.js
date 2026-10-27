/**
 * Soil Health & Nutrient Analysis Engine
 * Calculates soil condition and prescribes organic and chemical amendments
 */

export const analyzeSoil = (metrics = {}) => {
  const {
    ph = 6.8,
    moisture = 45,
    nitrogen = 120, // kg/ha (ideal ~ 140 - 280)
    phosphorus = 30, // kg/ha (ideal ~ 25 - 50)
    potassium = 160, // kg/ha (ideal ~ 150 - 300)
    organicCarbon = 0.65, // % (ideal > 0.75%)
  } = metrics;

  const recommendations = [];
  let soilQualityScore = 100;

  // pH Evaluation
  let phStatus = 'Optimal';
  if (ph < 6.0) {
    phStatus = 'Acidic';
    soilQualityScore -= 15;
    recommendations.push({
      category: 'pH Correction',
      message: `Soil pH (${ph}) is acidic. Apply Agricultural Lime (Calcium Carbonate) or Dolomite @ 250-400 kg/acre to neutralize acidity.`,
      severity: ph < 5.5 ? 'urgent' : 'warning',
    });
  } else if (ph > 7.8) {
    phStatus = 'Alkaline / Saline';
    soilQualityScore -= 15;
    recommendations.push({
      category: 'pH Correction',
      message: `Soil pH (${ph}) is alkaline. Incorporate Gypsum (Calcium Sulfate) @ 300-500 kg/acre and green manuring (Dhaincha/Sunn hemp).`,
      severity: ph > 8.5 ? 'urgent' : 'warning',
    });
  }

  // Moisture Evaluation
  let moistureStatus = 'Adequate';
  if (moisture < 35) {
    moistureStatus = 'Low Moisture';
    soilQualityScore -= 10;
    recommendations.push({
      category: 'Water Management',
      message: `Soil moisture level is low (${moisture}%). Schedule drip irrigation or furrow watering within next 24-48 hours. Consider mulching to conserve moisture.`,
      severity: moisture < 20 ? 'urgent' : 'warning',
    });
  } else if (moisture > 80) {
    moistureStatus = 'Waterlogged';
    soilQualityScore -= 10;
    recommendations.push({
      category: 'Drainage Alert',
      message: `High moisture (${moisture}%) can lead to root asphyxiation and damping off. Ensure field drainage channels are clear.`,
      severity: 'warning',
    });
  }

  // Nitrogen (N)
  let nStatus = 'Medium';
  if (nitrogen < 100) {
    nStatus = 'Deficient';
    soilQualityScore -= 15;
    recommendations.push({
      category: 'Nitrogen Amendment',
      message: `Nitrogen level is deficient (${nitrogen} kg/ha). Apply Urea @ 45 kg/acre or top-dress with Vermicompost (2 tonnes/acre) & Azotobacter biofertilizer.`,
      severity: 'warning',
    });
  } else if (nitrogen > 300) {
    nStatus = 'Excessive';
    recommendations.push({
      category: 'Nitrogen Regulation',
      message: `Excessive Nitrogen (${nitrogen} kg/ha). Pause urea applications to avoid succulent vegetative growth prone to fungal diseases and lodging.`,
      severity: 'info',
    });
  }

  // Phosphorus (P)
  let pStatus = 'Medium';
  if (phosphorus < 20) {
    pStatus = 'Deficient';
    soilQualityScore -= 10;
    recommendations.push({
      category: 'Phosphorus Boost',
      message: `Phosphorus is low (${phosphorus} kg/ha). Apply Single Super Phosphate (SSP) @ 50 kg/acre or Di-Ammonium Phosphate (DAP) during basal dressing. Inoculate with PSB (Phosphate Solubilizing Bacteria).`,
      severity: 'warning',
    });
  }

  // Potassium (K)
  let kStatus = 'Medium';
  if (potassium < 140) {
    kStatus = 'Deficient';
    soilQualityScore -= 10;
    recommendations.push({
      category: 'Potassium Nutrition',
      message: `Potassium is low (${potassium} kg/ha). Apply Muriate of Potash (MOP) @ 25 kg/acre or apply wood ash to boost drought resistance and grain weight.`,
      severity: 'warning',
    });
  }

  // Organic Carbon
  let carbonStatus = 'Good';
  if (organicCarbon < 0.5) {
    carbonStatus = 'Poor';
    soilQualityScore -= 15;
    recommendations.push({
      category: 'Organic Matter',
      message: `Soil organic carbon is low (${organicCarbon}%). Apply Farm Yard Manure (FYM) @ 4-5 tonnes/acre before primary tillage.`,
      severity: 'warning',
    });
  }

  // Suitable Crops based on pH and conditions
  const suitableCrops = [];
  if (ph >= 6.0 && ph <= 7.5) {
    suitableCrops.push('Wheat', 'Rice (Paddy)', 'Soybean', 'Maize', 'Tomato', 'Mustard');
  } else if (ph < 6.0) {
    suitableCrops.push('Potato', 'Tea', 'Sweet Potato', 'Rye');
  } else {
    suitableCrops.push('Cotton', 'Barley', 'Sugarbeet', 'Mustard');
  }

  return {
    soilQualityScore: Math.max(25, soilQualityScore),
    phStatus,
    moistureStatus,
    nStatus,
    pStatus,
    kStatus,
    carbonStatus,
    suitableCrops,
    recommendations,
  };
};
