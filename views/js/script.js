
function main() {

  var lhand = document.getElementById('clock-lhand');
  var bhand = document.getElementById('clock-bhand');

  let time = new Date()
  let mins = ((time.getMinutes()+time.getSeconds()/100)*6)%360 
  
  lhand.style.transform = `rotate(${mins}deg)`;
  bhand.style.transform = `rotate(${(((time.getHours()%12)*30)+(mins/100))%360}deg)`;

  setInterval(()=>{ 
    time = new Date()
    mins = ((time.getMinutes()+time.getSeconds()/100)*6)%360
    lhand.style.transform = `rotate(${mins}deg)`;
    bhand.style.transform = `rotate(${(((time.getHours()%12)*30)+(mins/100))%360}deg)`;
    // img.style.bottom = `${lhand.baseY+lhand.rot/lhand.baseY}px`;
    // img.style.left = `${lhand.currX++}px`;
    // console.log(img.style.bottom)
    
  }, 1000);

  let yRot = 0
  let yDir = false
  var anime = document.getElementById('anime');
  var shadow = document.getElementById('shadow');
  setInterval(()=>{
    if(Math.floor(yRot)===2||Math.floor(yRot)===-2)
      yDir=!yDir
    anime.style.transform = `rotate(${yDir?yRot+=.05:yRot-=.05}deg)`;
    shadow.style.left=`${-yRot}px`
  }, 50);

}

window.onload = main;