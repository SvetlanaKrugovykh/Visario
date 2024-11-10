const moment = require('moment')
const translations = require('../data/consts').translations

const workingHours = {
  monday: { start: '08:00', end: '17:00' },
  tuesday: { start: '08:00', end: '17:00' },
  wednesday: { start: '08:00', end: '17:00' },
  thursday: { start: '08:00', end: '17:00' },
  friday: { start: '08:00', end: '17:00' },
  saturday: { start: '09:00', end: '15:00' },
  sunday: null
}

function generateTimeIntervals(date) {
  const dayOfWeek = moment(date).format('dddd').toLowerCase()
  const hours = workingHours[dayOfWeek]

  if (!hours) return []

  const intervals = []
  let startTime = moment(date).startOf('day').add(moment.duration(hours.start))
  const endTime = moment(date).startOf('day').add(moment.duration(hours.end))

  while (startTime < endTime) {
    intervals.push(startTime.format('HH:mm'))
    startTime.add(30, 'minutes')
  }

  return intervals
}

function generateTodayIntervals() {
  const now = moment().add(20, 'minutes')
  const todayIntervals = generateTimeIntervals(now).filter(time => moment(time, 'HH:mm').isAfter(now))
  return todayIntervals
}

function generateTomorrowIntervals() {
  const tomorrow = moment().add(1, 'day').startOf('day')
  return generateTimeIntervals(tomorrow)
}

function generateIntervals(lang = 'en') {
  const todayIntervals = generateTodayIntervals()
  const tomorrowIntervals = generateTomorrowIntervals()

  return {
    today: {
      label: translations[lang].today,
      intervals: todayIntervals
    },
    tomorrow: {
      label: translations[lang].tomorrow,
      intervals: tomorrowIntervals
    }
  }
}

module.exports = {
  generateIntervals
}