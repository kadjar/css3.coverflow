WinJS.Namespace.define("Ratio", {
    Tile: WinJS.Class.define(//constructor, instanceMembers, staticMembers
    // constructor
    function (element, options) {

        this.onClick = new Ratio.Signal();

        this._initialize(element);
        this._element.addEventListener("click", Ratio.Delegate(this, function (e) {
            this.onClick.dispatch(e, this._data);
        }));

        if (options) // passing an object will cause an update
            this.data = options;
    },
    // instance members (in an object)
    {
        data: {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this._update();
            }
        },

        addEventListener: function (type, handler, useCapture) {
            this._element.addEventListener(type, handler, useCapture);
        },

        _update: function () {
            if (this._data.image)
                this._img.src = this._data.image;
            else
                this._img.src = 'http://placekitten.com/g/310/150';
            
            this._title.innerText = this._data.title;

            if(this._data.isHero)
                WinJS.Utilities.addClass(this._element, "tile-hero");
            else
                WinJS.Utilities.removeClass(this._element, "tile-hero");
        },

        _initialize: function (element) {
            this._element = element || document.createElement("div");
            this._element.className = "tileDiv";

            this._element.winControl = this;

            this._img = document.createElement('img');
            this._img.setAttribute('height', '150px');
            this._img.setAttribute('width', '310px');

            this._title = document.createElement("h3");
            this._title.className = "tileTitle win-type-ellipsis";

            this._element.appendChild(this._img);
            this._element.appendChild(this._title);
        }
    }
)
});
