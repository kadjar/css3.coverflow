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
    _albums = [],
    _titles = [],
    _transformName = 'transform',
    

    // Constants
    OFFSET = 50; // pixels
    ROTATION = 45; // degrees
    BASE_ZINDEX = 10; // 
    MAX_ZINDEX = 42; // 

    _albums = Array.prototype.slice.call(document.querySelectorAll('section'));
    _titles = Array.prototype.slice.call(document.querySelectorAll('section > title'));
    var _albumWidth = _albums[0].offsetWidth;
    var _albumHeight = _albums[0].offsetHeight;
    var albumsLength = _albums.length - 1;
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
        if (_index < 0 || _index >= albumsLength) {
            return;
        } else {
            for( var i = 0; i < albumsLength; i++ ) {
 
                // before 
                if( i < _index ) {
                    _albums[i].style[_transformName] = "translateX( -" + (OFFSET * (_index - i)) + "% )";
                    _albums[i].style.zIndex = BASE_ZINDEX + i;
                    _itemImages[i].style[_transformName] = "rotateY( " + ROTATION + "deg )"/* + " scaleX( .8 )"*/;
                }

                // current
                 if( i === _index ) {
                    _albums[i].style[_transformName] = "scale(1.2)";
                    _albums[i].style.zIndex = MAX_ZINDEX;
                    _itemImages[i].style[_transformName] = "rotateY( 0deg )";
                } 

                 // after
                if( i > _index ) {
                    _albums[i].style[_transformName] = "translateX( " + (OFFSET * (i - _index)) + "% )";
                    _albums[i].style.zIndex = BASE_ZINDEX + (albumsLength - i);
                    _itemImages[i].style[_transformName] = "rotateY( -" + ROTATION + "deg )"/* + " scaleX( .8 )"*/;
                }         
        
            }
        }
        // loop through albums & transform positions


    };

    /**
     * Flow to the right
     **/
    function flowRight() {

       // check if has albums 
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

        // check if has albums 
       // on the left side
       if( albumsLength > ( _index + 1)  ) {
            _index++;
            render();
       }
      
    };

    function flowToTarget(e) {
       for (var i=0; i<albumsLength;i++) {
        if (_albums[i] == e.target.parentNode) {
            _index = i;
            render();
            i = albumsLength;
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
        console.log(event.wheelDelta);
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
            console.log(mouseX);
            console.log("diff = "+(mouseX - drag.mouseStart));
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

        // get albums & set index on the album in the middle
        _albums = Array.prototype.slice.call(document.querySelectorAll('section'));
        _itemImages = Array.prototype.slice.call(document.querySelectorAll('.item-image'))
        _index = Math.floor( albumsLength / 2 );

        // get dom stuff
        _coverflow = get('#coverflow');
        _prevLink = get('#prev');
        _nextLink = get('#next');

        // display covers
        for( var i = 0; i < albumsLength; i++ ) {
            var url = _itemImages[i].getAttribute("data-image");
            _itemImages[i].style.backgroundImage = "url("+ url  +")";
        }

        // do important stuff
        registerEvents();
        render();

   };

    // go!
    init();

};


