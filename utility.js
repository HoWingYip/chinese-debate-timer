const setDataAttribute = (element, attributeName, attributeValue) => {
  element.dataset[attributeName] = String(attributeValue);
};

const getDataAttribute = (element, attributeName, desiredType = String) => {
  if (desiredType === Boolean) {
    // ensure false is returned when element.dataset[attributeName] === "false"
    // gotcha: Boolean("false") === true
    return element.dataset[attributeName] === "true";
  }

  return desiredType(element.dataset[attributeName]);
};
