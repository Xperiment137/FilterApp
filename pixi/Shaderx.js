document.addEventListener("DOMContentLoaded", () => {
  // Inicialización Pixi
  let app = new PIXI.Application({ 
    width:1000,
    height:1000,
    antialias: false, 
    transparent: true, 
    autoResize: true,
    legacy: true,
  });
  document.body.appendChild(app.view);

  // Variables globales
  let sprite=null, fin=false, tipo=null, i=0, filter=null;
  let srcvideo, imagen, animate=false, shader=null, mio=false, time=0;
  let filtros =[
    "Brillo.frag","Escaner.frag","Tierra.frag","Pixel.frag","Llama.frag",
    "Glitch1.frag","Glitch2.frag","Disformidad.frag","RedStorm.frag",
    "RedStorm2.frag","RedStorm3.frag","Celulas.frag","Abstracto.frag","Bruma.frag"
  ];
  let word = filtros[0];

  // Control de velocidad
  document.getElementById('slide').onchange = function() {
    if(animate) time = this.value/1000;
  };

  function MoveFilters() {
    document.getElementById("filtro").innerText = "Filtro: " + filtros[i];
    word = filtros[i];
  }

  function modo() {
    document.getElementById("mod").innerText = "Modo Filtros: " + (animate ? "Animado" : "Normal");
  }

  // Cargar shaders propios
  window.openFile = function(input) {
    mio = true;
    var reader = new FileReader();
    reader.onload = function(){
      shader = reader.result;
      document.getElementById("etiqueta").innerText = input.files[0].name;
    };
    reader.readAsText(input.files[0]);
  };

  // Subida de imagen/video
  document.getElementById("uploadImage").addEventListener("change", e => {
    let input = e.target;
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      tipo = input.files[0].type;

      if(tipo.includes("video")) { 
        reader.onload = e => { srcvideo = e.target.result; };
        reader.readAsDataURL(input.files[0]);
      } else if(tipo.includes("image")) {
        reader.onload = e => {
          document.getElementById("image").src = e.target.result;
          document.getElementById("image").classList.remove("hidden");
        };
        reader.readAsDataURL(input.files[0]);
      }
      imagen = document.getElementById("image");
      NextFiltro();
    }
  });

  // Cambiar de filtro
  document.getElementById("btnNext").addEventListener("click", () => {
    i = (i+1) % filtros.length;
    MoveFilters();
    if(tipo) NextFiltro();
  });

  function NextFiltro() {
    if(sprite) {
      app.stage.filters = null;
      delete PIXI.loader.resources['shader'];
    }
    if(animate) LoadAnimateFilter(); else LoadFilter();
    if(tipo?.includes("video")) IsVideo(); else if(tipo?.includes("image")) IsImage();
  }

  function LoadFilter() {
    if(!word) return alert("No hay filtro cargado");
    app.stop();
    PIXI.loader.add(imagen.src);
    PIXI.loader.add('shader', './Shaders/' + word).load((loader, res) => {
      filter = mio ? new PIXI.Filter(null, shader) : new PIXI.Filter(null, res.shader.data);
      filter.uniforms.u_resolution= [app.renderer.view.width, app.renderer.view.height];
      if(!animate) filter.uniforms.u_time = [89.0];
    });
  }

  function LoadAnimateFilter() {
    if(!word) return alert("No hay filtro cargado");
    app.stop();
    PIXI.loader.add(imagen.src);
    PIXI.loader.add('shader', './Shaders/' + word).load((loader, res) => {
      filter = mio ? new PIXI.Filter(null, shader) : new PIXI.Filter(null, res.shader.data);
      filter.uniforms.u_resolution= [app.renderer.view.width, app.renderer.view.height];
      filter.uniforms.u_time = [1.0];  
      app.ticker.add(delta => filter.uniforms.u_time[0] += time);
    });
  }

  function IsImage() {
    app.start(); 
    imagen.crossOrigin = 'anonymous';
    if(sprite) sprite.destroy({children:true, texture:true, baseTexture:true});
    PIXI.loader.load(() => {
      sprite = new PIXI.Sprite.fromImage(imagen.src);
      sprite.width = 900; sprite.height = 800;
      app.stage.addChild(sprite);
      if(filter) app.stage.filters = [filter];
      app.render();
      fin = true;
    });
  }

  function IsVideo() {
    app.start();
    const button = new PIXI.Graphics()
      .beginFill(0x0, 0.5).drawRoundedRect(0, 0, 100, 100, 10).endFill()
      .beginFill(0xffffff).moveTo(36, 30).lineTo(36, 70).lineTo(70, 50);
    button.x = (app.screen.width - button.width) / 2;
    button.y = (app.screen.height - button.height) / 2;
    button.interactive = true; button.buttonMode = true;
    app.stage.addChild(button);
    button.on('pointertap', () => {
      button.destroy();
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous'; video.src = srcvideo;
      sprite = PIXI.Sprite.from(video);
      if(filter) app.stage.filters = [filter];
      app.stage.addChild(sprite);
      app.render(); fin = true;
    });
  }

  // Descargar imagen
  function DescargarImagen(sprite, fileName) {
    app.renderer.extract.canvas(app.stage).toBlob(b => {
      let a = document.createElement('a');
      document.body.append(a);
      a.download = fileName;
      a.href = URL.createObjectURL(b);
      a.click(); a.remove();
    }, 'image/png');
  }

  // Botones principales
  document.getElementById("btnAnimados").addEventListener("click", () => {
    animate = !animate;
    time = animate ? document.getElementById("slide").value/1000 : 0;
    alert("Filtros animados " + (animate ? "activados" : "desactivados"));
    modo();
  });

  document.getElementById("btnGuardar").addEventListener("click", () => {
    if(fin) {
      if(tipo.includes("video")) alert("Descarga de vídeo aún no disponible");
      else if(tipo.includes("image")) DescargarImagen(sprite,"imagen.png");
    } else alert("No hay datos para guardar");
  });

  // Inicializar
  MoveFilters();
  modo();
  app.start();
});
