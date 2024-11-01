const sleep = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

const isEmpty = (field) => {
  return field === "" || field === null || field === undefined || JSON.stringify(field) === '{}' || JSON.stringify(field) === '[]'
}

module.exports = {
  sleep,
  isEmpty
}