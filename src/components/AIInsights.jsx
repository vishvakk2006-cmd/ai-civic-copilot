function AIInsights({ schemes }) {

  if (!schemes.length) return null;

  const totalBenefit = schemes.reduce((sum, scheme) => {

    const value = Number(
      String(scheme.benefit).replace(/[^0-9]/g, "")
    );

    return sum + (isNaN(value) ? 0 : value);

  }, 0);

  const avgApproval =
    Math.round(
      schemes.reduce(
        (sum, s) => sum + s.approval_probability,
        0
      ) / schemes.length
    );

  return (

    <div
      style={{
        border: "2px solid #4CAF50",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "25px",
      }}
    >

      <h2>🤖 AI Civic Insights</h2>

      <p>
        <b>Total Eligible Schemes:</b> {schemes.length}
      </p>

      <p>
        <b>Total Estimated Benefits:</b> ₹{totalBenefit.toLocaleString()}
      </p>

      <p>
        <b>Average Approval Probability:</b> {avgApproval}%
      </p>

      <p>
        <b>Top Recommendation:</b> {schemes[0]?.scheme_name}
      </p>

    </div>

  );

}

export default AIInsights;