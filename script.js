//const operations = ["+", "-", "*", "/"];
function input(character) {
  let input = getInput();
  const lastChar = input.charAt(input.length - 1);
  if (isNaN(lastChar) && isNaN(character)) {
    
    return;
  }
  console.log(input.lastIndexOf());
  document.getElementById("p").innerHTML = input + character;
}

function cancel() {
  document.getElementById("p").innerHTML = "";
}

function cancelEntry() {
  let input = getInput();
  document.getElementById("p").innerHTML = input.substring(0, input.length - 1);
}

function getInput() {
  return document.getElementById("p").innerHTML;
}

function result() {
    let input = getInput();
    document.getElementById("p").innerHTML = eval(input);
}
