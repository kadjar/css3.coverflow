var Ratio = Ratio || {};

Ratio.LiveTile = function () {
    "use strict";

    var Notifications = Windows.UI.Notifications;

    // === constructor and instance members ===
    var LiveTile = function () {
        
    }

    LiveTile.prototype.updateLiveTiles = function () {
        LiveTile.appendLiveTile(
            "Autumn Beef and Cider Stew",
            "LT_80081_310px.png",
            "LT_80081_150px.png"
        );
        LiveTile.appendLiveTile(
            "Herbed Fall Vegetables",
            "LT_26235_310px.png",
            "LT_26235_150px.png"
        );
        LiveTile.appendLiveTile(
            "Autumn Apple and Squash Soup",
            "LT_29710_310px.png",
            "LT_29710_150px.png"
        );
        LiveTile.appendLiveTile(
            "Apple-Pomegranate Crisp",
            "LT_28203_310px.png",
            "LT_28203_150px.png"
        );
        LiveTile.appendLiveTile(
            "Old-Fashioned Turkey Pot Pie",
            "LT_22020_310px.png",
            "LT_22020_150px.png"
        );
    }

    // === prototype members ===
    // this is where we should put queries through NetIO to get new live tile content

    // === static members ===
    LiveTile.initialize = function () {
        Notifications.TileUpdateManager.createTileUpdaterForApplication().enableNotificationQueue(true);
    };

    LiveTile.clear = function () {
        Notifications.TileUpdateManager.createTileUpdaterForApplication().clear();
    }

    LiveTile.appendLiveTile = function (text, wideImageSrc, squareImageSrc) {
        // get a XML DOM version of a specific template by using getTemplateContent
        var tileXml = Notifications.TileUpdateManager.getTemplateContent(Notifications.TileTemplateType.tileWideImageAndText01);

        // get the text attributes for this template and fill them in
        var tileTextAttributes = tileXml.getElementsByTagName("text");
        tileTextAttributes[0].appendChild(tileXml.createTextNode(text));

        // get the image attributes for this template and fill them in
        var tileImageAttributes = tileXml.getElementsByTagName("image");
        tileImageAttributes[0].setAttribute("src", "ms-appx:///assets/livetiles/" + wideImageSrc);

        // fill in a version of the square template returned by GetTemplateContent
        var squareTileXml = Notifications.TileUpdateManager.getTemplateContent(Notifications.TileTemplateType.tileSquareImage);
        var squareTileImageAttributes = squareTileXml.getElementsByTagName("image");
        squareTileImageAttributes[0].setAttribute("src", "ms-appx:///assets/livetiles/" + squareImageSrc);

        // include the square template into the notification
        var node = tileXml.importNode(squareTileXml.getElementsByTagName("binding").item(0), true);
        tileXml.getElementsByTagName("visual").item(0).appendChild(node);

        // create the notification from the XML
        var tileNotification = new Notifications.TileNotification(tileXml);

        // send the notification to the app's application tile
        Notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
    };

    return LiveTile;
}();