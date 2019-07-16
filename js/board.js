$("document").ready(function(){

var c2 = document.getElementById("board_grid2");
var ctx2 = c2.getContext("2d");
var c=document.getElementById("board_grid");
var ctx=c.getContext("2d");
var coord = document.getElementById("coord");
var dim = 50;
var mpos;

var xRc;
var yRc;
var wR;
var hR;
var img0 = document.getElementById("img0");
var img1 = document.getElementById("img1");
var img2 = document.getElementById("img2");
var img3 = document.getElementById("img3");
var img4 = document.getElementById("img4");
var images = [{img0, xRc:200, yRc:200, wR:100, hR:50},
{img1, xRc:0, yRc:50, wR:150, hR:50},
{img2, xRc:0, yRc:100, wR:150, hR:50},
{img3, xRc:0, yRc:150, wR:200, hR:50},
{img4, xRc:0, yRc:200, wR:250, hR:50},];
var rect = [];
function Tank(pic, xC, yC, w, h)
{
    this.pic = pic;
    this.xC = xC;
    this.yC = yC;
    this.w = w;
    this.h = h;
    c.drawImage(pic, xC,yC,w,h);
}
for (var x = 0; x < 10; x++) {
    for (var y = 0; y < 10; y++) {
        for(var i=0; i<10; i++){
      ctx.rect(x * dim, y * dim, dim , dim ,);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
    }}
  }

      for (var x = 0; x < 10; x++) {
        for (var y = 0; y < 10; y++) {
          ctx.rect(x * dim, y * dim, dim , dim ,);
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#000000';
          ctx.stroke();
        }
      }
        
      
      function highlight_cell(ctx, x, y, dim) {
        ctx.beginPath();
        ctx.rect(x * dim + 1, y * dim + 1, dim - 2, dim - 2);
        ctx.fillStyle = "#84BDA6";
        ctx.fill();
      }
      function getMousePos(c, evt) {
        var rect = c.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
      $("#board_grid").mousemove(onMouseMove);
      c.addEventListener('mousemove', function(e){
        mpos = getMousePos(c, e);
        var mposx = Math.ceil(mpos.x/50);
        var mposy = Math.ceil(mpos.y/50);      
        coord.innerText = "Coordinates are " + mposx + " and " + mposy;

        ctx.fillRect(mposx, mposy, 50,50);
        ctx.fillStyle = "#84BDA6";
        }, false);
     
        function draw(image){

        }
        // let xcoord = Math.floor(x / dim);
        // let ycoord = Math.floor(y/ dim);
      
    //   img5.src = "../photos/gtank_x.png";
    //   img5.onload = function()
    //   {
    //     img5(0,200, 150,50);
    //   };
    images[0] = ctx.drawImage(images[0].img0, images[0].xRc, images[0].yRc,
        images[0].wR, images[0].hR);
    // images[1] = ctx.drawImage(images[1].img1, images[1].xRc, images[1].yRc,
    //     images[1].wR, images[1].hR);
    // images[2] = ctx.drawImage(images[2].img2, images[2].xRc, images[2].yRc,
    //     images[2].wR, images[2].hR);
    // images[3] = ctx.drawImage(images[3].img3, images[3].xRc, images[3].yRc,
    //     images[3].wR, images[3].hR);
    // images[4] = ctx.drawImage(images[4].img4, images[4].xRc, images[4].yRc,
    //     images[4].wR, images[4].hR);    

    var images = document.getElementsByClassName("imgs");
    // images.onclick = function(){
    //     images[0].hR = 20;
    //     images[0] = ctx.drawImage(images[0].img0, images[0].xRc, images[0].yRc,
    //         images[0].wR, images[0].hR);
    // };
    
    // $(".imgs").dblclick(function(){
    //     images[0].hR = 20;
    //     ctx.save();
    //     ctx.clearRect(0, 0, 500, 500);
    //     ctx.rotate(Math.PI/2);
    //    images[0]= ctx.drawImage(images[0].img0, images[0].xRc, images[0].yRc,
    //       images[0].wR, images[0].hR);
    //     ctx.restore();
    // });

    function onMouseMove(e)
    {
        mpos = getMousePos(c, e);
        var mposx = Math.ceil(mpos.x);
        var mposy = Math.ceil(mpos.y);   
        images[0].xRc = mposx;
        images[0].yRc = mposy;
        
    }

    });