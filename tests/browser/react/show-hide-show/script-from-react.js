window.thirdPartyObject = {
  renderLoaded: () => {
    document.getElementById("script-from-react").innerHTML +=
      " <code>loaded via renderLoaded</code>";
  },
};
