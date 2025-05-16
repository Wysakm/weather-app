import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { provinces } from '../configs/provinces.js';
import { weatherCodeToIcon, weatherCodeToDescription } from '../utils/weatherIconMap.js'
import './styles/Weather.css';
import useCurrentWeather from '../hooks/useCurrentWeather.js';
import { loadWeatherIcon } from '../utils/iconLoader';

const initialProvince = provinces.find(p => p.names.en === 'Trang');

function Weather() {
  const { t, i18n } = useTranslation();
  const [selectedProvince, setSelectedProvince] = useState(initialProvince);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [weatherIconUrl, setWeatherIconUrl] = useState(null);

  const { weatherData, loading } = useCurrentWeather(selectedProvince.lat, selectedProvince.lon)

  useEffect(() => {
    let mounted = true;
    let watchId = null;

    const getLocation = async () => {
      if (navigator.geolocation) {
        try {
          // ใช้ getCurrentPosition แทน watchPosition เพื่อทดสอบก่อน
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            });
          });

          if (!mounted) return;

          const { latitude, longitude } = position.coords;
          console.log('Current position:', { latitude, longitude });

          // ลดขนาดพื้นที่การค้นหาจังหวัด
          const province = provinces.find(p => (
            (p.lat - 0.3 <= latitude && latitude <= p.lat + 0.3) &&
            (p.lon - 0.3 <= longitude && longitude <= p.lon + 0.3)
          ));

          if (province && mounted) {
            console.log('Found matching province:', {
              name: province.names.en,
              provinceLat: province.lat,
              provinceLon: province.lon,
              userLat: latitude,
              userLon: longitude,
              distance: {
                lat: Math.abs(province.lat - latitude),
                lon: Math.abs(province.lon - longitude)
              }
            });
            setSelectedProvince(province);
          } else {
            console.log('No matching province found for coordinates:', {
              latitude,
              longitude
            });
            setSelectedProvince(initialProvince);
          }

        } catch (error) {
          console.error("Location error:", error.message);
          if (mounted) {
            setSelectedProvince(initialProvince);
          }
        }
      }
    };

    getLocation();

    // ตั้ง interval เพื่ออัพเดทตำแหน่งทุก 5 นาที
    const intervalId = setInterval(getLocation, 300000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []); // ไม่ต้องใส่ dependency

  useEffect(() => {
    if (!weatherData?.current) return;
    
    const loadIcon = async () => {
      const iconName = weatherCodeToIcon(
        weatherData.current.weather_code,
        weatherData.current.is_day === 1
      );
      
      if (iconName) {
        const iconUrl = await loadWeatherIcon(iconName);
        setWeatherIcon(iconName);
        setWeatherIconUrl(iconUrl);
      }
    };

    loadIcon();
  }, [weatherData]);

  // เพิ่มฟังก์ชัน formatTime ไว้ใน component
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const time = new Date(dateTimeString);
    return time.toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

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
                  {weatherIconUrl && (
                    <img
                      src={weatherIconUrl}
                      alt={weatherCodeToDescription(weatherData.current.weather_code, i18n.language)}
                      className="weather-icon"
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
              <div className='forecast-box-II-left'>
                <div>
                  {t('forecast.Sunrise')} : {formatTime(weatherData?.daily?.sunrise?.[1])} {t('forecast.AM')}
                </div>
                <div>
                  {t('forecast.Sunset')} : {formatTime(weatherData?.daily?.sunset?.[0])} {t('forecast.PM')}
                </div>
              </div>

               <div className='forecast-box-II-right'>
                <div>
                  {t('forecast.RainChance')} : {weatherData?.daily?.precipitation_probability_max?.[0]}%
                </div>
                <div>
                  {t('forecast.UVindex')} : {weatherData?.daily?.uv_index_max?.[0]} 
                </div>
              </div>
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
