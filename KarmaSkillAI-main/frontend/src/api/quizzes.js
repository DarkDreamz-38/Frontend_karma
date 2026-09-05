import client from "./client"

export const getQuiz = (id) => client.get(`/quizzes/${id}`).then(r => r.data)
export const submitQuiz = (id, data) => client.post(`/quizzes/${id}/attempt`, data).then(r => r.data)
