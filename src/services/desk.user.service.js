import deskApi from './desk.api'

const getUserList = async (adminId, accountId, pageSize, page) => {
    const userList = await deskApi.get("/user/list", { params: {admin_id:adminId, account_id: accountId, page_size: pageSize, page } })
    return userList
}

const getFilterUserList = async (adminId,accountId, pageSize, page, phoneNumber) => {
    const userList = await deskApi.get("/user/filter_list", { params: {admin_id:adminId, account_id: accountId, page_size: pageSize, page, phone_number: phoneNumber } })
    return userList
}

const getLables = async (adminId,accountId) => {
    const labels = await deskApi.get("/user/lables", { params: {admin_id:adminId, account_id: accountId } })
    return labels
}

const getTagBasedUsers = async (adminId,accountId, pageSize, page, tags) => {
    const userList = await deskApi.get("/user/tag_based_list", { params: {admin_id:adminId, account_id: accountId, page_size: pageSize, page, tags } })
    return userList
}

const getDashBoardDetails = async (adminId, accountId) => {
    const dashboardDetails = await deskApi.get("/user/dashboard_details", { params: { admin_id: adminId, account_id: accountId } });
    return dashboardDetails
}

const getMessages = async (adminId,accountId, messageInfo) => {
    const messages = await deskApi.get("/user/messages", { params: {admin_id:adminId, account_id: accountId, message_info: messageInfo } })
    return messages
}

const getWhatsAppInboxes = async (admin_id,accountId) => {
    const whatsappInboxes = await deskApi.get("/whatsapp/inboxes/list", { params: {admin_id, account_id: accountId } })
    return whatsappInboxes
}

const getTeplateData = async (admin_id,accountId, channelId) => {
    const templateData = await deskApi.get("/whatsapp/template/list", { params: {admin_id, account_id: accountId, channel_id: channelId } })
    return templateData
}



export default {
    getUserList, getFilterUserList, getLables, getTagBasedUsers, getDashBoardDetails, getMessages,
    getWhatsAppInboxes, getTeplateData
}