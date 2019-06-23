import React from "react";
import ReactDOM from "react-dom";

fetch("http://localhost:666/login", {
  method: "POST",
  credentials: "include",
  mode: "cors",
  body: JSON.stringify({ username: "testuser", password: "password" })
});

ReactDOM.render(
  <div>
    <video id="videoPlayer" controls crossOrigin="use-credentials">
      <source
        src={`http://localhost:666/video?video=${encodeURIComponent(
          "f:\\Filmek\\Star Wars\\Star.Wars.Episode.III.Revenge.of.the.Sith.2005.720p.BluRay.DTS-ES.x264.Hun-rB\\Star.Wars.Episode.III.Revenge.of.the.Sith.2005.720p.BluRay.DTS-ES.x264.Hun-rB.mkv"
        )}`}
        type="video/mp4"
      />
    </video>
  </div>,
  document.getElementById("root")
);
