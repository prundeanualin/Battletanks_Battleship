$(document).ready(function(){
    var grade=0;
$(".imgs").dblclick(function(){
    var img = document.getElementById(this.id);
    if(grade ==0)
    {
        grade = -90;
        img.style.transform = "rotate(" + grade + "deg)";
    }
    else
        grade = 0;
        img.style.transform = "rotate(" + grade + "deg)";
});
});
// function rotatemydick()
// {
// //     var rot = 0;
// //     if(rot == 0){
// //       $("#imagesf").toggleClasss('flip_up');
// //         rot = 1
// //     }
// //     else{
// //       $("#imagesf").toggleClasss('flip_right');
// //       rot = 0;
// //     }
// // }
// var img = document.getElementById("image1");
  
//     var rotations = 0;
//     var rotations = rotations + 1;
//     if (rotations == 2)
//     {
//         img.setAttribute('style','transform:rotate(180deg)');
//         $(".imagesf").css({'transform':'rotate(90deg)'});
//     }
//     else if(rotations > 2)
//     {
//         location.reload();
//     }
//     else
//     {
//        // img.setAttribute("class", "rotated-image");
//         //$(".imagesf").css({'transform': 'rotate(0deg)'});
//     }
// }