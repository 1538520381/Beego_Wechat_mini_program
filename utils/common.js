const sleep = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

const isEmpty = (field) => {
  return field === "" || field === null || field === undefined || JSON.stringify(field) === '{}' || JSON.stringify(field) === '[]'
}

const latexToMarkdown = (text) => {
  const inlineLatex = /\\\((.*?)\\\)/gs;
  const blockLatex = /\\\[(.*?)\\\]/gs;

  text = text.replace(inlineLatex, (match, p) => ` $${isEmpty(p) ? p : p.trim()}$ `);
  text = text.replace(blockLatex, (match, p) => `\n$$\n${p}\n$$\n`);

  return text
}

module.exports = {
  sleep,
  isEmpty,
  latexToMarkdown
}