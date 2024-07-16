//#region - PARAMETER -
var cookieKey = "UserData";
var dayToLive = 3;
var parameterKey = ["collection", "prize"];
var dataKeyArray = [["a", "b", "c","d"], ["prize"]];
//#endregion

//#region - USER STATUS -
var UserStatus = {
    FirstVisit: 0,
    Collect: 1,
    Exchange: 2,
}
//#endregion

//#region - LANGUAGE -
var Language = {
    Chinese: 0,
    English: 1,
}
//#endregion

//#region - DATA -
var Data = {
    status: UserStatus.FirstVisit,
    collections: new Array(dataKeyArray[0].length).fill(false),
    newCollectedIndex: -1,
    prize: false,
    newExchangedPrize: false,
    language: Language.Chinese
}
//#endregion

//#region - WEBSITE URL -
var WebsiteURL = "https://dream-smart-stamp-collection.tw/";
//#endregion

// get data
var data = GetCookie(cookieKey);

// update collection data
var collectionParameter = GetURLParameter(parameterKey[0]);
for (var i = 0; i < dataKeyArray[0].length; i++) {
    if (collectionParameter == dataKeyArray[0][i]) {
        if (!data.collections[i]) {
            data.newCollectedIndex = i;
            data.collections[i] = true;
        }
        break;
    }
}

// update prize data
if (data.status == UserStatus.Exchange) {
    var prizeParameter = GetURLParameter(parameterKey[1]);
    for (var i = 0; i < dataKeyArray[1].length; i++) {
        if (prizeParameter == dataKeyArray[1][i]) {
            data.prize = true;
            data.newExchangedPrize = true;
            break;
        }
    }
}
// save data
var dataString = JSON.stringify(data);
console.log("updated cookie => " + dataString);
SetCookie(cookieKey, dataString);

// load website
EntryTargetWebsite(WebsiteURL);

function GetCookie(key) {
    var data = Data;
    var decodedCookie = decodeURIComponent(document.cookie);

    console.log("Cookie => " + decodedCookie);

    var cookies = decodedCookie.split('; ');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split("=");
        // cookie[0] = cookieKey, cookie[1] = cookieValue
        if (cookie[0] = key && cookie[1] != null) {
            var cookieData = JSON.parse(cookie[1]);

            data.status = cookieData.status;
            data.language = cookieData.language;

            for (var i = 0; i < data.collections.length; i++){
                data.collections[i] = cookieData.collections[i];
            }
            
            data.prize = cookieData.prize;
        }
    }
    return data;
}

function GetURLParameter(key) {
    var url = document.URL;
    var index = url.indexOf("?");
    if (index != -1) {
        var decodedParameter = url.split("?")[1];
        var parameters = decodedParameter.split("&");
        for (var i = 0; i < parameters.length; i++) {
            var parameter = parameters[i].split("=");
            if (parameter[0] = key) {
                return parameter[1];
            }
        }
    }
    return "Null";
}

function SetCookie(key, value) {
    var cookie = key + "=" + value;
    var date = new Date();
    date.setTime(date.getTime() + (dayToLive * 24 * 60 * 60 * 1000));
    var expires = "expires=" + date.toUTCString();
    document.cookie = cookie + "; " + expires + "; path=/";
}

function EntryTargetWebsite(url) {
    if (url != "")
        window.location.replace(url);
}