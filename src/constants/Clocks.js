export const getBackgroundImage = (currentTime) => {
  if (currentTime >= 0 && currentTime < 2)
    return require("../../assets/clocks/saat1.png");
  if (currentTime >= 2 && currentTime < 4)
    return require("../../assets/clocks/saat2.png");
  if (currentTime >= 4 && currentTime < 7)
    return require("../../assets/clocks/saat3.png");
  if (currentTime >= 7 && currentTime < 9)
    return require("../../assets/clocks/saat4.png");
  if (currentTime >= 9 && currentTime < 12)
    return require("../../assets/clocks/saat5.png");
  if (currentTime >= 12 && currentTime < 14)
    return require("../../assets/clocks/saat6.png");
  if (currentTime >= 14 && currentTime < 16)
    return require("../../assets/clocks/saat7.png");
  if (currentTime >= 16 && currentTime < 19)
    return require("../../assets/clocks/saat8.png");
  if (currentTime >= 19 && currentTime < 21)
    return require("../../assets/clocks/saat9.png");
  if (currentTime >= 21 && currentTime < 24)
    return require("../../assets/clocks/saat10.png");
};
