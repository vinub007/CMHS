function isImageTarget(target) {
  return target instanceof Element && target.closest('img') !== null;
}

function disableImageDragging(image) {
  image.draggable = false;
}

document.querySelectorAll('img').forEach(disableImageDragging);

const imageObserver = new MutationObserver(records => {
  records.forEach(record => {
    record.addedNodes.forEach(node => {
      if (!(node instanceof Element)) {
        return;
      }

      if (node.matches('img')) {
        disableImageDragging(node);
      }
      node.querySelectorAll('img').forEach(disableImageDragging);
    });
  });
});

imageObserver.observe(document.documentElement, { childList: true, subtree: true });

document.addEventListener('contextmenu', event => {
  if (isImageTarget(event.target)) {
    event.preventDefault();
  }
});

document.addEventListener('dragstart', event => {
  if (isImageTarget(event.target)) {
    event.preventDefault();
  }
});
