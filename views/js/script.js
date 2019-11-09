if(document.getElementById('contactForm'))
{
  Dropzone.options.uploadForm = false;
  var dropzone = new Dropzone("form#uploadForm", {
    url: "/upload_document",
    paramName: 'file', // The name that will be used to transfer the file
    maxFiles: 2,
    maxFilesize: 2, // MB
    addRemoveLinks: true,
    acceptedFiles: ".zip,.rar,.pdf,.docx,.doc",
    accept: function(file, done) {
      // console.log(file)
      if (file.name == "justinbieber.jpg") {
      //   var _ref;
      //  (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        done("No biebers please");
      }
      else { 
        done(); 
      }
    },
    removedfile: function(file) {
      // console.log(file)
      let Http = new XMLHttpRequest();
      Http.open("DELETE", `http://localhost:8084/file/${file.name}`, true)
      Http.send();
      var _ref;
      return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
    }
  });
  
  function processForm(e) {
    console.log(dropzone.files)
    console.log("I won't do it")
    let files = ""
    for(let i=0; i<dropzone.files.length; i++){
      files+=dropzone.files[i].name+(i!==dropzone.files.length-1?",":"")
    }
    if(files){
      let input = document.createElement('input');//prepare a new input DOM element
      input.setAttribute('name', "files");//set the param name
      input.setAttribute('value', files);//set the value
      input.setAttribute('type', "hidden")//set the type

      e.target.appendChild(input);//append the input to the form
    }
      
  }

  var form = document.getElementById('contactForm');
  if (form.attachEvent) {
      form.attachEvent("submit", processForm);
  } else {
      form.addEventListener("submit", processForm);
  }
}

window.onload = () => {

  var lhand = document.getElementById('clock-lhand');
  var bhand = document.getElementById('clock-bhand');

  let time = new Date()
  let mins = ((time.getMinutes()+time.getSeconds()/600)*6)%360 
  let hours = ((60*(time.getHours()%12)+mins/6)*.5)%360
  
  bhand.style.transform = `rotate(${mins}deg)`;
  lhand.style.transform = `rotate(${hours}deg)`;
  
  setInterval(()=>{ 
    time = new Date()
    mins = ((time.getMinutes()+time.getSeconds()/600)*6)%360
    hours= ((60*(time.getHours()%12)+(mins/6))*.5)%360
    
    bhand.style.transform = `rotate(${mins}deg)`;
    lhand.style.transform = `rotate(${hours}deg)`;
    
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

};

window.onbeforeunload = () => {
  let message = "You have attempted to leave this page. If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?";
  return message;
};