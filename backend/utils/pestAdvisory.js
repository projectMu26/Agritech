/**
 * Pest & Disease Intelligence Engine
 * Predicts risk based on weather parameters and crop vulnerability.
 */

export const analyzePestRisk = (cropName = 'Wheat', weather = {}) => {
  const { temperature = 26, humidity = 70, rainfall = 0 } = weather;
  const alerts = [];

  const crop = cropName.toLowerCase();

  // Fungal diseases thrive in high humidity (>75%) and moderate-to-warm temperatures (20-30°C)
  if (humidity >= 75 && temperature >= 18 && temperature <= 30) {
    if (crop.includes('potato') || crop.includes('tomato')) {
      alerts.push({
        pestName: 'Late Blight (Phytophthora infestans)',
        riskLevel: humidity > 85 ? 'Critical' : 'High',
        symptoms: 'Water-soaked spots on leaves turning brown-black with white fungal growth underneath.',
        preventativeMeasure: 'Avoid overhead irrigation. Ensure row spacing for air circulation.',
        organicTreatment: 'Spray Copper oxychloride (3g/L) or Trichoderma viride biological culture.',
        chemicalTreatment: 'Mancozeb 75% WP @ 2.5g/L or Metalaxyl + Mancozeb @ 2g/L.',
      });
    } else if (crop.includes('wheat') || crop.includes('barley')) {
      alerts.push({
        pestName: 'Yellow / Brown Rust (Puccinia spp.)',
        riskLevel: 'Moderate',
        symptoms: 'Yellowish orange or brown pustules forming lines on the leaf blades.',
        preventativeMeasure: 'Use rust-resistant seeds (e.g., HD-2967, DBW-187). Avoid excessive nitrogen.',
        organicTreatment: 'Neem seed kernel extract (5%) spray.',
        chemicalTreatment: 'Propiconazole 25% EC @ 1ml/L at initial signs.',
      });
    } else if (crop.includes('rice') || crop.includes('paddy')) {
      alerts.push({
        pestName: 'Blast Disease (Magnaporthe oryzae)',
        riskLevel: humidity > 80 ? 'High' : 'Moderate',
        symptoms: 'Spindle-shaped spots on leaves with greyish center and brownish margins.',
        preventativeMeasure: 'Balanced fertilizer management; do not over-apply urea.',
        organicTreatment: 'Pseudomonas fluorescens seed treatment and foliar spray @ 5g/L.',
        chemicalTreatment: 'Tricyclazole 75% WP @ 0.6g/L water.',
      });
    }
  }

  // Sucking pests (Aphids, Thrips, Whiteflies, Mites) flourish in warm, dry spells
  if (temperature >= 27 && humidity < 60) {
    alerts.push({
      pestName: 'Aphids & Whiteflies Infestation',
      riskLevel: temperature > 32 ? 'High' : 'Moderate',
      symptoms: 'Curling leaves, sticky honeydew on foliage, stunted growth and sooty mold.',
      preventativeMeasure: 'Install yellow sticky traps (15-20 traps per acre). Maintain field sanitation.',
      organicTreatment: 'Neem oil spray (10,000 ppm) @ 3ml/L with mild soap water.',
      chemicalTreatment: 'Imidacloprid 17.8% SL @ 0.5ml/L or Acetamiprid 20% SP @ 0.3g/L.',
    });
  }

  // Stem borer / Fall Armyworm in Maize, Rice, Sugarcane
  if (crop.includes('maize') || crop.includes('corn')) {
    alerts.push({
      pestName: 'Fall Armyworm (Spodoptera frugiperda)',
      riskLevel: 'Moderate',
      symptoms: 'Shot holes on leaves and severe whorl damage with sawdust-like frass.',
      preventativeMeasure: 'Intercrop with cowpea or pulses; install pheromone traps.',
      organicTreatment: 'Release egg parasitoid Trichogramma pretiosum or spray Bacillus thuringiensis (Bt).',
      chemicalTreatment: 'Chlorantraniliprole 18.5% SC @ 0.4ml/L or Emamectin Benzoate 5% SG @ 0.4g/L.',
    });
  }

  // General preventative advisory if no major risk detected
  if (alerts.length === 0) {
    alerts.push({
      pestName: 'General Field Health (Low Pest Risk)',
      riskLevel: 'Low',
      symptoms: 'No severe pest outbreak conditions detected under current microclimate.',
      preventativeMeasure: 'Regular weekly field scouting. Keep borders weed-free.',
      organicTreatment: 'Preventative neem cake application in soil.',
      chemicalTreatment: 'Not required at this stage.',
    });
  }

  return alerts;
};
