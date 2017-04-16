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
  // console.log(this, e);
  this.canMouseX=parseInt(e.clientX);
  this.canMouseY=parseInt(e.clientY);

  var nearTop = checkCloseEnough(this.canMouseY, this.y, this.closeEnough);
  var nearBottom = checkCloseEnough(this.canMouseY, this.y + this.height, this.closeEnough);

  var nearLeft = checkCloseEnough(this.canMouseX, this.x, this.closeEnough);
  var nearRight = checkCloseEnough(this.canMouseX, this.x + this.width, this.closeEnough);

  var nearRotateHandle = (checkCloseEnough(this.canMouseX, this.x + this.width/2, 20) && checkCloseEnough(this.canMouseY, this.y , 20));

  // 1. top left
  if (nearTop && nearLeft) {
      this.dragTL = true;
      console.log("TL");
      if(this.isDragging){
        this.width += this.x - this.canMouseX;
        this.height += this.y - this.canMouseY;
        this.x = this.canMouseX;
        this.y = this.canMouseY;
        // console.log(this.width, this.height, this.x, this.y);
        this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
        this.setImage(this.context,this.imgsrc,this.x,this.y,this.width,this.height);
        this.drawHandles();
      }
  }
  // 2. top right
  else if (nearTop && nearRight) {
      this.dragTR = true;
      console.log("TR");
      if(this.isDragging){

        this.width = Math.abs(this.x - this.canMouseX);
        this.height += this.y - this.canMouseY;
        this.y = this.canMouseY;

        console.log(this.width, this.height, this.x, this.y);
        this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
        this.setImage(this.context,this.imgsrc,this.x,this.y,this.width,this.height);
        this.drawHandles();
      }

  }
  // 3. bottom left
  else if (nearBottom && nearLeft) {
      this.dragBL = true;
      console.log("BL");
      if(this.isDragging){
        this.width += this.x - this.canMouseX;
        this.height = Math.abs(this.y - this.canMouseY);
        this.x = this.canMouseX;

        console.log(this.width, this.height, this.x, this.y);
        this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
        this.setImage(this.context,this.imgsrc,this.x,this.y,this.width,this.height);
        this.drawHandles();
      }
  }
  // 4. bottom right
  else if (nearBottom && nearRight) {
      this.dragBR = true;
      console.log("BR");
      if(this.isDragging){
        this.width = Math.abs(this.x - this.canMouseX);
        this.height = Math.abs(this.y - this.canMouseY);
        
        console.log(this.width, this.height, this.x, this.y);
        this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
        this.setImage(this.context,this.imgsrc,this.x,this.y,this.width,this.height);
        this.drawHandles();
      }
  }
  // (5.)  if the drag flag is set and inside dragable area, clear the canvas and draw the image
  else if(this.isDragging && this.isDragable(this.canMouseX, this.canMouseY, this.x, this.y)){
    this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
    this.x = this.canMouseX-this.width/2;
    this.y = this.canMouseY-this.height/2;

    this.setImage(this.context,this.imgsrc,this.x,this.y,this.width,this.height);
    this.drawHandles();
  } else if(nearRotateHandle && this.isDragging) {
    // console.log('rotate');
    
    var diffx = this.canMouseX - this.beforeDragx;
    var diffy = this.canMouseY - this.beforeDragy;

    if(Math.abs(diffy) > Math.abs(diffx)){
      if(Math.abs(diffx) > 1){
        this.beforeDragx = this.canMouseX;
        this.rotateAngle += (diffy*0.2);
      }
      
    }else {
      if(Math.abs(diffy) > 1){
        this.beforeDragy = this.canMouseY;
        this.rotateAngle += (diffx*0.2);
      }
    }
    // console.log(this.rotateAngle, this.rotateAngle*Math.PI/180);

    this.context.clearRect(0,0,this.canvasWidth,this.canvasWidth);
    this.context.save();
    this.context.translate(this.width/2,this.height/2);
    this.context.rotate(this.rotateAngle*Math.PI/180);
    // this.x = this.x - this.
    this.drawHandles(true);
    this.context.drawImage(this.base_image, this.x +this.width/2, this.y + this.height/2, -this.width,-this.height);
    this.context.restore();

  }else if(this.isDragging === false){
    this.beforeDragx = this.canMouseX;
    this.beforeDragy = this.canMouseY;
  }
}

/** 
 * Utility function to check if the mouse is close to the corner.
 */
function checkCloseEnough(p1, p2, closeEnough) {
    return Math.abs(p1 - p2) < closeEnough;
}


/**
 * This will set the background of the canvas.
 */
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

function setHeadImage(e) {
  this.imgsrc = e.target.result;
  this.setImage(this.context,this.imgsrc,this.x,this.y,this.width,this.height );
}

function headChange(element) {
  if (element.files && element.files[0]) {
    var reader = new FileReader();            
    reader.onload = setHeadImage.bind(this);
    reader.readAsDataURL(element.files[0]);
  }
}

/**
 * This will ensure if the mouse touch and move is inside the image area.
 * If not then do not drag.
 */
function _isDragable(mousex, mousey){
  var diffx = mousex -(this.x + 20);
  var xInside = true;
  if(diffx < 0 || diffx > this.width -20){
    xInside = false;
  }
  var diffy = mousey -(this.y + 20);
  var yInside = true;
  if(diffy < 0 || diffy > this.height -20){
    yInside = false;
  }
  return (xInside && yInside);
}


function drawCircle(x, y, radius, color) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fill();
}

//These handles will be used to scale the image.
function drawHandles(isRotate) {
    var rotate = 0;
    if(isRotate){
      rotate = 1;
    }

    this.drawCircle(this.x - (rotate*this.x), this.y-(rotate*this.y), this.closeEnough, "#F00");
    this.drawCircle(this.x + this.width  - (rotate*(this.x )), this.y-(rotate*this.y), this.closeEnough, "#0F0" );
    this.drawCircle(this.x + this.width  - (rotate*(this.x )), this.y + this.height -(rotate*(this.y)), this.closeEnough, "#00F");
    this.drawCircle(this.x - (rotate*this.x), this.y + this.height -(rotate*(this.y )), this.closeEnough, "#000");

    this.drawCircle(this.x + this.width/2 - rotate*(this.x ), (this.y -40) - rotate*(this.y), 40, "#acacac");
}

function drawRotated(degrees){
    this.context.clearRect(0,0,this.canvasWidth,this.canvasWidth);
    this.context.save();
    this.context.translate(this.width,this.height);
    this.context.rotate(this.rotateAngle*Math.PI/180);
    this.drawHandles(true);
    this.context.drawImage(this.base_image, this.x, this.y, -this.width,-this.height);
    // this.setImage(this.context,this.imgsrc,this.x,this.y,this.width,this.height);
    this.context.restore();
}

// Register `playground` component, along with its associated controller and template
playground.
  component('playground', {
    templateUrl: 'components/ui/playground/playground.template.html',
    controller: 

      function PlaygroundController($scope) {
        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
        this.imgsrc = 'http://www.samskirrow.com/background.png';
        this.x = 100;
        this.y = 100;
        this.height = 300;
        this.width = 300;
        this.isDragging = false
        this.closeEnough = 10;
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
        this.x++;
        this.bgurl = 'img/bg.jpg';
        this.canvas.style.background = "url("+ this.bgurl +")";
        
        this.isDragable = _isDragable.bind(this);
        this.drawRotated = drawRotated.bind(this);
        this.drawHandles = drawHandles.bind(this);
        this.drawCircle = drawCircle.bind(this);

        this.beforeDragx = this.x ;
        this.beforeDragy = this.y ;

         $scope.coordinate = function($event){
            // console.log($scope);
            $scope.x = $event.x;
            $scope.y = $event.y;
            
         }

        // this.
        this.drawHandles();
        this.backgroundChange = backgroundChangeX.bind(this);

        this.headChange = headChange.bind(this);

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

