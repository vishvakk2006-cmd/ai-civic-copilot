import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function SchemeCharts({ schemes }) {

  const data = schemes.map((scheme) => ({
    name: scheme.scheme_name.length > 15
      ? scheme.scheme_name.substring(0, 15) + "..."
      : scheme.scheme_name,
    score: scheme.approval_probability
  }));

  return (
    <div className="section-card">
      <h2>Approval Probability Comparison</h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SchemeCharts;