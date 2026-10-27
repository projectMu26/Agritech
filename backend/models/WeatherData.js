import mongoose from 'mongoose';

const weatherDataSchema = new mongoose.Schema(
  {
    location: {
      city: { type: String, required: true },
      state: { type: String, default: '' },
      country: { type: String, default: 'India' },
      lat: Number,
      lng: Number,
    },
    temperature: Number, // Celsius
    feelsLike: Number,
    humidity: Number, // %
    windSpeed: Number, // km/h
    precipitation: Number, // mm
    condition: String, // 'Sunny', 'Rainy', 'Cloudy', 'Thunderstorm', etc.
    uvIndex: Number,
    soilTemp: Number,
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

export default WeatherData;
