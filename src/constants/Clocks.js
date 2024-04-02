export const getBackgroundImage = (currentTime) => {
  if (currentTime >= "00:00" && currentTime < "02:24")
    return require("../../assets/clocks/saat1.png");
  if (currentTime >= "02:24" && currentTime < "04:48")
    return require("../../assets/clocks/saat2.png");
  if (currentTime >= "04:48" && currentTime < "07:12")
    return require("../../assets/clocks/saat3.png");
  if (currentTime >= "07:12" && currentTime < "09:36")
    return require("../../assets/clocks/saat4.png");
  if (currentTime >= "09:36" && currentTime < "12:00")
    return require("../../assets/clocks/saat5.png");
  if (currentTime >= "12:00" && currentTime < "14:24")
    return require("../../assets/clocks/saat6.png");
  if (currentTime >= "14:24" && currentTime < "16:48")
    return require("../../assets/clocks/saat7.png");
  if (currentTime >= "16:48" && currentTime < "19:12")
    return require("../../assets/clocks/saat8.png");
  if (currentTime >= "19:12" && currentTime < "21:36")
    return require("../../assets/clocks/saat9.png");
  if (currentTime >= "21:36" && currentTime < "24:00")
    return require("../../assets/clocks/saat10.png");
};
