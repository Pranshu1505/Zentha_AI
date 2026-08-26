/**
 * Splits text into overlapping chunks, roughly by word count, so each chunk
 * fits comfortably within embedding + context limits.
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.trim().length > 0) chunks.push(chunk);
    if (i + chunkSize >= words.length) break;
  }

  return chunks;
};
