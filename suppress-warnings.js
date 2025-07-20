// Suprime o warning de deprecação do util._extend
const originalEmitWarning = process.emitWarning;

process.emitWarning = function (warning, type, code) {
  // Suprime especificamente o warning do util._extend
  if (
    code === "DEP0060" ||
    (typeof warning === "string" && warning.includes("util._extend"))
  ) {
    return;
  }

  // Permite outros warnings passarem
  return originalEmitWarning.call(this, warning, type, code);
};
