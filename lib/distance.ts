export const formatDistance = (distance?: number): string => {
  if (!distance) return "";

  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
};

export const getWalkingTime = (distance?: number): string => {
  if (!distance) return "";

  // Average walking speed: 5 km/h
  const walkingSpeedKmh = 5;
  const timeInHours = distance / walkingSpeedKmh;
  const timeInMinutes = Math.round(timeInHours * 60);

  if (timeInMinutes < 60) {
    return `${timeInMinutes} min walk`;
  } else {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours}h ${minutes}m walk`;
  }
};

export const getDrivingTime = (distance?: number): string => {
  if (!distance) return "";

  // Average city driving speed: 30 km/h
  const drivingSpeedKmh = 30;
  const timeInHours = distance / drivingSpeedKmh;
  const timeInMinutes = Math.round(timeInHours * 60);

  if (timeInMinutes < 60) {
    return `${timeInMinutes} min drive`;
  } else {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours}h ${minutes}m drive`;
  }
};
