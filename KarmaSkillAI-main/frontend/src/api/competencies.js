import client from "./client"

export const getCompetencies = () => client.get("/competencies/").then(r => r.data)
export const getEmployeeCompetencies = (id) => client.get(`/competencies/employee/${id}`).then(r => r.data)
