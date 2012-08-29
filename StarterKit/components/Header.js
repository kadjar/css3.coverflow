WinJS.Namespace.define("Ratio", {
    Header: WinJS.Class.define(//constructor, instanceMembers, staticMembers
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

            this._title.innerText = this._data.title;
            this._itemCount.innerText = this._data.itemCount || "0 items";
        },

        _initialize: function (element) {
            // reference or create default host div
            this._element = element || document.createElement("div");
            this._element.className = "header";
            this._element.winControl = this;

            // header title
            this._title = document.createElement("h2");
            this._title.className = "header-title win-title";

            // header item count
            this._itemCount = document.createElement("p");
            this._itemCount.className = "header-item-count";

            this._element.appendChild(this._title);
            this._element.appendChild(this._itemCount);
        }
    }
)
});