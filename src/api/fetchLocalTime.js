const fetchLocalTime = async (latitude, longitude) => {
  try {
    const timezoneResponse = await fetch(
      `https://api.ipgeolocation.io/timezone?apiKey=f1f25b9c30b94847a9b7dd6cc8ff1ff5&lat=${latitude}&long=${longitude}`
    );
    const timezoneData = await timezoneResponse.json();
    const timezone = timezoneData.time_24;

    return timezone;
  } catch (error) {
    console.error("Zaman dilimi bilgisini alırken hata:", error);
    return null;
  }
};

export default fetchLocalTime;
