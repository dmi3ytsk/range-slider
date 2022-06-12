// React.createElement on vanilla js, source:
// https://gist.github.com/devianllert/7d19d7746d2a3bf7e7e0ebdbd69cb6fb

function createElement(tag: string, props: {}, ...children: any) {
  const element: HTMLElement = document.createElement(tag);

  Object.keys(props).forEach((key) => (element[key] = props[key]));

  children.forEach((child) => {
    if (typeof child === "string") {
      child = document.createTextNode(child);
    }
    element.appendChild(child);
  });

  return element;
}

export default createElement;
