const fs = require("fs/promises");
const path = require("path");

/**
 * Regista erros num ficheiro 'errors.log'.
 * Inclui timestamp, nome da função e stack do erro.
 *
 * @param {string} functionName - Nome da função ou comando onde ocorreu o erro
 * @param {Error|string} error - Objeto de erro ou mensagem
 */
const logError = async (functionName, error) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] Erro na função "${functionName}": ${
    error.stack || error
  }\n`;
  const logPath = path.join(__dirname, "errors.log");
  try {
    await fs.appendFile(logPath, logMessage);
  } catch (fsError) {
    console.error("Erro ao escrever no ficheiro de log:", fsError);
  }
};

module.exports = { logError };
