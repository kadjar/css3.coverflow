/**
* 
*  CoverFlow using CSS3
* 
*  @author: Hjörtur Elvar Hilmarsson
*  
**/
var coverflow = {};

coverflow.init = function() {

    // Local variables
    var _index = 0,
    _coverflow = null,
    _prevLink = null,
    _nextLink = null,
    _items = [],
    _titles = [],
    _transformName = 'transform',
    

    // Constants
    OFFSET = 50; // pixels
    ROTATION = 45; // degrees
    BASE_ZINDEX = 10; // 
    MAX_ZINDEX = 42; // 

    _items = Array.prototype.slice.call(document.querySelectorAll('.item'));
    _titles = Array.prototype.slice.call(document.querySelectorAll('.item > title'));
    var _itemWidth = _items[0].offsetWidth;
    var _itemHeight = _items[0].offsetHeight;
    var itemsLength = _items.length - 1;
    /**
     * Get selector from the dom
     **/
    function get( selector ) {
        return document.querySelector( selector );
    };

    /**
     * Renders the CoverFlow based on the current _index
     **/
    function render() {
        if (_index < 0 || _index >= itemsLength) {
            return;
        } else {
            for( var i = 0; i < itemsLength; i++ ) {
 
                // before 
                if( i < _index ) {
                    _items[i].style[_transformName] = "translateX( -" + (OFFSET * (_index - i)) + "% )";
                    _items[i].style.zIndex = BASE_ZINDEX + i;
                    _itemImages[i].style[_transformName] = "rotateY( " + ROTATION + "deg )"/* + " scaleX( .8 )"*/;

                    _titles[i].style[_transformName] = "translateX( -" + (200 * (_index - i)) + "px )";
                    _titles[i].setAttribute("class", "");
                    _items[i].setAttribute("class", "");
                }

                // current
                 if( i === _index ) {
                    _items[i].style[_transformName] = "scale(1.2)";
                    _items[i].style.zIndex = MAX_ZINDEX;
                    _itemImages[i].style[_transformName] = "rotateY( 0deg )";

                    _titles[i].style[_transformName] = "translateX(0px)";
                    _titles[i].setAttribute("class", "title-active");
                    _items[i].setAttribute("class", "item-active");
                } 

                 // after
                if( i > _index ) {
                    _items[i].style[_transformName] = "translateX( " + (OFFSET * (i - _index)) + "% )";
                    _items[i].style.zIndex = BASE_ZINDEX + (itemsLength - i);
                    _itemImages[i].style[_transformName] = "rotateY( -" + ROTATION + "deg )"/* + " scaleX( .8 )"*/;
                    _items[i].setAttribute("class", "");

                    _titles[i].style[_transformName] = "translateX( " + (200 * (i - _index)) + "px )";
                    _titles[i].setAttribute("class", "");
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
       if( _index ) {
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
       if( itemsLength > ( _index + 1)  ) {
            _index++;
            render();
       }
      
    };

    function flowToTarget(e) {
       for (var i=0; i<itemsLength;i++) {
        if (_items[i] == e.target.parentNode || _titles[i] == e.target) {
            _index = i;
            render();
            i = itemsLength;
        }
      }
    };

    /**
     * Enable left & right keyboard events
     **/
    function keyDown( event ) {

        switch( event.keyCode ) {
            case 37: flowRight(); break; // left
            case 39: flowLeft(); break; // right
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
            if (mouseX - drag.mouseStart > 100 ) {
                _index--;
                render();
                drag.mouseStart = mouseX;
            };
            if (mouseX - drag.mouseStart < -100 ) {
                _index++;
                render();
                drag.mouseStart = mouseX;
            };
        },
      EndDrag: function() {
        drag.down = false;
      }
    };

    /*
    Titles
    */
    function renderTitles() {
      for (var i = 0; i < itemsLength; i++) {
        _titleBar.innerHTML += "<title>"+_titles[i].innerHTML+"</title>";
      }
      _titles = Array.prototype.slice.call(document.querySelectorAll('#title-bar > title'));
    }

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

    /**
     * Initalize
     **/
    function init() {

        // get items & set index on the item in the middle
        _items = Array.prototype.slice.call(document.querySelectorAll('.item'));
        _itemImages = Array.prototype.slice.call(document.querySelectorAll('.item-image'));
        _index = Math.floor( itemsLength / 2 );

        // get dom stuff
        _coverflow = get('#coverflow');
        _prevLink = get('#prev');
        _nextLink = get('#next');
        _titleBar = get('#title-bar');

        // display covers
        for( var i = 0; i < itemsLength; i++ ) {
            var url = _itemImages[i].getAttribute("data-image");
            _itemImages[i].style.backgroundImage = "url("+ url  +")";
        }


        // do important stuff
        registerEvents();
        renderTitles();
        render();
   };

    // go!
    init();

};


