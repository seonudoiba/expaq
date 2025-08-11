import { apiClient } from '@/lib/api/client';

export interface WeatherData {
  coord?: { lon: number; lat: number };
  weather?: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main?: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind?: {
    speed: number;
    deg: number;
  };
  name?: string;
  _note?: string;
}

export interface WeatherForecast {
  city?: { name: string };
  list?: Array<{
    dt_txt: string;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
  }>;
  _note?: string;
}

export interface WeatherRecommendation {
  location: string;
  weather: WeatherData;
  recommendations: {
    suitability: 'excellent' | 'good' | 'fair' | 'poor';
    recommendation: string;
    temperature: number;
    humidity: number;
    status?: string;
    message?: string;
  };
  timestamp: string;
  _note?: string;
}

export interface WeatherParams {
  city: string;
  country?: string;
  units?: 'metric' | 'imperial' | 'kelvin';
}

export interface WeatherRecommendationParams extends WeatherParams {
  activityType?: string;
}

export const weatherService = {
  /**
   * Get current weather for a location
   */
  getCurrentWeather: async (params: WeatherParams): Promise<WeatherData> => {
    try {
      const { city, country, units = 'metric' } = params;
      const queryParams = new URLSearchParams({
        city,
        units,
      });
      
      if (country) {
        queryParams.append('country', country);
      }

      const response = await apiClient.get<WeatherData>(`/api/weather/current?${queryParams}`);
      console.log('Current weather response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return {
        main: { temp: 22.5, feels_like: 23.1, temp_min: 20.0, temp_max: 25.0, pressure: 1013, humidity: 65 },
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
        name: params.city,
        _note: "Fallback data - weather service unavailable"
      };
    }
  },

  /**
   * Get weather forecast for a location
   */
  getWeatherForecast: async (params: WeatherParams): Promise<WeatherForecast> => {
    try {
      const { city, country, units = 'metric' } = params;
      const queryParams = new URLSearchParams({
        city,
        units,
      });
      
      if (country) {
        queryParams.append('country', country);
      }

      const response = await apiClient.get<WeatherForecast>(`/api/weather/forecast?${queryParams}`);
      console.log('Weather forecast response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return {
        city: { name: params.city },
        list: [
          {
            dt_txt: "2024-06-29 12:00:00",
            main: { temp: 23.0, humidity: 60 },
            weather: [{ main: "Clear", description: "clear sky" }]
          },
          {
            dt_txt: "2024-06-30 12:00:00",
            main: { temp: 25.0, humidity: 55 },
            weather: [{ main: "Clouds", description: "partly cloudy" }]
          }
        ],
        _note: "Fallback data - weather service unavailable"
      };
    }
  },

  /**
   * Get weather-based activity recommendations
   */
  getActivityWeatherRecommendation: async (params: WeatherRecommendationParams): Promise<WeatherRecommendation> => {
    try {
      const { city, country, activityType } = params;
      const queryParams = new URLSearchParams({
        city,
      });
      
      if (country) {
        queryParams.append('country', country);
      }
      
      if (activityType) {
        queryParams.append('activityType', activityType);
      }

      const response = await apiClient.get<WeatherRecommendation>(`/api/weather/activity-recommendation?${queryParams}`);
      console.log('Weather recommendation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather recommendations:', error);
      return {
        location: params.city,
        weather: {
          main: { temp: 22.5, feels_like: 23.1, temp_min: 20.0, temp_max: 25.0, pressure: 1013, humidity: 65 },
          weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
          name: params.city,
        },
        recommendations: {
          suitability: 'good',
          recommendation: 'Good weather for outdoor activities',
          temperature: 22.5,
          humidity: 65
        },
        timestamp: new Date().toISOString(),
        _note: "Fallback data - weather service unavailable"
      };
    }
  },

  /**
   * Helper function to get weather suitability color
   */
  getSuitabilityColor: (suitability: string): string => {
    switch (suitability) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  },

  /**
   * Helper function to format temperature
   */
  formatTemperature: (temp: number, units: string = 'metric'): string => {
    const unit = units === 'metric' ? '°C' : units === 'imperial' ? '°F' : 'K';
    return `${Math.round(temp)}${unit}`;
  },
};

export default weatherService;