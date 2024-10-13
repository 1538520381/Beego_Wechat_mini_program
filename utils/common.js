const sleep = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

const isEmpty = (field) => {
  return field === "" || field === null || field === undefined || field === {} || field === []
}

module.exports = {
  sleep,
  isEmpty
}