import api from './api';

const createBroadcast = async (account_id, broadcast_details,mytz) => {
  const newbroadcast = await api.post("/broadcast/create", { account_id, broadcast_details,mytz })
  return newbroadcast;
}
const createBroadcast2 = async (account_id, broadcast_details,mytz) => {
  const newbroadcast = await api.post("/broadcast2/create", { account_id, broadcast_details,mytz })
  return newbroadcast;
}
const broadcastList = async (adminId,spaceId,page, pageSize, filterName) => {
  const response = await api.get("/broadcast/list", { params: { admin_id: adminId,space_id:spaceId, page, pageSize, filterName } })
  return response;

}

const get_single_brodcast = async (adminId, bid) => {
  const response = await api.get("/broadcast/get", { params: { admin_id: adminId, bid } })
  const bdata = response.data[0]
  if (bdata) {
    if (bdata.audience_type === 1) {
      bdata.audience = bdata.audience.replace(",", "\n")
    } else {
      bdata.audience = bdata.audience.split(",")
    }
    return bdata;
  }
}

const updateBroadcast = async (account_id, broadcast_id, broadcast_details) => {
  console.log(broadcast_details)
  const updateStatus = await api.put("/broadcast/update", { account_id, broadcast_id, broadcast_details })
  return updateStatus;
}

const deleteBroadcast = async (account_id, broadcast_id) => {
  const deleteStatus = await api.delete("/broadcast/delete", {data:{account_id, broadcast_id} })
  return deleteStatus;
}

export { broadcastList, createBroadcast, get_single_brodcast, updateBroadcast, deleteBroadcast,createBroadcast2 }