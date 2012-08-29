WinJS.Namespace.define("Ratio", {
    AlphabeticalHeader: WinJS.Class.define(//constructor, instanceMembers, staticMembers
    // constructor
    function (element, options) {

        this.onClick = new Ratio.Signal();

        this._initialize(element);
        this._element.addEventListener("click", Ratio.Delegate(this, function (e) {
            this.onClick.dispatch(e, this._letter);
        }));

        if (options) // passing an object will cause an update
            this.letter = options;
    },
    // instance members (in an object)
    {
        letter: {
            get: function () {
                return this._letter;
            },
            set: function (value) {
                this._letter = value;
                this._update();
            }
        },

        addEventListener: function (type, handler, useCapture) {
            this._element.addEventListener(type, handler, useCapture);
        },

        _update: function () {
            this._title.innerHTML = this.letter;
        },

        _initialize: function (element) {
            // reference or create default host div
            this._element = element || document.createElement("div");
            this._element.className = "alphabeticalHeader";
            this._element.winControl = this;

            // header title
            this._title = document.createElement("h2");
            this._title.className = "header-title win-title";

            this._element.appendChild(this._title);
        }
    }
)
});