import client from "./client"

export const createAssessment = (data) => client.post("/assessments/", data).then(r => r.data)
export const getEmployeeAssessments = (id) => client.get(`/assessments/employee/${id}`).then(r => r.data)
