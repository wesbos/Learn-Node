exports.findSlugNumber = function (slugNumbers) {
  let number = 0
  for(let i = 0; i < slugNumbers.length; i++) {
    if (number === slugNumbers[i]) {
      number++
    } else {
      break
    }
  }
  return number
}