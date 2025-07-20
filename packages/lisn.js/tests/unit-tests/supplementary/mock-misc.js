window.requestAnimationFrame = (fn) => {
  const lastTimeStamp = Date.now();

  window.setTimeout(() => {
    fn(lastTimeStamp);
  }, 10);
};

window.matchMedia = (m) => {
  return {
    media: m,
    matches: false,
  };
};

window.CSS = {
  supports: () => true,
};
