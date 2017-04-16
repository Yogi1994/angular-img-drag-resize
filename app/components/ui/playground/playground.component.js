'use strict';

// Define the `playground` module
var playground  = angular.module('playground', []);


function make_base_img(context, imgsrc, x, y, width, height){
  this.base_image.src = imgsrc;
  context.drawImage(this.base_image, x, y, width, height);
}


function _handleMouseDown(e){
  this.canMouseX=parseInt(e.clientX);
  this.canMouseY=parseInt(e.clientY);
  // set the drag flag
  this.isDragging=true;
}

function _handleMouseUp(e){
  this.canMouseX=parseInt(e.clientX);
  this.canMouseY=parseInt(e.clientY);
  // clear the drag flag
  this.isDragging=false;
}

function _handleMouseOut(e){
  this.canMouseX=parseInt(e.clientX);
  this.canMouseY=parseInt(e.clientY);
  // user has left the canvas, so clear the drag flag
  this.isDragging=false;
}

function _handleMouseMove(e){
  this.canMouseX=parseInt(e.clientX);
  this.canMouseY=parseInt(e.clientY);
  // if the drag flag is set, clear the canvas and draw the image
  if(this.isDragging){
    this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
    this.x = this.canMouseX-this.width/2;
    this.y = this.canMouseY-this.height/2;

    this.setImage(this.context,this.imgsrc,this.x,this.y,this.width,this.height);
  }
}

function drawRotated(){
  this.context.clearRect(0,0,this.canvasWidth,this.canvasWidth);
  this.context.save();
  this.context.translate(this.width,this.height);
  this.context.rotate(this.rotateAngle*Math.PI/180);
  this.context.drawImage(this.base_image, this.x, this.y, -this.width,-this.height);
  // this.setImage(this.context,this.imgsrc,this.x,this.y,this.width,this.height);
  this.context.restore();
}


function setBackground(e) {
  this.bgurl = e.target.result;
  this.canvas.style.background = "url("+ this.bgurl +")";
}

function backgroundChangeX(element){
  if (element.files && element.files[0]) {
    var reader = new FileReader();            
    reader.onload = setBackground.bind(this);
    reader.readAsDataURL(element.files[0]);
  }
}

// Register `playground` component, along with its associated controller and template
playground.
  component('playground', {
    templateUrl: 'components/ui/playground/playground.template.html',
    controller: 

      function PlaygroundController() {
        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
        this.imgsrc = 'http://www.samskirrow.com/background.png';
        this.x = 100;
        this.y = 100;
        this.height = 300;
        this.width = 300;
        this.isDragging = false
     
        this.canvasWidth=this.canvas.width;
        this.canvasHeight=this.canvas.height;
        this.canMouseX;
        this.canMouseY;
        this.imgsrc = 'img/wig1.png';
        this.base_image = document.createElement('img');
        this.setImage = make_base_img.bind(this);
        this.imageload =true;
        this.rotateAngle = 0; //in degrees
        this.setImage(this.context,this.imgsrc,this.x,this.y,this.width,this.height );

        this.bgurl = 'img/bg.jpg';
        this.canvas.style.background = "url("+ this.bgurl +")";
        

        this.drawRotated = drawRotated.bind(this);

        this.backgroundChange = backgroundChangeX.bind(this);


        this.handleMouseDown = _handleMouseDown.bind(this);
        this.handleMouseMove = _handleMouseMove.bind(this);
        this.handleMouseUp = _handleMouseUp.bind(this);
        this.handleMouseOut = _handleMouseOut.bind(this);


        this.canvas.addEventListener("mousedown", this.handleMouseDown, false);
        this.canvas.addEventListener("mousemove", this.handleMouseMove, false);
        this.canvas.addEventListener("mouseup", this.handleMouseUp, false);
        this.canvas.addEventListener("mouseout", this.handleMouseOut, false);

      }
  });

