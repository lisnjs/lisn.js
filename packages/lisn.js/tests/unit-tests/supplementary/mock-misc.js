window.requestAnimationFrame = (fn) =>
  window.setTimeout(() => fn(Date.now() - 10), 10);

window.matchMedia = (m) => {
  return {
    media: m,
    matches: false,
  };
};

window.CSS = {
  supports: () => true,
};
