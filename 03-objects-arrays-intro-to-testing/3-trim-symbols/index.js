/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (string === '' || size === 0) {
    return '';
  }

  if (size === undefined) {
    return string;
  }

  let result = string[0];
  const restSymbols = string.slice(1);

  let currentSymbol = result;
  let currentSymbolCount = 1;

  for (const symbol of restSymbols) {
    if (currentSymbol !== symbol) {
      currentSymbol = symbol;
      currentSymbolCount = 1;
      result += symbol;
      continue;
    }

    if (symbol === currentSymbol && currentSymbolCount < size) {
      currentSymbolCount++;
      result += symbol;
    }
  }

  return result;
}
