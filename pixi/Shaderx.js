//si

let app = new PIXI.Application({ 
        width:1000,
        height:1000,
        antialias: false, 
        transparent: true, 
        forceCanvas: false,
        autoResize: true,
        legacy: true,

       

    }
    );
 PIXI.BLEND_MODES["MULTIPLY"];
 PIXI.RENDERER_TYPE["WEBGL"];
function resize() {app.renderer.view.style.position = 'absolute';app.renderer.view.style.left = ((window.innerWidth - app.renderer.width) >> 1) + 'px';app.renderer.view.style.top = ((window.innerHeight - app.renderer.height) >> 1) + 'px';} resize();
window.addEventListener('resize', resize);
app.renderer.view.width =1000;
app.renderer.view.height =1000;
document.body.appendChild(app.view);
var sprite=null;
var fin = false;
var tipo = null;
 var i = 0;
 var word = null;
 var filter = null;
 var  srcvideo,srcimagen;
 var imagen;
 var animate = false;
let filtros =["Brillo.frag","Escaner.frag","Tierra.frag","Pixel.frag","Llama.frag","Glitch1.frag","Glitch2.frag","Disformidad.frag","RedStorm.frag","RedStorm2.frag","RedStorm3.frag"];

function MoveFilters()
{
    document.getElementById("filtro").innerHTML = "Filtro:" + filtros[i];
    word = filtros[i];
}

function Animados()
{
    if(animate)
    {
        animate=false;
        alert("Filtros animados desactivados");
    }else{
        animate=true;
        alert("Filtros animados activados");
        if(sprite != null)
        {
            
        }
       
    }
    modo();
}
MoveFilters();
modo();
 function NextFiltro()
 {
  
   
    if(sprite!=null)
        {
        PIXI.loader.reset();
        app.stage.filters = null;
           delete PIXI.loader.resources['shader'];
             if(animate)
            {
               
                LoadAnimateFilter();
           }else{
        LoadFilter();
    }
        if(tipo.includes("video"))
                {  
                 IsVideo();
                }else if(tipo.includes("image"))
                { 
                
               IsImage();
                
                }
        }else{
         if(animate)
         {
           
          LoadAnimateFilter();
        }else{
           LoadFilter();
        }
        if(tipo.includes("video"))
                {  
                 IsVideo();
                }else if(tipo.includes("image"))
                { 
                
               IsImage();
                
                } 
        }
     
 }
 function modo()
 {
    var aux;
    if(animate == false)
    {
aux = "Normal";
    }else{
aux = "Animado";
        }
    
     document.getElementById("mod").innerHTML = "Modo Filtros:" + aux;
    
 }

function readURL(input) {
            if (input.files && input.files[0]) {
                //alert(input.files[0].size / 1024 / 1024);
                var reader = new FileReader();
                 tipo =input.files[0].type;
                 if(tipo.includes("video"))
                { 
  reader.onload = function(e) {
 srcvideo = reader.result;
  

} 
reader.readAsDataURL(input.files[0]); 


}else if(tipo.includes("image"))
{
                

                reader.onload = function (e) {
                   

                         document.getElementById("image").src = reader.result;
                      

                };
                reader.readAsDataURL(input.files[0]);
            }
               
             imagen =  document.getElementById("image");
              NextFiltro();
               
            }
        }


function Next()
{
   
    if(i==filtros.length-1)
    {
        
        i = 0;
        
    }else
    {
      
        i++;
       
    }
    if(tipo == null)
    {
        MoveFilters();
    }else{
        MoveFilters();
        NextFiltro();
    }
    
   

    }

function setImageVisible(id, visible) {
    var img = document.getElementById(id);
    img.style.visibility = (visible ? 'visible' : 'hidden');
}

function DescargarVideo(sprite, fileName) {
    app.renderer.extract.canvas(app.stage).toBlob(function(b){
        var a = document.createElement('a');
        document.body.append(a);
        a.download = fileName;
        a.href = URL.createObjectURL(b);
        a.click();
        a.remove();
    }, 'video/MP4');
}
function onload()
{
    
 sprite = new PIXI.Sprite.fromImage(imagen.src);
 sprite.width = 900;
 sprite.height = 800;
 app.stage.addChild(sprite)
app.render()
if(filter != null)
 {
   app.stage.filters = [filter];
}else
{
    alert("No se ha cargado un filtro");
}
fin = true;
}
function DescargarImagen(sprite, fileName) {
    app.renderer.extract.canvas(app.stage).toBlob(function(b){
        var a = document.createElement('a');
        document.body.append(a);
        a.download = fileName;
        a.href = URL.createObjectURL(b);
        a.click();
        a.remove();
    }, 'image/png');
}
function IsImage() {
      app.start(); 
    setImageVisible("image",false);
imagen.crossOrigin = 'anonymous';
     if(sprite!=null)
     {

        sprite.filter = null;
        sprite.parent.removeChild(sprite);
        sprite.destroy({children:true, texture:true, baseTexture:true});
      
     }  

PIXI.loader.load(onload);
  
}

function IsVideo()
{
     app.start();
    const button = new PIXI.Graphics()
    .beginFill(0x0, 0.5)
    .drawRoundedRect(0, 0, 100, 100, 10)
    .endFill()
    .beginFill(0xffffff)
    .moveTo(36, 30)
    .lineTo(36, 70)
    .lineTo(70, 50);

button.x = (app.screen.width - button.width) / 2;
button.y = (app.screen.height - button.height) / 2;
button.interactive = true;
button.buttonMode = true;
app.stage.addChild(button);
button.on('pointertap', onPlayVideo);


function onPlayVideo() {
//setImageVisible("video",false);
button.destroy();
const video =  document.createElement('video')
video.crossOrigin = 'anonymous'
video.preload = ''
video.src = srcvideo;
 sprite = PIXI.Sprite.from(video)
 if(filter != null)
 {
  app.stage.filters = [filter];
}else
{
    alert("No se ha cargado un filtro");
}
app.stage.addChild(sprite)
app.render()
fin = true;
}
}

function LoadFilter()
{
   
    if(word == null)
    {
  alert("No hay ningun filtro para ser cargado")
    }else
    {
    app.stop();
 PIXI.loader.add(imagen.src);
 PIXI.loader.add('shader', './Shaders/' + word).load(onLoaded);

// Handle the load completed
function onLoaded(loader, res) {
    // Create the new filter, arguments: (vertexShader, framentSource)
    filter = new PIXI.Filter(null, res.shader.data);
    // Add the filter
  let width = app.renderer.view.width;
  let height = app.renderer.view.height;
    filter.uniforms.u_resolution= [width, height];
    if(animate==false)
    {
    filter.uniforms.u_time = [89.0];  
}



}
}
}
function IsImageAnimate() {
      app.start(); 
    setImageVisible("image",false);
const imagen =  document.getElementById("image");
imagen.crossOrigin = 'anonymous'
 sprite = PIXI.Sprite.from(imagen);
 sprite.width = 900;
 sprite.height = 800;
  if(filter != null)
 {
 app.stage.filters = [filter];
}else
{
    alert("No se ha cargado un filtro");
}
app.stage.addChild(sprite)
app.render()
fin = true;
}

function LoadAnimateFilter()
{
    if(word == null)
    {
  alert("No hay ningun filtro para ser cargado")
    }else
    {
    app.stop();
 PIXI.loader.add(imagen.src);
 PIXI.loader.add('shader', './Shaders/' + word).load(onLoaded);
// Handle the load completed
function onLoaded(loader, res) {
    // Create the new filter, arguments: (vertexShader, framentSource)
    filter = new PIXI.Filter(null, res.shader.data);
    // Add the filter
  let width = window.innerWidth;
  let height = window.innerHeight;
    filter.uniforms.u_resolution= [width, height];
    filter.uniforms.u_time = [1.0];  
    app.ticker.add(function(delta) {
    filter.uniforms.u_time[0] += 0.05;  // Change time to animate the transition of red 
});

}
}
}


 function Finalizar(){
    if(fin)
    {
        if(tipo.includes("video"))
                {  
                // DescargarVideo(sprite,"video");
                alert("Aun no se pueden descargar videos");
                }else if(tipo.includes("image"))
                {

                 DescargarImagen(sprite,"imagen");
                }
   
}else
{
    alert("No hay datos para guardar");
}
};

    app.start();






