console.log("ruleInterpreter.js loaded");

export function evaluateRule(key, value, citizen) {

    const citizenValue = citizen[key];

    if (Array.isArray(value)) {
        return value.includes(citizenValue);
    }

    return citizenValue === value;

}