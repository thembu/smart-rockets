let rocket;
let population;
let lifespan = 400
let lifeP;
let Gen;
let generation = 0;
let count = 0;
let target;
let stuck;
let s = 0;
let rx = 100;
let ry = 150;
let rw = 200;
let rh = 10
function setup() {
  createCanvas(400, 300)
  rocket = new Rocket()
  population = new Population()
  lifeP =  createP()
  Gen = createP()
  stuck =  createP()
  target = createVector(width/2, 50)
}


function draw() {

  background(0)
  population.run()
  lifeP.html(count)
  Gen.html(`generation : ${generation}`)
  stuck.html(`reached target : ${s}`)
  count++
  if(count == lifespan) {
    population.evaluate()
    population.selection()
   generation++
    count = 0
    s = 0;
  }


  ellipse(target.x ,  target.y , 16, 16)

  fill(255)
  rect(rx,ry,rw,rh)
}


function Population() {
  this.rockets  = []
  this.popsize = 50
  this.matingPool = []

  for(let i = 0 ; i < this.popsize ; i++) {
    this.rockets[i] = new Rocket()
  }

  let maxFitness = 0

  this.evaluate = function() {
           for (let i = 0; i < this.popsize; i++) {
           
            this.rockets[i].calculateFitness()
            if(this.rockets[i].fitness > maxFitness) {
              maxFitness = this.rockets[i].fitness
            }

           }

           for (let i = 0; i < this.popsize; i++) {
           
            this.rockets[i].fitness /= maxFitness;
            
           }

           this.matingPool = []

           for (let i = 0; i < this.popsize; i++) {
           
            let n = this.rockets[i].fitness * 100

            for (let j = 0; j < n; j++) {
              
              this.matingPool.push(this.rockets[i])
              
            }

            
           }
  }


  this.selection = function() {

    let newRockets = []

    for(let i = 0; i < this.rockets.length ; i++) {

    let parentA = random(this.matingPool).dna
    let parentB = random(this.matingPool).dna
    let child = parentA.crossOver(parentB)
    child.mutation()
    newRockets[i] = new Rocket(child)


    }

    this.rockets = newRockets
  }

  this.run = function() {
    for (let i = 0; i < this.popsize; i++) {
      this.rockets[i].update()
      this.rockets[i].show()
      
    }
  }
}


function DNA(genes) {

  if(genes) {

    this.genes = genes
  }
  else {

  this.genes = []
  for(var i = 0 ; i < lifespan; i++) {
    this.genes[i] = p5.Vector.random2D()
    this.genes[i].setMag(0.1)
  }
  }
  this.crossOver = function(parent) {
    let newgenes = []

    let mid = floor(random(this.genes.length))

    for (let i = 0; i < this.genes.length; i++) {
              if(i > mid)  {
                newgenes[i] = this.genes[i]
              }
              else {
                    newgenes[i] = parent.genes[i]
              }

            }
            return new DNA(newgenes)


  }


  this.mutation  = function() {
    for(var i = 0; i < this.genes.length ; i++) {
      if(random(1) < 0.01) {
        this.genes[i] = p5.Vector.random2D()
        this.genes[i].setMag(0.2)
      }
    }
  }
}
  


function Rocket(dna) {

  this.pos = createVector(width/2, height)
  this.vel = createVector()
  this.acc = createVector()
  this.completed = false;
  this.crahed = false;
  if(dna) {
    this.dna = dna
  }else {
  this.dna = new DNA()
  }

  this.applyForce =  function(force) {
    this.acc.add(force)
  }

  this.calculateFitness = function() {
    let d = dist(this.pos.x , this.pos.y , target.x, target.y)
    this.fitness = 1/d;

    if(this.completed) {
      this.fitness *= 10
    }
    if(this.crahed) {
      this.fitness /=  10
    }

  }

  this.update = function () {

    let d = dist(this.pos.x , this.pos.y, target.x , target.y)
    if(d < 10 ) {
      this.completed = true
      s++;
    }

    if(this.pos.x > rx && this.pos.x < rx + rw && this.pos.y > ry && this.pos.y < ry + rh) {
        this.crahed = true
    }

    if(this.pos.x > width ||  this.pos.x < 0) {
       this.crahed = true
    }
    if(this.pos.y > height ||  this.pos.y < 0 ) {
      this.crahed = 0
    }
   
    this.applyForce(this.dna.genes[count])
    if(!this.completed && !this.crahed) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.acc.mult(0);
    this.vel.limit(4)
    }
  }


  this.show = function (params) {
    push()
    noStroke()
    fill(255,150)
    translate(this.pos.x , this.pos.y)
    rotate(this.vel.heading())
    rectMode(CENTER)
    rect(0,0,25,5)
    pop()
  }


}