function jsonExpand(json) {
    function expandDOM(object) {
        let result;
        let ul = document.createElement("ul");
        if (Array.isArray(object)) {
            result = document.createElement("span");
            result.setAttribute("class", "a");
            object.forEach((value, index) => { //引数が配列のとき
                let li = document.createElement("li");
                let wrap = document.createElement("span");
                let a = document.createElement("span");
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
            Object.keys(object).forEach(key => {
                let li = document.createElement("li");
                let wrap = document.createElement("span");
                let a = document.createElement("span");
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
    let span = document.createElement("span");
    span.setAttribute("class", "json-expand");
    let content = expandDOM(json); //DOM element を返す
    span.appendChild(content);
    return span;
}

function jsonExpandShrink(json, elt_id) {
    $(elt_id).empty();
    let _elt = d3.select(elt_id)
        .append("span")
        .attr("class", "json-expand");
    const dots_text = "（開）";
    const contents_display = "none";

    function toggle() {
        let flag = true;
        return (function () {
            const elt = $(this.parentNode);
            if (flag) {
                elt.children(".d").html("（閉）");
                elt.children(".c").css("display", "block");
                flag = false;
            } else {
                elt.children(".d").html("（開）");
                elt.children(".c").css("display", "none");
                flag = true;
            }
            d3.event.stopPropagation();
        });
    }

    function expandDOM(object, elt) {
        let result;
        let ul;
        const f = toggle();
        if (Array.isArray(object)) { //引数が配列のとき
            result = elt.append("span").attr("class", "a");
            result.append("a")
                .attr("class", "d")
                .on("click", f)
                .text(dots_text);
            ul = result.append("ul")
                .attr("class", "c")
                .style("display", contents_display);
            object.forEach((value, index) => {
                let wraper;
                let li = ul.append("li");
                li.append("span")
                    .attr("class", "i")
                    .text(index);
                li.append("span").text(":");
                wraper = li.append("span").attr("class", "w");
                expandDOM(value, wraper);
            });
        } else if (isObjectObject(object)) {
            result = elt.append("span").attr("class", "o");
            result.append("a")
                .attr("class", "d")
                .on("click", f)
                .text(dots_text);
            ul = result.append("ul")
                .attr("class", "c")
                .style("display", contents_display);
            Object.keys(object).forEach(key => {
                const value = object[key];
                let wraper;
                let li = ul.append("li");
                li.append("span")
                    .attr("class", "k")
                    .text(key);
                li.append("span").text(":");
                wraper = li.append("span").attr("class", "w");
                expandDOM(value, wraper);
            });
        } else {
            elt.text(object);
        }
    };
    expandDOM(json, _elt); //DOM element を返す
}
