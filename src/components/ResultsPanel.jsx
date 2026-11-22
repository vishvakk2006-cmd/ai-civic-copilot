function ResultsPanel({ schemes, incompleteSchemes = [] }) {

    if (!schemes || schemes.length === 0) {

        return (
            <div>
                <h3>No fully verified matches found</h3>
                {incompleteSchemes.length > 0 && (
                    <>
                        <p>
                            More information is needed before these schemes can
                            be assessed:
                        </p>
                        <ul>
                            {incompleteSchemes.slice(0, 8).map((scheme) => (
                                <li key={scheme.scheme_id}>
                                    {scheme.scheme_name}:{" "}
                                    {scheme.missing_information.join(", ")}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        );

    }

    return (

        <div>

            <h2>Eligible Government Schemes</h2>

            {schemes.map((scheme) => (

                <div
                    key={scheme.scheme_id}
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "20px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                >

                    <h3>{scheme.scheme_name}</h3>

                    <p>{scheme.description}</p>

                    <p>
                        <b>Benefit:</b> {scheme.benefit}
                    </p>

                    <p>
                        <b>Category:</b> {scheme.category}
                    </p>

                    <p>
                        <b>Recommendation Priority:</b> {scheme.priority_score}
                    </p>

                    <p><b>Why the listed rules match:</b></p>
                    <ul>
                        {scheme.explanation?.map((reason, index) => (
                            <li key={index}>{reason}</li>
                        ))}
                    </ul>

                    <hr />

                    <h4>📄 Required Documents</h4>

                    <ul>
                        {scheme.required_documents?.map((doc, index) => (
                            <li key={index}>
                                {doc}
                                {scheme.missing_documents?.includes(doc)
                                    ? " (not selected as provided)"
                                    : " (selected as provided)"}
                            </li>
                        ))}
                    </ul>

                    <h4>📝 Application Process</h4>

                    <ol>
                        {(scheme.application_steps || scheme.application_process)?.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>

                    {scheme.contact?.website && (
                        <p>
                            <b>🌐 Official Website:</b>
                            <br />
                            <a
                                href={scheme.contact.website}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {scheme.contact.website}
                            </a>
                        </p>
                    )}

                </div>

            ))}

        </div>
    );
}

export default ResultsPanel;