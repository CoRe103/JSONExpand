function jsonExpand(json) {
    if (typeof json === "string") {
        json = JSON.parse(json)
    }
    function expandDOM(object) {
        var result;
        var ul = document.createElement("ul");
        if (Array.isArray(object)) {
            result = document.createElement("span");
            result.setAttribute("class", "a");
            object.forEach(function (value, index) { //引数が配列のとき
                var li = document.createElement("li");
                var wrap = document.createElement("span");
                var a = document.createElement("span");
                wrap.setAttribute("class", "w");
                a.setAttribute("class", "i");
                wrap.appendChild(expandDOM(value));
                a.appendChild(document.createTextNode(index));
                li.appendChild(a);
                li.appendChild(document.createTextNode(":"));
                li.appendChild(wrap);
                ul.appendChild(li);
            });
            result.appendChild(ul);
        } else if (object instanceof Object) { //引数が配列ではないがオブジェクトのとき
            result = document.createElement("span");
            result.setAttribute("class", "o");
            Object.keys(object).forEach(function (key) {
                var li = document.createElement("li");
                var wrap = document.createElement("span");
                var a = document.createElement("span");
                wrap.setAttribute("class", "w");
                a.setAttribute("class", "k");
                wrap.appendChild(expandDOM(object[key]));
                a.appendChild(document.createTextNode(key));
                li.appendChild(a);
                li.appendChild(document.createTextNode(":"));
                li.appendChild(wrap);
                ul.appendChild(li);
            });
            result.appendChild(ul);
        } else {
            result = document.createTextNode(object);
        }
        return result;
    }
    return expandDOM(json); //DOM element を返す
}
