function StatusBadge({ gap }) {
  if (gap <= 0) return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Low</span>
  if (gap < 20) return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Moderate</span>
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Critical</span>
}

export default function GapTable({ competencies }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
            <th className="text-left px-4 py-3 font-medium">Skill</th>
            <th className="text-center px-4 py-3 font-medium">Current</th>
            <th className="text-center px-4 py-3 font-medium">Required</th>
            <th className="text-center px-4 py-3 font-medium">Gap</th>
            <th className="text-center px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {competencies.map((c, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-800">{c.competency}</td>
              <td className="px-4 py-3 text-center text-gray-600">{(c.current_level * 10).toFixed(0)}</td>
              <td className="px-4 py-3 text-center text-gray-600">{(c.required_level * 10).toFixed(0)}</td>
              <td className="px-4 py-3 text-center text-gray-600">{c.gap > 0 ? (c.gap * 10).toFixed(0) : "-"}</td>
              <td className="px-4 py-3 text-center"><StatusBadge gap={c.gap} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
