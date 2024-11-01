const {
  request
} = require("../utils/request")

const getFavoritesList = () => {
  return request({
    url: '/user/book/list',
    method: 'POST'
  })
}

const getCategoryList = () => {
  return request({
    url: '/library/get',
    method: 'POST'
  })
}

const getBooksListByCategoryId = (categoryId) => {
  return request({
    url: '/book/listByCategory',
    method: 'POST',
    data: {
      library_id: categoryId
    }
  })
}

const collection = (bookId) => {
  return request({
    url: '/user/book/add',
    method: 'POST',
    data: {
      book_id: bookId
    }
  })
}

const uncollection = (bookId) => {
  return request({
    url: '/user/book/remove',
    method: 'POST',
    data: {
      book_id: bookId
    }
  })
}

const getOutlineByBookId = (bookId) => {
  return request({
    url: '/outline/get',
    method: 'POST',
    data: {
      book_id: bookId
    }
  })
}

module.exports = {
  getFavoritesList,
  getCategoryList,
  getBooksListByCategoryId,
  collection,
  uncollection,
  getOutlineByBookId
}