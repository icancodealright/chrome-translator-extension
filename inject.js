const subscriptionKey = "YOUR-SUBSCRIPTION-KEY";

window.addEventListener("mouseup", (event) => {
  if (typeof event === "object" && event.button == 0) {
    const text = window.getSelection();
    if (!isEmpty(text)) {
      showToolTip(text);
    } else {
      if (Singleton.getInstance() != null) {
        const div = Singleton.getInstance();
        div.style.visibility = "hidden";
      }
    }
  }
});

function isEmpty(text) {
  return text == null || text.length === 0 || text == "";
}

let Singleton = (function () {
  let instance;
  function createInstance() {
    return init();
  }
  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

function init() {
  const tooltipBox = document.createElement("DIV");
  tooltipBox.id = "customtooltip";
  tooltipBox.style.visibility = "hidden";
  tooltipBox.style.position = "fixed";
  tooltipBox.style.top = "0.5rem";
  tooltipBox.style.left = "0.5rem";
  tooltipBox.style.padding = "0.5rem";
  tooltipBox.style.display = "inline-block";
  tooltipBox.style.maxWidth = "50vw";
  tooltipBox.style.borderRadius = "1rem";
  tooltipBox.style.border = "solid thin gray";
  tooltipBox.style.backgroundColor = "gray";
  document.body.appendChild(tooltipBox);

  return tooltipBox;
}

const corners = {
  Y_TOP: {
    X_LEFT: "x left",
    X_RIGHT: "x right",
    X_OTHER: "other position",
  },
  Y_BOTTOM: {
    X_LEFT: "x left",
    X_RIGHT: "x right",
    X_OTHER: "other position",
  },
};

function showToolTip(text) {
  const tooltipBox = Singleton.getInstance();
  const range = text.getRangeAt(0);
  const boundary = range.getBoundingClientRect();
  const coordX = boundary.left;
  const coordY = boundary.top;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const offset = 70;
  let corner;
  if (coordY < offset) {
    corner = corners.Y_TOP;
    if (coordX < offset) {
      corner = corners.Y_TOP.X_LEFT;
    } else if (coordX + offset > width) {
      corner = corners.Y_TOP.X_RIGHT;
    } else {
      corner = corners.Y_TOP.X_OTHER;
    }
    setPositionOfTooltip(corner, tooltipBox, offset, coordX, coordY);
  } else if (coordY + offset > height) {
    corner = corners.Y_BOTTOM;
    if (coordX < offset) {
      corner = corners.X_LEFT;
    } else if (coordX + offset > width) {
      corner = corners.X_RIGHT;
    } else {
      corner = corners.X_OTHER;
    }
    setPositionOfTooltip(corner, tooltipBox, offset, coordX, coordY);
  } else {
    setPositionOfTooltip(1, tooltipBox, offset, coordX, coordY);
  }
  translate(text, tooltipBox);
}

function setPositionOfTooltip(corner, tooltipBox, offset, coordX, coordY) {
  switch (corner) {
    case corners.Y_TOP.X_RIGHT:
      tooltipBox.style.left = (coordX - offset).toString() + "px";
      tooltipBox.style.top = (coordY + offset).toString() + "px";
      break;
    case corners.Y_TOP.X_LEFT:
      tooltipBox.style.left = (coordX + offset).toString() + "px";
      tooltipBox.style.top = (coordY + offset).toString() + "px";
      break;
    case corners.Y_TOP.X_OTHER:
      tooltipBox.style.left = coordX.toString() + "px";
      tooltipBox.style.top = (coordY + offset).toString() + "px";
      break;
    case corners.Y_BOTTOM.X_RIGHT:
      tooltipBox.style.left = (coordX - offset).toString() + "px";
      tooltipBox.style.top = (coordY - offset).toString() + "px";
      break;

    case corners.Y_BOTTOM.X_LEFT:
      tooltipBox.style.left = (coordX + offset).toString() + "px";
      tooltipBox.style.top = (coordY - offset).toString() + "px";
      break;

    case corners.Y_BOTTOM.X_OTHER:
      tooltipBox.style.left = coordX.toString() + "px";
      tooltipBox.style.top = (coordY - offset).toString() + "px";
      break;

    default:
      tooltipBox.style.top = (coordY - offset).toString() + "px";
      tooltipBox.style.left = coordX.toString() + "px";
      break;
  }
}

async function translate(text, tooltipBox) {
  const endpoint = "https://api.cognitive.microsofttranslator.com";
  const response = await axios({
    baseURL: endpoint,
    url: "/translate",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Content-type": "application/json",
      "X-ClientTraceId": uuidv4().toString(),
    },
    params: {
      "api-version": "3.0",
      from: "fr",
      to: ["en"],
    },
    data: [
      {
        text: `${text}`,
      },
    ],
    responseType: "json",
  }).then(function (response) {
    const { translations } = response.data[0];
    return translations[0].text;
  });
  tooltipBox.innerHTML = response;
  tooltipBox.style.visibility = "visible";
}
