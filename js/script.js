// TEXT
const dataInput = document.querySelector("#data");

// IMAGE FORMAT
const imageFormat = document.querySelector("input[name='format']:checked");

// COLORS
const mainColorPicker = document.querySelector("#main-color");
const backgroundColorPicker = document.querySelector("#bg-color");
const colorValue = document.querySelector("#color-value");
const backgroundColorValue = document.querySelector("#bg-color-value");

const updateColor = (e) => {
  const value = e.target.value;
  colorValue.innerText = value;
};

const updateBackgroundColor = (e) => {
  const value = e.target.value;
  backgroundColorValue.innerText = value;
};

const addColorPickerEventListeners = () => {
  mainColorPicker.addEventListener("change", updateColor);
  backgroundColorPicker.addEventListener("change", updateBackgroundColor);
};

addColorPickerEventListeners();

// Sliders
const sizeSlider = document.querySelector("#size");
const marginSlider = document.querySelector("#margin");

const sizeValue = document.querySelector("#size-value");
const marginValue = document.querySelector("#margin-value");

const updateSize = (e) => {
  const value = e.target.value;
  sizeValue.innerText = `${value} x ${value}`;
};

const updateMargin = (e) => {
  const value = e.target.value;
  marginValue.innerText = `${value} px`;
};

const addSliderEventLisnters = () => {
  sizeSlider.addEventListener("change", updateSize);
  marginSlider.addEventListener("change", updateMargin);
};

addSliderEventLisnters();

const submitButton = document.querySelector("#cta");

const prepareParameters = (params) => {
  return {
    data: params.data,
    size: `${params.size}x${params.size}`,
    color: params.color.replace("#", ""),
    bgcolor: params.bgColor.replace("#", ""),
    qzone: params.qZone,
    format: params.format,
  };
};

const settingsContainer = document.querySelector("#qr-code-settings");
const resultsContainer = document.querySelector("#qr-code-result");
const qrCodeImage = document.querySelector("#qr-code-image");

const displayQrCode = (imgUrl) => {
  settingsContainer.classList.add("flipped");
  resultsContainer.classList.add("flipped");
  qrCodeImage.setAttribute("src", imgUrl);
};

const getQrCode = (parameters) => {
  const urlParams = new URLSearchParams(parameters).toString();
  const baseUrl = "https://api.qrserver.com/v1/create-qr-code";

  const fullUrl = `${baseUrl}?${urlParams}`;

  fetch(fullUrl).then((responise) => {
    if (responise.status === 200) {
      displayQrCode(fullUrl);
    }
  });
};

const showInputError = () => {
  dataInput.classList.add("error");
};

const addDataInputEventListener = () => {
  dataInput.addEventListener("change", (e) => {
    if (e.target.value !== "") {
      dataInput.classList.remove("error");
      submitButton.removeAttribute("disabled");
    } else {
      dataInput.classList.add("error");
      submitButton.setAttribute("disabled", true);
    }
  });
};

addDataInputEventListener();

const onSubmit = () => {
  const data = dataInput.value;

  if (!data.length) {
    return showInputError();
  }

  const color = mainColorPicker.value;
  const bgColor = backgroundColorPicker.value;
  const size = sizeSlider.value;
  const qZone = marginSlider.value;
  const format = document.querySelector('input[name="format"]:checked').value;

  const parameters = prepareParameters({
    data,
    color,
    bgColor,
    size,
    qZone,
    format,
  });

  getQrCode(parameters);
};

const addSubmitEventLisnter = () => {
  submitButton.addEventListener("click", onSubmit);
};

addSubmitEventLisnter();

const editButton = document.querySelector("#edit");

const onEdit = () => {
  settingsContainer.classList.remove("flipped");
  resultsContainer.classList.remove("flipped");
};

const addEditButtonEventListener = () => {
  editButton.addEventListener("click", onEdit);
};

addEditButtonEventListener();

const themeSwitch = document.getElementById("theme-switch");

themeSwitch.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");

  const newTheme = currentTheme === "light" ? "dark" : "light";

  // saving localStorage
  localStorage.setItem("currentTheme", newTheme);
  localStorage.setItem("themeState", themeSwitch.checked);

  document.documentElement.setAttribute("data-theme", newTheme);
});

// Apply system/browser theme preference if no theme preference is stored
const savedTheme = localStorage.getItem("currentTheme") || "light";
const themeSwitchState = localStorage.getItem("themeState") === "true";

document.documentElement.setAttribute("data-theme", savedTheme);
themeSwitch.checked = themeSwitchState;
