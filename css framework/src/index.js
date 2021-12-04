const customColor = document.querySelectorAll(".custom");

customColor.forEach((node) => {
  for (data in node.dataset) {
    switch (data) {
      case "color":
        //console.log(`text color is: ${node.dataset[data]}`);
        node.style.color = node.dataset[data];
        break;
      case "bgColor":
        //console.log(`background color is: ${node.dataset[data]}`);
        node.style.backgroundColor = node.dataset[data];
        break;
      case "borderColor":
        //console.log(`border color is: ${node.dataset[data]}`);
        node.style.borderColor = node.dataset[data];
        break;
    }
  }
});
