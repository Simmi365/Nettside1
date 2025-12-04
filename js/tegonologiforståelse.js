const ch = "A" 

const asciiCode = ch.charCodeAt(0) 

const binary = toBinary(asciiCode) 
let binaryNum = "01111000 01111001 01111010 " 

let desimaltall = parseInt(binaryNum, 2)   
console.log("Desimaltall:", desimaltall)

console.log("Tegn:", ch) 

console.log("ASCII:", asciiCode) 

console.log("Binært:", binary) 

const text = "Simeon" 

const code0 = text.charCodeAt(0) 

const code1 = text.charCodeAt(1) 

const code2 = text.charCodeAt(2) 

const code3 = text.charCodeAt(3) 

const code4 = text.charCodeAt(4) 

const code5 = text.charCodeAt(5)

console.log("Tegn:", text)
console.log("ASCII:", code0, code1, code2, code3, code4, code5)
console.log("Binært:", toBinary(code0), toBinary(code1), toBinary(code2), toBinary(code3), toBinary(code4), toBinary(code5))

