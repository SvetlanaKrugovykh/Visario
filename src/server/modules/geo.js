const geolib = require("geolib")
const { cafeLocation } = require('../data/consts')

module.exports.getCafeLocation = async function () {

  return cafeLocation

}

module.exports.requestLocation = async function (bot, msg) {
  await bot.sendMessage(
    msg.chat.id,
    "Please share your location to proceed with the order.",
    {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [
          [
            {
              text: "Share Location",
              request_location: true,
            },
          ],
        ],
      },
    }
  )

  return new Promise((resolve, reject) => {
    bot.once("location", (locationMsg) => {
      if (locationMsg.location) {
        resolve(locationMsg.location)
      } else {
        reject("Location not provided")
      }
    })
  })
}

module.exports.checkDistance = async function (cafeLocation, clientLocation) {
  const distance = geolib.getDistance(
    { latitude: clientLocation.latitude, longitude: clientLocation.longitude },
    { latitude: cafeLocation.latitude, longitude: cafeLocation.longitude }
  )

  const distanceInKm = distance / 1000 // Convert meters to kilometers
  console.log(`Client location: `, clientLocation)
  console.log(`Distance in km: ${distanceInKm}`)
  return distanceInKm <= 30
}


