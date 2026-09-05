import axios from "axios"

const BASE = "http://localhost:8000"

export const uploadAndAnalyzeMaterial = (file, numberOfQuestions = 5) => {
  const form = new FormData()
  form.append("file", file)
  return axios.post(
    `${BASE}/materials/analyze-and-save?number_of_questions=${numberOfQuestions}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  ).then(r => r.data)
}

export const getRoles = () => axios.get(`${BASE}/roles/`).then(r => r.data)
