document.addEventListener('click', function(event) {
  if (!(event.target instanceof Element)) return;

  var link = event.target.closest('a[data-youtube-video]');
  if (!link) return;

  var videoId = link.getAttribute('data-youtube-video');
  if (!videoId || !/^[\w-]{11}$/.test(videoId)) return;

  event.preventDefault();
  var iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0';
  iframe.title = link.getAttribute('data-video-title') + ' — YouTube video player';
  iframe.loading = 'lazy';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  link.replaceWith(iframe);
});
