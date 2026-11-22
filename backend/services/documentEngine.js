export function checkMissingDocuments(citizen, scheme) {
    const providedDocuments = new Set(citizen.provided_documents || []);
    return (scheme.required_documents || []).filter(
        (document) => !providedDocuments.has(document)
    );
}