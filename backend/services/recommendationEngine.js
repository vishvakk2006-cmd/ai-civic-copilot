export function rankSchemes(schemes) {

    return schemes
        .map((scheme) => {

            let score = 50;

            if (scheme.category?.includes("Healthcare"))
                score += 20;

            if (scheme.category?.includes("Agriculture"))
                score += 15;

            if (scheme.category?.includes("Housing"))
                score += 10;

            return {
                ...scheme,
                priority_score: score,
                approval_probability: Math.min(score + 20, 95)
            };

        })
        .sort(
            (a, b) => b.priority_score - a.priority_score
        );

}