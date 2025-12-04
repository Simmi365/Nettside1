//console.log("Hei jeg lærer meg JavaScript!");

//let fornavn = "Simeon leander";

//console.log(fornavn);

const dag = 21;
const måned = "Juni";

console.log('en random dag', dag, måned);


let alder = 16;
console.log(alder);
alder = alder + 1;
console.log(alder);

let navn = "Simeon";

const hilsen = `Hei ${navn}`;
console.log(hilsen);

function toBinary(number) { 

  return number.toString(2).padStart(8, "0") 

} 

 

function toBinary(number) { 

  return number.toString(2).padStart(8, "0") 

} 

let username;

document.getElementById("mySubmit").onclick = function(){
    username = document.getElementById("myText").value;
    document.getElementById("myH1").textContent = `Hello ${username}`
};


