/**
 *
 *  CoverFlow using CSS3
 *
 *  @author: Hjörtur Elvar Hilmarsson
 *
 **/
var coverflow = {};

coverflow.init = function () {

  // Local variables
  var _index = 0,
    _coverflow = null,
    _prevLink = null,
    _nextLink = null,
    _items = [],
    _titles = [],
    _descriptions = [],
    _transformName = 'transform',


    // Constants
  ROTATION = 25; // degrees
  BASE_ZINDEX = 10; // 
  MAX_ZINDEX = 42; // 

  //_items = Array.prototype.slice.call(document.querySelectorAll('.item'));

  
  /**
   * Get selector from the dom
   **/
  function get(selector) {
    return document.querySelector(selector);
  };

  /**
   * Renders the CoverFlow based on the current _index
   **/
  function render() {
    if (_index < 0 || _index >= coverflow.data.dataLength) {
      return;
    } else {
      for (var i = 0; i < coverflow.data.dataLength; i++) {



        // before 
        if (i < _index ) {
          _items[i].style[_transformName] = "translateX( -" + ((OFFSET - (OFFSET / Math.pow(1.5, (_index - i)))) * 4) + "px )";
          _items[i].style.zIndex = BASE_ZINDEX + i;
          _itemImages[i].style[_transformName] = "rotateY( " + ROTATION + "deg )";
          _itemImages[i].style.boxShadow = "rgba(0,0,0,0.5) -5px 5px 0px";
          _itemImages[i].className = "item-image";

          _titles[i].style[_transformName] = "translateX( -" + (200 * (_index - i)) + "px )";
          _titles[i].className = "";
          _items[i].className = "item";
          _descriptions[i].style.display = "none";
        }

        // current
        if (i === _index) {
          _items[i].style[_transformName] = "scale(1.2)";
          _items[i].style.zIndex = MAX_ZINDEX;
          _itemImages[i].style[_transformName] = "rotateY( 0deg )";
          _itemImages[i].style.boxShadow = "none";
          _itemImages[i].className = "item-image";

          _titles[i].style[_transformName] = "translateX(0px)";
          _titles[i].className = "title-active";
          _items[i].className = "item item-active";
          _descriptions[i].style.display = "block";

        }

        // after
        if (i > _index) {
          _items[i].style[_transformName] = "translateX( " + ((OFFSET - (OFFSET / Math.pow(1.5, (i - _index)))) * 4) + "px )";
          _items[i].style.zIndex = BASE_ZINDEX + (coverflow.data.dataLength - i);
          _itemImages[i].style[_transformName] = "rotateY( -" + ROTATION + "deg )";
          _itemImages[i].style.boxShadow = "rgba(0,0,0,0.5) 5px 5px 0px";
          _itemImages[i].className = "item-image";

          _items[i].className = "item";

          _titles[i].style[_transformName] = "translateX( " + (200 * (i - _index)) + "px )";
          _titles[i].className = "";
          _descriptions[i].style.display = "none";

        }

        // hidden left
        if (i < (_index - 4) || i > (_index + 4)) {
          _itemImages[i].className = "item-image hidden";
        }

      }
    }
    // loop through items & transform positions


  };

  /**
   * Flow to the right
   **/
  function flowRight() {

    // check if has items 
    // on the right side
    if (_index) {
      _index--;
      render();
    }

  };

  /**
   * Flow to the left
   **/
  function flowLeft() {

    // check if has items 
    // on the left side
    if (coverflow.data.dataLength > (_index + 1)) {
      _index++;
      render();
    }

  };

  function flowToTarget(e) {
    for (var i = 0; i < coverflow.data.dataLength; i++) {
      if (_items[i] == e.target.parentNode || _titles[i] == e.target) {
        _index = i;
        render();
        i = coverflow.data.dataLength;
      }
    }
  };

  /**
   * Enable left & right keyboard events
   **/
  function keyDown(event) {

    switch (event.keyCode) {
      case 37:
        flowRight();
        break; // left
      case 39:
        flowLeft();
        break; // right
    }

  };

  function wheel(event) {
    _index += event.wheelDelta / 120;
    render();
  };

  var drag = {
    down: 0,
    mouseStart: 0,
    StartDrag: function (event) {
      drag.mouseStart = event.clientX;
      drag.down = true;
    },
    Drag: function (event) {
      if (!drag.down) return;
      var mouseX = event.clientX;
      if (mouseX - drag.mouseStart > 100) {
        _index--;
        render();
        //console.log("MouseX " + mouseX);
        //console.log("drag.mouseStart " + drag.mouseStart);
        drag.mouseStart = mouseX;
      };
      if (mouseX - drag.mouseStart < -100) {
        _index++;
        render();
        drag.mouseStart = mouseX;
      };
    },
    EndDrag: function () {
      drag.down = false;

    }
  };

  /*
    Titles
    */


  /**
   * Register all events 
   **/
  function registerEvents() {
    //_prevLink.addEventListener('click', flowRight, false);
    //_nextLink.addEventListener('click', flowLeft, false);
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('mousewheel', wheel, false);
    document.addEventListener('click', flowToTarget, false);
    document.addEventListener('mousedown', drag.StartDrag, false);
    document.addEventListener('mousemove', drag.Drag, false);
    document.addEventListener('mouseup', drag.EndDrag, false);
    document.addEventListener('MSPointerDown', drag.StartDrag, false);
    document.addEventListener('MSPointerMove', drag.Drag, false);
    document.addEventListener('MSPointerUp', drag.EndDrag, false);
  };

  var sampleData = {
    "items": [
      { "title": "This is an extra long title", "image": "/assets/images/album1.jpg", "description": "This is a brand new album from Fun." },
      { "title": "Adele", "image": "/assets/images/album2.jpg", "description": "Adele doesn't care if you think she's fat." },
      { "title": "MX", "image": "/assets/images/album3.jpg", "description": "I don't know anything about MX." },
      { "title": "Pink Floyd", "image": "/assets/images/album4.jpg", "description": "LSD creates some interesting things." },
      { "title": "Beyonce", "image": "/assets/images/album5.jpg", "description": "Beyonce dances sometimes." },
      { "title": "Rio Soundtrack", "image": "/assets/images/album6.jpg", "description": "That movie you meant to see with your kid." },
      { "title": "Calvin Harris", "image": "/assets/images/album7.jpg", "description": "Calvin knows that feel, bro." },
      { "title": "Fun.", "image": "/assets/images/album1.jpg", "description": "This is a brand new album from Fun." },
      { "title": "Adele", "image": "/assets/images/album2.jpg", "description": "Adele doesn't care if you think she's fat." },
      { "title": "MX", "image": "/assets/images/album3.jpg", "description": "I don't know anything about MX." },
      { "title": "Pink Floyd", "image": "/assets/images/album4.jpg", "description": "LSD creates some interesting things." },
      { "title": "Beyonce", "image": "/assets/images/album5.jpg", "description": "Beyonce dances sometimes." },
      { "title": "Rio Soundtrack", "image": "/assets/images/album6.jpg", "description": "That movie you meant to see with your kid." },
      { "title": "Calvin Harris", "image": "/assets/images/album7.jpg", "description": "Calvin knows that feel, bro." }
    ]
  };

  coverflow.data = {};

  coverflow.data.source = sampleData;
  coverflow.data.dataLength = coverflow.data.source.items.length;
  //coverflow.data.toArray = function (itemProperty) {
  //  var theArray = [];
  //  for (var i = 0; i < coverflow.data.dataLength; i++) {
  //    theArray.push(coverflow.data.source.items[i][itemProperty]);
  //  }
  //  return theArray;
  //};
  coverflow.data.carouselBuilder = function() {
    var carouselContent = "";
    for (var i = 0; i < coverflow.data.dataLength; i++) {
      carouselContent += "<section class='item'><section class='item-image' style=\"background: url('"+coverflow.data.source.items[i].image+"')\"></section></section>";
    };
    return carouselContent;
  };
  coverflow.data.descriptionBuilder = function () {
    var descriptionContent = "";
    for (var i = 0; i < coverflow.data.dataLength; i++) {
      descriptionContent += "<aside><title>" + coverflow.data.source.items[i].title + "</title><caption>" + coverflow.data.source.items[i].description + "</caption></aside>";
    }
    return descriptionContent;
  }
  coverflow.data.titleBuilder = function() {
    var titleBarContent = "";
    for (var i = 0; i < coverflow.data.dataLength; i++) {
      titleBarContent += "<title>" + coverflow.data.source.items[i].title + "</title>";
    }
    return titleBarContent;
  }


  /**
   * Initalize
   **/
  function init() {
    
    // get dom stuff
    //_coverflow = get('#coverflow');
    _prevLink = get('#prev');
    _nextLink = get('#next');
    _titleBar = get('#title-bar');
    _carousel = get('#carousel');
    _descriptionBlock = get('#description-block');


    //_titles = coverflow.data.toArray("title");
    //_itemImages = coverflow.data.toArray("image");
    //_descriptions = coverflow.data.toArray("description");

    // gather items from JSON and render
    _carousel.innerHTML = coverflow.data.carouselBuilder();
    _titleBar.innerHTML = coverflow.data.titleBuilder();
    _descriptionBlock.innerHTML = coverflow.data.descriptionBuilder();

    // get items & set index on the item in the middle
    _items = Array.prototype.slice.call(document.querySelectorAll('.nim-carousel .item'));
    _itemImages = Array.prototype.slice.call(document.querySelectorAll('.nim-carousel .item-image'));
    _titles = Array.prototype.slice.call(document.querySelectorAll('.nim-carousel #title-bar > title'));
    _descriptions = Array.prototype.slice.call(document.querySelectorAll('.nim-carousel #description-block aside'));

    OFFSET = _items[0].offsetWidth;
    _itemHeight = _items[0].offsetHeight;

    _index = Math.floor(coverflow.data.dataLength / 2);

    // do important stuff
    registerEvents();
    render();
  };

  // go!
  init();

};