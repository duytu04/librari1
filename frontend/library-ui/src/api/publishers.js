import api from "./http.js";

export async function createPublisher(dto) {
  const { data } = await api.post("/publishers", dto);
  return data;
}
export async function listPublishers() {
  const { data } = await api.get("/publishers");
  return data;
}
