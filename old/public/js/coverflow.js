/**
* 
*  CoverFlow using CSS3
* 
*  @author: Hjörtur Elvar Hilmarsson
*  
**/
(function() {

    // Local variables
    var _index = 0,
    _coverflow = null,
    _prevLink = null,
    _nextLink = null,
    _albums = [],
    _transformName = Modernizr.prefixed('transform'),

    // Constants
    OFFSET = 70; // pixels
    ROTATION = 45; // degrees
    BASE_ZINDEX = 10; // 
    MAX_ZINDEX = 42; // 

    _albums = Array.prototype.slice.call( document.querySelectorAll( 'section' ));
    var albumsLength = _albums.length;
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
                    _albums[i].style[_transformName] = "translateX( -"+ ( OFFSET * ( _index - i  ) ) +"% ) rotateY( "+ ROTATION +"deg )";
                    _albums[i].style.zIndex = BASE_ZINDEX + i;  
                } 

                // current
                 if( i === _index ) {
                    _albums[i].style[_transformName] = "rotateY( 0deg ) translateZ( 140px )";
                    _albums[i].style.zIndex = MAX_ZINDEX;  
                } 

                 // after
                if( i > _index ) {
                    _albums[i].style[_transformName] = "translateX( "+ ( OFFSET * ( i - _index  ) ) +"% ) rotateY( -"+ ROTATION +"deg )";
                    _albums[i].style.zIndex = BASE_ZINDEX + ( _albums.length - i  ); 
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
       if( _albums.length > ( _index + 1)  ) {
            _index++;
            render();
       }
      
    };

    function flowToTarget(e) {
       for (var i=0; i<albumsLength;i++) {
        if (_albums[i] == e.target) {
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
      down: false,
      mouseStart: 0,

      StartDrag: function (event) {
        this.mouseStart = event.clientX;
        this.down = true;
      },
      Drag: function (event) {
        if (!this.down) return;
        var mouseX = event.clientX;
        console.log(mouseX);
        console.log("diff = "+(mouseX - this.mouseStart));
        if (mouseX - this.mouseStart > 50 ) {

          _index++;
          render();
          this.mouseStart = mouseX;
        };
        if (mouseX - this.mouseStart < -50 ) {

          _index--;
          render();
          this.mouseStart = mouseX;
        };
      },
      EndDrag: function() {
        this.down = false;
      }
    };
    /**
     * Register all events 
     **/
    function registerEvents() {
        _prevLink.addEventListener('click', flowRight, false);
        _nextLink.addEventListener('click', flowLeft, false);
        document.addEventListener('keydown', keyDown, false);
        _coverflow.addEventListener('mousewheel', wheel, false);
        _coverflow.addEventListener('click', flowToTarget, false);
        _coverflow.addEventListener('mousedown', drag.StartDrag, false);
        _coverflow.addEventListener('mousemove', drag.Drag, false);
        _coverflow.addEventListener('mouseup', drag.EndDrag, false);
        // _coverflow.addEventListener('MSPointerDown', drag.StartDrag, false);
        // _coverflow.addEventListener('MSPointerMove', drag.Drag, false);
        // _coverflow.addEventListener('MSPointerUp', drag.EndDrag, false);
    };

    /**
     * Initalize
     **/
    function init() {

        // get albums & set index on the album in the middle
        _albums = Array.prototype.slice.call( document.querySelectorAll( 'section' ));
        _index = Math.floor( _albums.length / 2 );

        // get dom stuff
        _coverflow = get('#coverflow');
        _prevLink = get('#prev');
        _nextLink = get('#next');

        // display covers
        for( var i = 0; i < _albums.length; i++ ) {
            var url = _albums[i].getAttribute("data-cover");
            _albums[i].style.backgroundImage = "url("+ url  +")";
        }

        // do important stuff
        registerEvents();
        render();

   };

    // go!
    init();

}());


