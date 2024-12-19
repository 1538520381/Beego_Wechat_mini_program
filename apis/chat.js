const {
  request,
  requestStream
} = require("../utils/request")

const addSession = (botId) => {
  return request({
    url: `/session/create?bot_id=${botId}`,
    method: 'POST'
  })
}

const deleteSession = (sessionId) => {
  return request({
    url: `/session/remove?session_id=${sessionId}`,
    method: 'POST'
  })
}

const getRobotList = () => {
  return request({
    url: '/bot/list',
    method: 'POST',
  })
}

const getLearningCornerRobotList = () => {
  return request({
    url: '/bot/list/coStudy',
    method: 'POST'
  })
}

const getSessionList = (botId) => {
  return request({
    url: `/session/retrieve?bot_id=${botId}`,
    method: 'POST',
  })
}

const getMessageList = (sessionId) => {
  return request({
    url: '/message/list',
    method: 'POST',
    data: {
      session_id: sessionId,
      limit: 2147483647
    }
  })
}

const getRobotById = (robotId) => {
  return request({
    url: '/bot/getById',
    method: 'POST',
    data: {
      bot_id: robotId
    }
  })
}

const chat = (botId, sessionId, handle, content, fileType, fileName, fileUrl) => {
  return requestStream({
    url: '/chat/agent',
    method: 'POST',
    data: {
      bot_id: botId,
      session_id: sessionId,
      bot_handle: handle,
      content: content,
      file_type: fileType,
      file_name: fileName,
      file_url: fileUrl,
    }
  })
}

const longTextDialogueSubmit = (robotId, sessionId, handle, content, fileUrl, fileName, fileType) => {
  return request({
    url: '/chat/workflow/submit',
    method: 'post',
    data: {
      bot_id: robotId,
      session_id: sessionId,
      bot_handle: handle,
      content: content,
      file_url: fileUrl,
      file_type: fileType,
      file_name: fileName,
    }
  })
}

const longTextDialogueQuery = (robotId, sessionId, executeId) => {
  return request({
    url: '/chat/workflow/query',
    method: 'post',
    data: {
      bot_id: robotId,
      session_id: sessionId,
      execute_id: executeId
    }
  })
}

module.exports = {
  addSession,
  deleteSession,
  getRobotList,
  getLearningCornerRobotList,
  getSessionList,
  getMessageList,
  getRobotById,
  chat,
  longTextDialogueSubmit,
  longTextDialogueQuery
}