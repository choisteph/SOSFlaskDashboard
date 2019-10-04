function selectSrc() {
    let emsButton = document.querySelector("#EMSRadio")
    let meButton = document.querySelector("#MERadio")
    dataSource = emsButton.checked ? emsButton.value : meButton.value
};
