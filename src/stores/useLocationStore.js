import { create } from 'zustand';
import { provinces } from '../configs/provinces';

const initialProvince = provinces.find(p => p.names.en === 'Trang');

const useLocationStore = create((set) => ({
  selectedProvince: null,
  locationError: null,
  loading: false,

  setLocation: async (option) => {
    set({ loading: true });

    if (option?.province) {
      set({
        selectedProvince: option.province,
        loading: false
      });
      return;
    }

    if (!navigator.geolocation) {
      set({
        selectedProvince: initialProvince,
        locationError: "Geolocation is not supported",
        loading: false
      });
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve,
          (error) => {
            set({ selectedProvince: initialProvince });
            reject(error);
          }, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      const province = provinces.find(p => (
        Math.abs(p.lat - latitude) <= 0.3 &&
        Math.abs(p.lon - longitude) <= 0.3
      ));

      if (province) {
        set({
          selectedProvince: province,
          locationError: null,
          loading: false
        });
      } else {
        set({
          locationError: "No matching province found",
          loading: false
        });
      }
    } catch (error) {
      set({
        locationError: error.message,
        loading: false
      });
    }
  }
}));

export { useLocationStore };