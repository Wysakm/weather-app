export const loadWeatherIcon = async (iconName) => {
  try {
    const icon = await import(`../assets/svg/${iconName}.svg`);
    return icon.default;
  } catch (error) {
    console.error(`Error loading weather icon: ${iconName}`, error);
    return null;
  }
};