function AIInsights({ schemes }) {

  if (!schemes.length) return null;

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
        Matches are based on the rules and information available; final
        eligibility is determined by the relevant government authority.
      </p>

      <p>
        <b>Top Recommendation:</b> {schemes[0]?.scheme_name}
      </p>

    </div>

  );

}

export default AIInsights;