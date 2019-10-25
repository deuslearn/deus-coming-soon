
function main() {

  var lhand = document.getElementById('clock-lhand');
  var bhand = document.getElementById('clock-bhand');

  let time = new Date()
  let mins = ((time.getMinutes()+time.getSeconds()/100)*6)%360 
  let hours = (((time.getHours()%12)*30)+(mins/100))%360
  
  lhand.style.transform = `rotate(${mins}deg)`;
  bhand.style.transform = `rotate(${hours}deg)`;
  // bhand.style.height= `${37-(hours+500)/100}%`
  // bhand.style.top= `${14-(hours-1100)/100}%`

  setInterval(()=>{ 
    time = new Date()
    mins = ((time.getMinutes()+time.getSeconds()/100)*6)%360
    hours= (((time.getHours()%12)*30)+(mins/100))%360
    
    lhand.style.transform = `rotate(${mins}deg)`;
    bhand.style.transform = `rotate(${hours}deg)`;
    // bhand.style.height= `${37-(hours+500)/100}%`
    // bhand.style.top= `${14-(hours-1100)/100}%`
    
  }, 1000);

  let yRot = 0
  let yDir = false
  var anime = document.getElementById('anime');
  var shadow = document.getElementById('shadow');
  setInterval(()=>{
    if(Math.round(yRot*10)/10===1||Math.round(yRot*10)/10===-1)
      yDir=!yDir
    anime.style.transform = `rotate(${yDir?yRot+=.04:yRot-=.04}deg)`;
    shadow.style.left=`${-yRot}px`
  }, 50);

}

window.onload = main;