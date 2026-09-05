import client from "./client"

export const getRecommendations = (id) => client.get(`/recommendations/employee/${id}`).then(r => r.data)
