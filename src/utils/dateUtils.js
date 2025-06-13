export const getFormattedDate = (language) => {
  const date = new Date();

  if (language === 'th') {
    return date.toLocaleDateString('th-TH', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  const formatted = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const parts = formatted.split(' ');
  return `${parts[0]}, ${parts.slice(1).join(' ')}`;
};

export const formatTime = (dateTimeString, language) => {
  if (!dateTimeString) return '';
  const time = new Date(dateTimeString);
  return time.toLocaleTimeString(language, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};