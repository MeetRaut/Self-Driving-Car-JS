const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=1;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}
/*
const traffic=[
    new Car(getRandomLaneCenter(),-100,30,50,"DUMMY",2,getRandomColor()),
    new Car(getRandomLaneCenter(),-100,30,50,"DUMMY",2,getRandomColor()),
    new Car(getRandomLaneCenter(),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(getRandomLaneCenter(),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(getRandomLaneCenter(),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(getRandomLaneCenter(),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(getRandomLaneCenter(),-700,30,50,"DUMMY",2,getRandomColor()),
    new Car(getRandomLaneCenter(),-700,30,50,"DUMMY",2,getRandomColor()),
    new Car(getRandomLaneCenter(),-900,30,50,"DUMMY",2,getRandomColor()),
    new Car(getRandomLaneCenter(),-900,30,50,"DUMMY",2,getRandomColor()),
    new Car(getRandomLaneCenter(),-1100,30,50,"DUMMY",2,getRandomColor()),
    new Car(getRandomLaneCenter(),-1100,30,50,"DUMMY",2,getRandomColor())
];
*/

// For loop to add traffic 
const traffic = [];
const carCount = 100; 
const initialY = -100; 
const yIncrement = 200; 

for (let i = 0; i < carCount; i += 2) {
    const yPosition = initialY - (i / 2) * yIncrement;
    traffic.push(new Car(getRandomLaneCenter(), yPosition, 30, 50, "DUMMY", 2, getRandomColor()));
    traffic.push(new Car(getRandomLaneCenter(), yPosition, 30, 50, "DUMMY", 2, getRandomColor()));
}

animate();

function reloadPage() {
    location.reload();
}

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}