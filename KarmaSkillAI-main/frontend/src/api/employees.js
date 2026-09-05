import client from "./client"

export const getEmployees = () => client.get("/employees/").then(r => r.data)
export const getEmployee = (id) => client.get(`/employees/${id}`).then(r => r.data)
export const createEmployee = (data) => client.post("/employees/", data).then(r => r.data)
export const getGapAnalysis = (id) => client.get(`/employees/${id}/gap-analysis`).then(r => r.data)
