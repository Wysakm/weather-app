import { useState, useEffect } from 'react';
import { provinces } from '../configs/provinces';

export const useGeolocation = (initialProvince) => {
  const [selectedProvince, setSelectedProvince] = useState(initialProvince);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const getLocation = async () => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported");
        return;
      }

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false, // Better performance
            timeout: 10000,
            maximumAge: 300000 // 5 minutes cache
          });
        });

        if (!mounted) return;

        const { latitude, longitude } = position.coords;
        const province = provinces.find(p => (
          Math.abs(p.lat - latitude) <= 0.3 && 
          Math.abs(p.lon - longitude) <= 0.3
        ));

        if (province) {
          setLocationError(null);
          setSelectedProvince(province);
        } else {
          setLocationError("No matching province found");
        }
      } catch (error) {
        if (mounted) {
          setLocationError(error.message);
        }
      }
    };

    getLocation();
    const intervalId = setInterval(getLocation, 300000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { selectedProvince, locationError };
};