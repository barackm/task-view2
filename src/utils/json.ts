/**
 * Validates if a string is a valid JSON string before parsing
 * @param jsonString - The string to validate
 * @returns boolean indicating if the string is valid JSON
 */
export function isValidJSON(jsonString: string): boolean {
  return /^[\],:{}\s]*$/.test(
    jsonString
      .replace(/\\["\\\/bfnrtu]/g, "@")
      .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ""),
  );
}

/**
 * Safely parses a JSON string with validation
 * @param jsonString - The JSON string to parse
 * @param defaultValue - The default value to return if parsing fails
 * @returns The parsed JSON object or the default value
 */
export function safeJSONParse<T>(jsonString: string, defaultValue: T): T {
  if (!jsonString || typeof jsonString !== "string") {
    return defaultValue;
  }

  try {
    if (!isValidJSON(jsonString)) {
      console.error("Invalid JSON string");
      return defaultValue;
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
}
