// Send Sveltia's Media page (#/assets) to the Görseller page, which shows post images folder by
// folder. Sveltia navigates with pushState and then dispatches a `hashchange` event, so listening
// for it covers both the media icon and a typed URL.
(() => {
  const redirect = () => {
    if (window.location.hash.startsWith("#/assets")) {
      window.location.replace("/admin/media/");
    }
  };

  window.addEventListener("hashchange", redirect);
  redirect();
})();
