import React, { useState } from 'react';
import { useSound } from '../../hooks/useSound';
import { mysteryEngine } from '../../mystery/mysteryEngine';

interface WeatherCity {
  name: string;
  temp: number;
  condition: 'Sunny' | 'Rain' | 'Storm' | 'Fog' | 'Snow' | 'Unknown';
  humidity: number;
  wind: number;
  forecast: Array<{ day: string; temp: number; icon: string }>;
}

const CITIES: Record<string, WeatherCity> = {
  'Bengaluru': {
    name: 'Bengaluru',
    temp: 26,
    condition: 'Sunny',
    humidity: 58,
    wind: 14,
    forecast: [
      { day: 'Mon', temp: 26, icon: '☀️' },
      { day: 'Tue', temp: 27, icon: '⛅' },
      { day: 'Wed', temp: 25, icon: '🌧️' },
      { day: 'Thu', temp: 26, icon: '☀️' },
      { day: 'Fri', temp: 28, icon: '☀️' },
    ]
  },
  'London': {
    name: 'London',
    temp: 14,
    condition: 'Fog',
    humidity: 82,
    wind: 19,
    forecast: [
      { day: 'Mon', temp: 14, icon: '🌫️' },
      { day: 'Tue', temp: 13, icon: '🌧️' },
      { day: 'Wed', temp: 15, icon: '⛅' },
      { day: 'Thu', temp: 12, icon: '🌧️' },
      { day: 'Fri', temp: 14, icon: '⛅' },
    ]
  },
  'New York': {
    name: 'New York',
    temp: 18,
    condition: 'Rain',
    humidity: 74,
    wind: 22,
    forecast: [
      { day: 'Mon', temp: 18, icon: '🌧️' },
      { day: 'Tue', temp: 20, icon: '⛅' },
      { day: 'Wed', temp: 22, icon: '☀️' },
      { day: 'Thu', temp: 19, icon: '🌧️' },
      { day: 'Fri', temp: 17, icon: '⛅' },
    ]
  },
  'Tokyo': {
    name: 'Tokyo',
    temp: 21,
    condition: 'Sunny',
    humidity: 62,
    wind: 10,
    forecast: [
      { day: 'Mon', temp: 21, icon: '☀️' },
      { day: 'Tue', temp: 22, icon: '☀️' },
      { day: 'Wed', temp: 19, icon: '🌧️' },
      { day: 'Thu', temp: 20, icon: '⛅' },
      { day: 'Fri', temp: 23, icon: '☀️' },
    ]
  },
  'Sydney': {
    name: 'Sydney',
    temp: 24,
    condition: 'Storm',
    humidity: 80,
    wind: 35,
    forecast: [
      { day: 'Mon', temp: 24, icon: '⛈️' },
      { day: 'Tue', temp: 21, icon: '🌧️' },
      { day: 'Wed', temp: 23, icon: '⛅' },
      { day: 'Thu', temp: 25, icon: '☀️' },
      { day: 'Fri', temp: 26, icon: '☀️' },
    ]
  },
  'Sector 7': {
    name: 'Sector 7 [CLASSIFIED]',
    temp: -99,
    condition: 'Unknown',
    humidity: 0,
    wind: 0,
    forecast: [
      { day: 'ERR', temp: 0, icon: '❓' },
      { day: 'ERR', temp: 0, icon: '⚠️' },
      { day: 'ERR', temp: 0, icon: '⬛' },
      { day: 'ERR', temp: 0, icon: '⚡' },
      { day: 'ERR', temp: 0, icon: '❓' },
    ]
  }
};

export default function Weather() {
  const { playClick, playNotification } = useSound();
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const city = CITIES[selectedCity] || CITIES['Bengaluru'];

  const handleCityChange = (cityName: string) => {
    playClick();
    setSelectedCity(cityName);
    if (cityName === 'Sector 7') {
      playNotification();
      mysteryEngine.recordSecretFound('weather_sector_7');
    }
  };

  const getConditionEmoji = (c: string) => {
    switch (c) {
      case 'Sunny': return '☀️';
      case 'Rain': return '🌧️';
      case 'Storm': return '⛈️';
      case 'Fog': return '🌫️';
      case 'Snow': return '❄️';
      case 'Unknown': return '🌌';
      default: return '⛅';
    }
  };

  return (
    <div style={{
      backgroundColor: '#c0c0c0',
      padding: '10px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      fontSize: '12px'
    }}>
      {/* Top Bar / City Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #808080', paddingBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <strong>🛰️ Location:</strong>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            style={{ padding: '2px 4px', fontSize: '11px', border: '2px inset #ffffff' }}
          >
            {Object.keys(CITIES).map(k => (
              <option key={k} value={k}>{CITIES[k].name}</option>
            ))}
          </select>
        </div>
        <span style={{ fontSize: '10px', color: '#555' }}>NOVA Weather Satellite 98</span>
      </div>

      {/* Main Weather Display Card */}
      <div style={{
        backgroundColor: city.condition === 'Unknown' ? '#000033' : '#316ac5',
        color: '#ffffff',
        border: '2px inset #ffffff',
        padding: '16px',
        borderRadius: '2px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        boxShadow: 'inset 1px 1px 4px rgba(0,0,0,0.4)'
      }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>{city.name}</h2>
          <div style={{ fontSize: '14px', color: city.condition === 'Unknown' ? '#ff00ff' : '#ffff00', fontWeight: 'bold' }}>
            {city.condition.toUpperCase()}
          </div>
          <div style={{ fontSize: '11px', marginTop: '6px', opacity: 0.9 }}>
            HUMIDITY: {city.humidity}% • WIND: {city.wind} km/h
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '48px', lineHeight: 1 }}>{getConditionEmoji(city.condition)}</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', fontFamily: 'monospace', marginTop: '4px' }}>
            {city.condition === 'Unknown' ? '???°C' : `${city.temp}°C`}
          </div>
        </div>
      </div>

      {city.condition === 'Unknown' && (
        <div style={{ backgroundColor: '#ffdddd', border: '1px solid #cc0000', padding: '8px', marginBottom: '8px', color: '#cc0000', fontSize: '11px' }}>
          ⚠️ <strong>TELEMETRY SIGNAL ANOMALY:</strong> Atmospheric readings corrupt. Signals originate from a subterranean terminal under NOVA Facility 1998.
        </div>
      )}

      {/* 5-Day Forecast Grid */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', border: '2px inset #dfdfdf', padding: '8px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#000080' }}>
          5-Day Forecast:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', textAlign: 'center' }}>
          {city.forecast.map((f, i) => (
            <div key={i} style={{ border: '1px solid #e0e0e0', padding: '6px 2px', backgroundColor: '#f9f9f9', borderRadius: '2px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#333' }}>{f.day}</div>
              <div style={{ fontSize: '24px', margin: '4px 0' }}>{f.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#000080' }}>
                {city.condition === 'Unknown' ? '??' : `${f.temp}°C`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
