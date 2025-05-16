import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { provinces } from '../configs/provinces.js';
import { weatherCodeToIcon, weatherCodeToDescription } from '../utils/weatherIconMap.js'
import './styles/Weather.css';
import useCurrentWeather from '../hooks/useCurrentWeather.js';

const initialProvince = provinces.find(p => p.names.en === 'Trang');

function Weather() {
  const { t, i18n } = useTranslation();
  const [selectedProvince, setSelectedProvince] = useState(initialProvince);

  // eslint-disable-next-line no-unused-vars
  const [weatherIcon, setWeatherIcon] = useState(null);

  const { weatherData, loading } = useCurrentWeather(selectedProvince.lat, selectedProvince.lon)

  useEffect(() => {
    let mounted = true;
    let watchId = null;

    const getLocation = async () => {
      if (navigator.geolocation) {
        try {
          // ขอสิทธิ์การเข้าถึง location
          const position = await new Promise((resolve, reject) => {
            watchId = navigator.geolocation.watchPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            });
          });

          if (!mounted) return;

          const { latitude, longitude } = position.coords;
          console.log('Updated position:', { latitude, longitude });

          const province = provinces.find(p => (
            (p.lat - 0.5 <= latitude && latitude <= p.lat + 0.5) &&
            (p.lon - 0.5 <= longitude && longitude <= p.lon + 0.5)
          ));

          if (province && mounted) {
            console.log('Found province:', province.names.en);
            setSelectedProvince(province);
          } else {
            setSelectedProvince(initialProvince);
          }

        } catch (error) {
          console.error("Location error:", error);
          if (mounted) {
            setSelectedProvince(initialProvince);
          }
        }
      } else {
        console.log('Geolocation not supported');
        if (mounted) {
          setSelectedProvince(initialProvince);
        }
      }
    };

    getLocation();

    return () => {
      mounted = false;
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []); // Remove initialProvince from dependency array

  useEffect(() => {
    if (!weatherData?.current) return;
    const icon = weatherCodeToIcon(
      weatherData.current.weather_code,
      weatherData.current.is_day === 1
    );
    console.log('Weather Data:', weatherData.current);
    console.log('Icon:', icon);
    setWeatherIcon(icon);
  }, [weatherData]);


  const getFormattedDate = () => {
    const date = new Date();

    if (i18n.language === 'th') {
      // ภาษาไทย: ไม่มี ,
      return date.toLocaleDateString('th-TH', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } else {
      // ภาษาอังกฤษ: แทรก ,
      const formatted = date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      // เพิ่ม , หลัง weekday ด้วย split
      const parts = formatted.split(' ');
      return `${parts[0]}, ${parts.slice(1).join(' ')}`;
    }
  };
  const formattedDate = getFormattedDate();


  if (loading) return <div>Loading...</div>;

  return (
    <div className='weather-container'>
      <div className='container'>
        <div className='container-lacationDate'>
          <div className='container-blank'>
            {t('aqi.Good')}
          </div>

          <div className='container-location'>
            <h2>
              {selectedProvince.names[i18n.language === 'th' ? 'th' : 'en']}
            </h2>
          </div>
          <div className='container-date'>{formattedDate}</div>
        </div>



        <div className='container-forecastAql'>
          <div className='container-forecast'>
            <div className='forecast-box-I'>

              <div className='temp-box'>
                <div className='icon-weather'>
                  {weatherIcon && (
                    <img
                      src={require(`../assets/svg/${weatherIcon}.svg`).default}
                      alt={weatherCodeToDescription(weatherData.current.weather_code, i18n.language)}
                    />
                  )}
                </div>
                <div className='temp'>
                  {weatherData?.current?.temperature_2m}°C
                </div>
              </div>


              <div className='weather-condition'>
                {weatherData?.current && weatherCodeToDescription(weatherData.current.weather_code, i18n.language)}
              </div>

              <div className='temp-HL'>
                <div>{t('forecast.High')} : {weatherData?.daily?.temperature_2m_max?.[0]} °C</div>
                <div>{t('forecast.Low')} : {weatherData?.daily?.temperature_2m_min?.[0]} °C</div>
                
              </div>
              <div className='feels-like'>
                {t('forecast.FeelsLike')} : {weatherData?.current?.apparent_temperature} °C</div>
            </div>

            <div className='forecast-box-II'>
              sss
            </div>

          </div>




          <div className='container-aqi'>
            <div className='aqi-box-I'>
              aaa
            </div>
            <div className='aqi-box-II'>
              sss
            </div>
          </div>


        </div>

        <div className='container-weeklyForecast'>
          พยากรณ์อากาศรายสัปดาห์ (Weekly): dddd
        </div>
      </div>
    </div>
  );
}

export default Weather;
