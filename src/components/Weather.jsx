import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { provinces } from '../configs/provinces.js';
import { weatherCodeToIcon } from '../utils/weatherIconMap.js'
import './styles/Weather.css';
import useCurrentWeather from '../hooks/useCurrentWeather.js';

const initialProvince = provinces.find(p => p.names.en === 'Bangkok');

function Weather() {
  const { t, i18n } = useTranslation();
  const [selectedProvince, setSelectedProvince] = useState(initialProvince);
  
  // eslint-disable-next-line no-unused-vars
  const [weatherIcon, setWeatherIcon] = useState(null);

  const { weatherData, loading } = useCurrentWeather(selectedProvince.lat, selectedProvince.lon)

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            const province = provinces.find(p => (
              (p.lat - 0.5 <= latitude && latitude <= p.lat + 0.5) &&
              (p.lon - 0.5 <= longitude && longitude <= p.lon + 0.5)
            ));

            setSelectedProvince(province || initialProvince);
          },
          (error) => {
            console.error("Error getting location:", error);
            setSelectedProvince(initialProvince);
          }
        );
      } else {
        setSelectedProvince(initialProvince);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (!weatherData) return
    const icon = weatherCodeToIcon(weatherData.current.weather_code);
    console.log(' icon:', icon)
    setWeatherIcon(icon)
  }, [weatherData])


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
                  <img src={require('../assets/svg/wi-cloud.svg').default} alt='mySvgImage' />
                </div>
                <div className='temp'>

                </div>
              </div>


              <div className='weather-condition'> </div>
              <div className='temp-HL'></div>
              <div className='feels-like'></div>
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
