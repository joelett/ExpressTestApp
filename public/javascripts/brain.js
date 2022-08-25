window.addEventListener("DOMContentLoaded", init)

function init() {

    /*const net = new brain.NeuralNetwork({ 
        activation:'sigmoid',
        hiddenLayers: [1],
        iterations: 20000,
        learningRate: 0.5 
    });
    const _Data = [
        { input: [0, 0], output: [0] },
        { input: [0, 1], output: [0] },
        { input: [1, 0], output: [0] },
        { input: [1, 1], output: [1] }
    ];
    net.train(_Data);
    console.log(Math.round(net.run([0, 0])[0]));
    console.log(Math.round(net.run([0, 1])[0]));
    console.log(Math.round(net.run([1, 0])[0]));
    console.log(Math.round(net.run([1, 1])[0]));
*/
const net = new brain.recurrent.LSTM();

net.train([
  'doe, a deer, a female deer',
  'ray, a drop of golden sun',
  'me, a name I call myself',
]);

const output = net.run('doe'); // ', a deer, a female deer'
    alert(output);
}