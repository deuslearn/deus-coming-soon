let dropzone = null
let dz = {
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
}

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

Dropzone.options.uploadForm = false;

let showDropZone = () => {
  console.log("hello")
  dropzone = new Dropzone("form#uploadForm", dz);
  
  var form = document.getElementById('contactForm');
  var upform = document.getElementById('uploadForm');
  upform.style.visibility = "unset"
  upform.style.height = "unset"
  upform.style.minHeight = "unset"
  upform.style.maxHeight = "unset"
  upform.style.padding = "unset"

  if (form.attachEvent) {
      form.attachEvent("submit", processForm);
  } else {
      form.addEventListener("submit", processForm);
  }

  let plus =document.getElementById("add-drop")
  plus.parentNode.removeChild(plus);
}

let clockAnimation = () => {

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
}

function fixbody(x){
  let html = document.getElementsByTagName("html")[0]
  let body = document.getElementsByTagName("body")[0]
  if (!x.matches){
    html.style.width="100%"
    html.style.height="100%"
    body.style.width="100%"
    body.style.height="100%"
    return
  }
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  html.style.width=w+"px"
  html.style.height=h+"px"
  body.style.width=w+"px"
  body.style.height=h+"px"
};

window.onload = () => {

  let plus =document.getElementById("add-drop")
  if(plus){
    plus.addEventListener("click",showDropZone,false)
    console.log(plus)
  }
  
  var x = window.matchMedia("(max-width: 1000px)")
  fixbody(x) // Call listener function at run time
  x.addListener(fixbody) // Attach listener function on state changes\
  
  if(document.getElementById("anime-top"))
    clockAnimation()
};

window.onbeforeunload = () => {
  // let message = "You have attempted to leave this page. If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?";
  // return message;
};