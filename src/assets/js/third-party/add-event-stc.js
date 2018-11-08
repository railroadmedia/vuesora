function $d(t) {
    return document.getElementById(t)
}

window.addeventstc = function () {
    var p, u, s, e, t = !1, l = 1, r = !1, m = !0, g = !1, v = !1, f = !1, T = 1, h = "", w = !0, x = !0, b = !0,
        k = !0, y = !0, _ = "Apple", N = "Google <em>(online)</em>", E = "Outlook", z = "Outlook.com <em>(online)</em>",
        $ = "Yahoo <em>(online)</em>", A = null, S = null, o = null, C = null, I = null, d = null, B = !1;
    return {
        initialize: function () {
            if (!t) {
                t = !0;
                try {
                    addeventasync()
                } catch (t) {
                }
                "https:", base_path = "https://www.addevent.com", "/gfx/icon-calendar-t1.svg", addeventstc.trycss(), addeventstc.generate()
            }
        }, generate: function () {
            for (var t = document.getElementsByTagName("*"), e = 0; e < t.length; e += 1) if (addeventstc.hasclass(t[e], "addeventstc")) {
                var o = "addeventstc" + l;
                t[e].id = o, t[e].title = "", t[e].style.visibility = "visible", t[e].setAttribute("aria-haspopup", "true"), t[e].setAttribute("aria-expanded", "false"), t[e].setAttribute("tabindex", "0"), r ? (t[e].onclick = function () {
                    return !1
                }, t[e].onmouseover = function () {
                    clearTimeout(s), addeventstc.toogle(this, {type: "mouseover", id: o})
                }, t[e].onmouseout = function () {
                    s = setTimeout(function () {
                        addeventstc.mouseout(this, {type: "mouseout", id: o})
                    }, 100)
                }) : (t[e].onclick = function () {
                    return addeventstc.toogle(this, {type: "click", id: o}), !1
                }, t[e].onmouseover = function () {
                }, t[e].onmouseout = function () {
                }), t[e].onkeydown = function (t) {
                    var e = t.which || t.keyCode;
                    "13" != e && "32" != e && "27" != e && "38" != e && "40" != e || t.preventDefault(), "13" != e && "32" != e || (addeventstc.keyboardclick(this, {
                        type: "click",
                        id: o
                    }), addeventstc.toogle(this, {
                        type: "click",
                        id: o,
                        keynav: !0
                    })), "27" == e && addeventstc.hideandreset(), "38" == e && addeventstc.keyboard(this, {
                        type: "keyboard",
                        id: o,
                        key: "up"
                    }), "40" == e && addeventstc.keyboard(this, {type: "keyboard", id: o, key: "down"}), B = !0
                }, t[e].onblur = function () {
                    B && setTimeout(function () {
                        addeventstc.hideandreset()
                    }, 300)
                };
                var n = t[e];
                if ("none" != t[e].getAttribute("data-styling") && "inline-buttons" != t[e].getAttribute("data-render") || (m = !1), m) {
                    var a = document.createElement("span");
                    a.className = "addeventstc_icon", n.appendChild(a)
                }
                l++, g = !0;
                for (var d = t[e].getElementsByTagName("*"), c = 0; c < d.length; c += 1) addeventstc.hasclass(d[c], "stc_node") || ("" != d[c].className ? d[c].className += " stc_node" : d[c].className += "stc_node");
                if ("inline-buttons" == t[e].getAttribute("data-render")) {
                    t[e].onclick = function () {
                    }, addeventstc.toogle(t[e], {
                        type: "render",
                        id: o
                    }), t[e].setAttribute("aria-expanded", "true"), t[e].removeAttribute("tabindex"), t[e].onkeydown = function () {
                    }, t[e].blur = function () {
                    };
                    var i = document.getElementById(o + "-drop");
                    if (i) {
                        i.setAttribute("aria-hidden", "false");
                        for (d = i.getElementsByTagName("SPAN"), c = 0; c < d.length; c += 1) {
                            d[c];
                            d[c].tabIndex = "0", d[c].onkeydown = function (t) {
                                var e = t.which || t.keyCode;
                                "13" != e && "32" != e || t.target.click()
                            }
                        }
                    }
                }
            }
            m ? addeventstc.applycss() : (addeventstc.removeelement($d("stc_css")), addeventstc.removeelement($d("stc_tmp_css")), addeventstc.helpercss()), g && !v && (v = !0, addeventstc.track({
                typ: "exposure",
                cal: ""
            }))
        }, toogle: function (t, e) {
            var o, n, a, d = "";
            if (n = $d(o = t.id)) {
                a = n.getAttribute("data-direct");
                var c = n.getAttribute("data-intel"), i = n.getAttribute("data-intel-apple");
                if ("ios" == addeventstc.agent() && "click" == e.type && "true" !== i && "false" !== c && (a = "appleical", n.setAttribute("data-intel-apple", "true")), "outlook" == a || "google" == a || "yahoo" == a || "hotmail" == a || "outlookcom" == a || "appleical" == a || "apple" == a) "click" == e.type && (addeventstc.click({
                    button: o,
                    service: a,
                    id: e.id
                }), null != A && addeventstc.trigger("button_click", {id: o})); else if ("mouseover" == e.type && u != n && (f = !1), "click" == e.type || "render" == e.type || "mouseover" == e.type && !f) {
                    "mouseover" == e.type && (f = !0, null != S && addeventstc.trigger("button_mouseover", {id: o})), "" == h && (h = "appleical,google,outlook,outlookcom,yahoo");
                    for (var s = (h = (h += ",").replace(/ /gi, "")).split(","), l = 0; l < s.length; l += 1) (w && "ical" == s[l] || w && "appleical" == s[l]) && (d += '<span class="ateappleical" id="' + o + '-appleical" role="menuitem">' + _ + "</span>"), x && "google" == s[l] && (d += '<span class="ategoogle" id="' + o + '-google" role="menuitem">' + N + "</span>"), b && "outlook" == s[l] && (d += '<span class="ateoutlook" id="' + o + '-outlook" role="menuitem">' + E + "</span>"), (k && "hotmail" == s[l] || k && "outlookcom" == s[l]) && (d += '<span class="ateoutlookcom" id="' + o + '-outlookcom" role="menuitem">' + z + "</span>"), y && "yahoo" == s[l] && (d += '<span class="ateyahoo" id="' + o + '-yahoo" role="menuitem">' + $ + "</span>");
                    if (addeventstc.getlicense(p) || (d += '<em class="copyx"><em class="brx"></em><em class="frs"><a href="https://addevent.com" title="" tabindex="-1" id="' + o + '-home">AddEvent.com</a></em></em>'), !$d(o + "-drop")) {
                        var r = document.createElement("span");
                        r.id = o + "-drop", r.className = "addeventstc_dropdown", r.setAttribute("aria-hidden", "true"), r.setAttribute("aria-labelledby", o), r.innerHTML = d, n.appendChild(r)
                    }
                    $d(o + "-appleical") && ($d(o + "-appleical").onclick = function () {
                        addeventstc.click({button: o, service: "appleical", id: e.id})
                    }), $d(o + "-google") && ($d(o + "-google").onclick = function () {
                        addeventstc.click({button: o, service: "google", id: e.id})
                    }), $d(o + "-outlook") && ($d(o + "-outlook").onclick = function () {
                        addeventstc.click({button: o, service: "outlook", id: e.id})
                    }), $d(o + "-outlookcom") && ($d(o + "-outlookcom").onclick = function () {
                        addeventstc.click({button: o, service: "outlookcom", id: e.id})
                    }), $d(o + "-yahoo") && ($d(o + "-yahoo").onclick = function () {
                        addeventstc.click({button: o, service: "yahoo", id: e.id})
                    }), $d(o + "-home") && ($d(o + "-home").onclick = function () {
                        addeventstc.click({button: o, service: "home", id: e.id})
                    }), addeventstc.show(o, e)
                }
                return u = n, !1
            }
        }, click: function (t) {
            var e, o;
            location.origin;
            if (void 0 === location.origin && location.protocol + "//" + location.host, $d(t.button)) {
                if ("home" == t.service ? o = base_path : (e = addeventstc.getburl({id: t.button}), o = base_path + "/subscribe/" + e + "+" + t.service), !$d("atecllink")) {
                    var n = document.createElement("a");
                    n.id = "atecllink", n.rel = "external", n.setAttribute("data-role", "none"), n.innerHTML = "{addeventstc-ghost-link}", n.style.display = "none", document.body.appendChild(n)
                }
                var a = $d("atecllink");
                if (a.target = "_blank", a.href = o, addeventstc.eclick("atecllink"), addeventstc.track({
                    typ: "click",
                    cal: t.service
                }), null != d) addeventstc.trigger("button_dropdown_click", {
                    id: t.button,
                    service: t.service
                }), (event || window.event).stopPropagation()
            }
        }, mouseout: function (t, e) {
            f = !1, addeventstc.hideandreset(), null != o && addeventstc.trigger("button_mouseout", {id: e.id})
        }, show: function (t, e) {
            var o = $d(t), n = $d(t + "-drop");
            if (o && n) if ("block" == addeventstc.getstyle(n, "display")) addeventstc.hideandreset(); else {
                addeventstc.hideandreset(!0), n.style.display = "block", o.style.outline = "0", T = addeventstc.topzindex(), o.style.zIndex = T + 1, o.className = o.className.replace(/\s+/g, " "), o.setAttribute("aria-expanded", "true"), n.setAttribute("aria-hidden", "false"), e.keynav && addeventstc.keyboard(this, {
                    type: "keyboard",
                    id: t,
                    key: "down"
                });
                var a = o.getAttribute("data-dropdown-x"), d = o.getAttribute("data-dropdown-y"), c = "auto",
                    i = "auto";
                null != a && (i = a), null != d && (c = d), n.style.left = "0px", n.style.top = "0px", n.style.display = "block";
                var s = parseInt(o.offsetHeight), l = parseInt(o.offsetWidth), r = parseInt(n.offsetHeight),
                    p = parseInt(n.offsetWidth), u = addeventstc.viewport(), m = parseInt(u.w), g = parseInt(u.h),
                    v = parseInt(u.x), f = parseInt(u.y), h = addeventstc.elementposition(n), w = parseInt(h.x),
                    x = (parseInt(h.y), addeventstc.elementposition(o)), b = (x.x, w + p), k = m + v, y = 0, _ = 0,
                    N = "", E = x.y - (r / 2 - s);
                "down" == c && "left" == i ? (_ = y = "-2px", N = "topdown") : "up" == c && "left" == i ? (y = "0px", _ = -(r - s - 2) + "px") : "down" == c && "right" == i ? (y = -(p - l - 2) + "px", _ = "-2px", N = "topdown") : "up" == c && "right" == i ? (y = -(p - l - 2) + "px", _ = -(r - s - 2) + "px") : "auto" == c && "left" == i ? (y = "0px", E < f ? (_ = "-2px", N = "topdown") : _ = f + g < E + r ? -(r - s - 2) + "px" : -(r / 2 - s) + "px") : "auto" == c && "right" == i ? (y = -(p - l - 2) + "px", E < f ? (_ = "-2px", N = "topdown") : _ = f + g < E + r ? -(r - s - 2) + "px" : -(r / 2 - s) + "px") : "down" == c && "auto" == i ? (y = k < b ? -(p - l - 2) + "px" : "-2px", _ = "-2px", N = "topdown") : "up" == c && "auto" == i ? (y = k < b ? -(p - l - 2) + "px" : "-2px", _ = -(r - s - 2) + "px") : (E < f ? (_ = "-2px", N = "topdown") : _ = f + g < E + r ? -(r - s - 2) + "px" : -(r / 2 - s) + "px", y = k < b ? -(p - l - 2) + "px" : "-2px"), n.style.left = y, n.style.top = _, "" != N && (n.className = n.className + " " + N), setTimeout(function () {
                    n.className = n.className + " addeventstc-selected"
                }, 1), "click" == e.type && null != A && addeventstc.trigger("button_click", {id: t}), null != C && addeventstc.trigger("button_dropdown_show", {id: t})
            }
        }, hide: function (t) {
            var e = !1;
            ("string" == typeof t && "" !== t || t instanceof String && "" !== t) && (-1 < t.indexOf("addeventstc") || -1 < t.indexOf("stc_node")) && (e = !0), e || addeventstc.hideandreset()
        }, hideandreset: function (t) {
            for (var e = "", o = document.getElementsByTagName("*"), n = 0; n < o.length; n += 1) if (addeventstc.hasclass(o[n], "addeventstc")) {
                o[n].className = o[n].className.replace(/addeventstc-selected/gi, ""), o[n].className = o[n].className.replace(/\s+$/, ""), o[n].style.outline = "";
                var a = $d(o[n].id + "-drop");
                if (a) {
                    var d = addeventstc.getstyle(a, "display");
                    "block" == d && (e = o[n].id), a.style.display = "none", "block" !== (d = addeventstc.getstyle(a, "display")) && (o[n].setAttribute("aria-expanded", "false"), a.setAttribute("aria-hidden", "true"), a.className = a.className.replace(/addeventstc-selected/gi, ""), a.className = a.className.replace(/topdown/gi, ""), a.removeAttribute("style"));
                    for (var c = a.getElementsByTagName("SPAN"), i = 0; i < c.length; i += 1) {
                        var s = new RegExp("(\\s|^)drop_markup(\\s|$)");
                        c[i].className = c[i].className.replace(s, " "), c[i].className = c[i].className.replace(/\s+$/, "")
                    }
                }
            }
            t || null != I && addeventstc.trigger("button_dropdown_hide", {id: e})
        }, getburl: function (t) {
            var e = $d(t.id), o = "";
            return e && (o = e.getAttribute("data-id")), o
        }, trycss: function () {
            if (!$d("stc_tmp_css")) {
                try {
                    var t = "";
                    t = ".addeventstc {visibility:hidden;}", t += ".addeventstc .data {display:none!important;}", m && (t += ".addeventstc {background-image:url(https://www.addevent.com/gfx/icon-calendar-t5.png), url(https://www.addevent.com/gfx/icon-calendar-t1.svg), url(https://www.addevent.com/gfx/icon-apple-t5.svg), url(https://www.addevent.com/gfx/icon-facebook-t5.svg), url(https://www.addevent.com/gfx/icon-google-t5.svg), url(https://www.addevent.com/gfx/icon-outlook-t5.svg),  url(https://www.addevent.com/gfx/icon-outlookcom-t5.svg), url(https://www.addevent.com/gfx/icon-yahoo-t5.svg);background-position:-9999px -9999px;background-repeat:no-repeat;}");
                    var e = document.createElement("style");
                    e.type = "text/css", e.id = "stc_tmp_css", e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t)), document.getElementsByTagName("head")[0].appendChild(e)
                } catch (t) {
                }
                addeventstc.track({typ: "jsinit", cal: ""})
            }
        }, applycss: function () {
            if (!$d("stc_css")) {
                var t = "";
                t += '@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600");', t += '.addeventstc \t\t\t\t\t\t\t{display:inline-block;position:relative;z-index:99998;font-family:"Open Sans",Roboto,"Helvetica Neue",Helvetica,Optima,Segoe,"Segoe UI",Candara,Calibri,Arial,sans-serif;color:#000!important;font-weight:600;line-height:100%;background:#fff;font-size:15px;text-decoration:none;border:1px solid transparent;padding:13px 12px 12px 43px;-webkit-border-radius:3px;border-radius:3px;cursor:pointer;-webkit-font-smoothing:antialiased!important;outline-color:rgba(0,78,255,0.5);text-shadow:1px 1px 1px rgba(0,0,0,0.004);-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);box-shadow:0 0 0 0.5px rgba(50,50,93,.17), 0 2px 5px 0 rgba(50,50,93,.1), 0 1px 1.5px 0 rgba(0,0,0,.07), 0 1px 2px 0 rgba(0,0,0,.08), 0 0 0 0 transparent!important;background-image:url(https://www.addevent.com/gfx/icon-calendar-t5.png), url(https://www.addevent.com/gfx/icon-calendar-t1.svg), url(https://www.addevent.com/gfx/icon-apple-t5.svg), url(https://www.addevent.com/gfx/icon-facebook-t5.svg), url(https://www.addevent.com/gfx/icon-google-t5.svg), url(https://www.addevent.com/gfx/icon-outlook-t5.svg),  url(https://www.addevent.com/gfx/icon-outlookcom-t5.svg), url(https://www.addevent.com/gfx/icon-yahoo-t5.svg);background-position:-9999px -9999px;background-repeat:no-repeat;}', t += ".addeventstc:hover \t\t\t\t\t\t{background-color:#fafafa;color:#000;font-size:15px;text-decoration:none;}", t += ".addeventstc:active \t\t\t\t\t{border-width:2px 1px 0px 1px;}", t += ".addeventstc-selected \t\t\t\t\t{background-color:#f9f9f9;}", t += ".addeventstc .addeventstc_icon \t\t\t{width:18px;height:18px;position:absolute;z-index:1;left:12px;top:10px;background:url(https://www.addevent.com/gfx/icon-calendar-t1.svg) no-repeat;background-size:18px 18px;}", t += ".addeventstc .data \t\t\t\t\t\t{display:none!important;}", t += ".addeventstc br \t\t\t\t\t\t{display:none;}", addeventstc.getlicense(p) ? t += '.addeventstc_dropdown \t\t\t\t{width:230px;position:absolute;padding:6px 0px 6px 0px;font-family:"Open Sans",Roboto,"Helvetica Neue",Helvetica,Optima,Segoe,"Segoe UI",Candara,Calibri,Arial,sans-serif;color:#000!important;font-weight:600;line-height:100%;background:#fff;font-size:15px;text-decoration:none;text-align:left;margin-left:-1px;display:none;-moz-border-radius:3px;-webkit-border-radius:3px;-webkit-box-shadow:rgba(0,0,0,0.4) 0px 10px 26px;-moz-box-shadow:rgba(0,0,0,0.4) 0px 10px 26px;box-shadow:rgba(0,0,0,0.4) 0px 10px 26px;transform:scale(.98,.98) translateY(5px);opacity:0.5;z-index:-1;transition:transform .15s ease;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);}' : t += '.addeventstc_dropdown \t\t\t\t{width:230px;position:absolute;padding:6px 0px 0px 0px;font-family:"Open Sans",Roboto,"Helvetica Neue",Helvetica,Optima,Segoe,"Segoe UI",Candara,Calibri,Arial,sans-serif;color:#000!important;font-weight:600;line-height:100%;background:#fff;font-size:15px;text-decoration:none;text-align:left;margin-left:-1px;display:none;-moz-border-radius:3px;-webkit-border-radius:3px;-webkit-box-shadow:rgba(0,0,0,0.4) 0px 10px 26px;-moz-box-shadow:rgba(0,0,0,0.4) 0px 10px 26px;box-shadow:rgba(0,0,0,0.4) 0px 10px 26px;transform:scale(.98,.98) translateY(5px);opacity:0.5;z-index:-1;transition:transform .15s ease;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);}', t += ".addeventstc_dropdown.topdown \t\t\t{transform:scale(.98,.98) translateY(-5px)!important;}", t += ".addeventstc_dropdown span \t\t\t\t{display:block;line-height:100%;background:#fff;text-decoration:none;cursor:pointer;font-size:15px;color:#333;font-weight:600;padding:14px 10px 14px 55px;-webkit-transition:background-color .3s;transition:background-color .3s;}", t += ".addeventstc_dropdown span:hover \t\t{background-color:#f4f4f4;color:#000;text-decoration:none;font-size:15px;}", t += ".addeventstc_dropdown em \t\t\t\t{color:#999!important;font-size:12px!important;font-weight:400;}", t += ".addeventstc_dropdown .frs a \t\t\t{background:#fff;color:#cacaca!important;cursor:pointer;font-size:9px!important;font-style:normal!important;font-weight:400!important;line-height:110%!important;padding-left:10px;position:absolute;right:10px;text-align:right;text-decoration:none;top:5px;z-index:101;}", t += ".addeventstc_dropdown .frs a:hover \t\t{color:#999!important;}", t += ".addeventstc_dropdown .ateappleical \t{background:url(https://www.addevent.com/gfx/icon-apple-t5.svg) 18px 40% no-repeat;background-size:22px 100%;}", t += ".addeventstc_dropdown .ategoogle \t\t{background:url(https://www.addevent.com/gfx/icon-google-t5.svg) 18px 50% no-repeat;background-size:22px 100%;}", t += ".addeventstc_dropdown .ateoutlook \t\t{background:url(https://www.addevent.com/gfx/icon-outlook-t5.svg) 18px 50% no-repeat;background-size:22px 100%;}", t += ".addeventstc_dropdown .ateoutlookcom \t{background:url(https://www.addevent.com/gfx/icon-outlookcom-t5.svg) 18px 50% no-repeat;background-size:22px 100%;}", t += ".addeventstc_dropdown .ateyahoo \t\t{background:url(https://www.addevent.com/gfx/icon-yahoo-t5.svg) 18px 50% no-repeat;background-size:22px 100%;}", t += ".addeventstc_dropdown .atefacebook \t\t{background:url(https://www.addevent.com/gfx/icon-facebook-t5.svg) 18px 50% no-repeat;background-size:22px 100%;}", t += ".addeventstc_dropdown .copyx \t\t\t{height:21px;display:block;position:relative;cursor:default;}", t += ".addeventstc_dropdown .brx \t\t\t\t{height:1px;overflow:hidden;background:#e8e8e8;position:absolute;z-index:100;left:10px;right:10px;top:9px;}", t += ".addeventstc_dropdown.addeventstc-selected {opacity:1;transform:scale(1,1) translateY(0px);z-index:99999;}", t += ".addeventstc_dropdown.topdown.addeventstc-selected {transform:scale(1,1) translateY(0px)!important;}", t += ".addeventstc_dropdown .drop_markup {background-color:#f4f4f4;}";
                var e = document.createElement("style");
                e.type = "text/css", e.id = "stc_css", e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t)), document.getElementsByTagName("head")[0].appendChild(e), addeventstc.removeelement($d("stc_tmp_css"))
            }
        }, helpercss: function () {
            if (!$d("ste_helper_css")) {
                var t = "";
                t += ".addeventstc_dropdown .drop_markup {background-color:#f4f4f4;}", t += ".addeventstc_dropdown .frs a {margin:0!important;padding:0!important;font-style:normal!important;font-weight:normal!important;line-height:110%!important;background-color:#fff!important;text-decoration:none;font-size:9px!important;color:#cacaca!important;display:inline-block;}", t += ".addeventstc_dropdown .frs a:hover {color:#999!important;}";
                var e = document.createElement("style");
                e.type = "text/css", e.id = "ste_helper_css", e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t)), document.getElementsByTagName("head")[0].appendChild(e)
            }
        }, removeelement: function (t) {
            try {
                return !!(hdx = t) && hdx.parentNode.removeChild(hdx)
            } catch (t) {
            }
        }, topzindex: function () {
            for (var t = 1, e = document.getElementsByTagName("*"), o = 0; o < e.length; o += 1) if (addeventstc.hasclass(e[o], "addeventatc") || addeventstc.hasclass(e[o], "addeventstc")) {
                var n = addeventstc.getstyle(e[o], "z-index");
                !isNaN(parseFloat(n)) && isFinite(n) && t < (n = parseInt(n)) && (t = n)
            }
            return t
        }, viewport: function () {
            var t = 0, e = 0, o = 0, n = 0;
            return "number" == typeof window.innerWidth ? (t = window.innerWidth, e = window.innerHeight) : document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight) ? (t = document.documentElement.clientWidth, e = document.documentElement.clientHeight) : document.body && (document.body.clientWidth || document.body.clientHeight) && (t = document.body.clientWidth, e = document.body.clientHeight), document.all ? (n = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft, o = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) : (n = window.pageXOffset, o = window.pageYOffset), {
                w: t,
                h: e,
                x: n,
                y: o
            }
        }, elementposition: function (t) {
            var e = 0, o = 0;
            if (t.offsetParent) for (e = t.offsetLeft, o = t.offsetTop; t = t.offsetParent;) e += t.offsetLeft, o += t.offsetTop;
            return {x: e, y: o}
        }, getstyle: function (t, e) {
            var o, n = t;
            return n.currentStyle ? o = n.currentStyle[e] : window.getComputedStyle && (o = document.defaultView.getComputedStyle(n, null).getPropertyValue(e)), o
        }, getlicense: function (t) {
            var e = location.origin, o = !1;
            if (void 0 === location.origin && (e = location.protocol + "//" + location.host), t) {
                var n = t.substring(0, 1), a = t.substring(9, 10), d = t.substring(17, 18);
                "a" == n && "z" == a && "m" == d && (o = !0)
            }
            return (-1 == e.indexOf("addthisevent.com") && "aao8iuet5zp9iqw5sm9z" == t || -1 == e.indexOf("addevent.to") && "aao8iuet5zp9iqw5sm9z" == t || -1 == e.indexOf("addevent.com") && "aao8iuet5zp9iqw5sm9z" == t) && (o = !0), o
        }, refresh: function () {
            for (var t = document.getElementsByTagName("*"), e = [], o = 0; o < t.length; o += 1) if (addeventstc.hasclass(t[o], "addeventstc")) {
                t[o].className = t[o].className.replace(/addeventstc-selected/gi, ""), t[o].id = "";
                for (var n = t[o].getElementsByTagName("*"), a = 0; a < n.length; a += 1) (addeventstc.hasclass(n[a], "addeventstc_icon") || addeventstc.hasclass(n[a], "addeventstc_dropdown")) && e.push(n[a])
            }
            for (var d = 0; d < e.length; d += 1) addeventstc.removeelement(e[d]);
            addeventstc.removeelement($d("stc_css")), v = !(l = 1), addeventstc.generate()
        }, hasclass: function (t, e) {
            return new RegExp("(\\s|^)" + e + "(\\s|$)").test(t.className)
        }, eclick: function (t) {
            var e = document.getElementById(t);
            if (e.click) e.click(); else if (document.createEvent) {
                var o = document.createEvent("MouseEvents");
                o.initEvent("click", !0, !0), e.dispatchEvent(o)
            }
        }, track: function (t) {
            new Image, (new Date).getTime(), encodeURIComponent(window.location.origin)
        }, getguid: function () {
            for (var t = "addevent_track_cookie=", e = "", o = document.cookie.split(";"), n = 0; n < o.length; n++) {
                for (var a = o[n]; " " == a.charAt(0);) a = a.substring(1, a.length);
                0 == a.indexOf(t) && (e = a.substring(t.length, a.length))
            }
            if ("" == e) {
                var d = (addeventstc.s4() + addeventstc.s4() + "-" + addeventstc.s4() + "-4" + addeventstc.s4().substr(0, 3) + "-" + addeventstc.s4() + "-" + addeventstc.s4() + addeventstc.s4() + addeventstc.s4()).toLowerCase(),
                    c = new Date;
                c.setTime(c.getTime() + 31536e6);
                var i = "expires=" + c.toUTCString();
                document.cookie = "addevent_track_cookie=" + d + "; " + i, e = d
            }
            return e
        }, s4: function () {
            return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
        }, documentclick: function (t) {
            t.type;
            t = (t = t || window.event).target || t.srcElement, ate_touch_capable ? (clearTimeout(e), e = setTimeout(function () {
                addeventstc.hide(t.className)
            }, 200)) : addeventstc.hide(t.className)
        }, trigger: function (t, e) {
            if ("button_click" == t) try {
                A(e)
            } catch (t) {
                alert(t.description)
            }
            if ("button_mouseover" == t) try {
                S(e)
            } catch (t) {
            }
            if ("button_mouseout" == t) try {
                o(e)
            } catch (t) {
            }
            if ("button_dropdown_show" == t) try {
                C(e)
            } catch (t) {
            }
            if ("button_dropdown_hide" == t) try {
                I(e)
            } catch (t) {
            }
            if ("button_dropdown_click" == t) try {
                d(e)
            } catch (t) {
            }
        }, register: function (t, e) {
            "button-click" == t && (A = e), "button-mouseover" == t && (S = e), "button-mouseout" == t && (o = e), "button-dropdown-show" == t && (C = e), "button-dropdown-hide" == t && (I = e), "button-dropdown-click" == t && (d = e)
        }, settings: function (t) {
            null != t.license && (p = t.license), null != t.css && (t.css ? m = !0 : (m = !1, addeventstc.removeelement($d("stc_css")))), null != t.mouse && (r = t.mouse), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (r = !1), null != t.outlook && null != t.outlook.show && (b = t.outlook.show), null != t.google && null != t.google.show && (x = t.google.show), null != t.yahoo && null != t.yahoo.show && (y = t.yahoo.show), null != t.hotmail && null != t.hotmail.show && (k = t.hotmail.show), null != t.outlookcom && null != t.outlookcom.show && (k = t.outlookcom.show), null != t.ical && null != t.ical.show && (w = t.ical.show), null != t.appleical && null != t.appleical.show && (w = t.appleical.show), null != t.outlook && null != t.outlook.text && (E = t.outlook.text), null != t.google && null != t.google.text && (N = t.google.text), null != t.yahoo && null != t.yahoo.text && ($ = t.yahoo.text), null != t.hotmail && null != t.hotmail.text && (z = t.hotmail.text), null != t.outlookcom && null != t.outlookcom.text && (z = t.outlookcom.text), null != t.ical && null != t.ical.text && (_ = t.ical.text), null != t.appleical && null != t.appleical.text && (_ = t.appleical.text), null != t.dropdown && null != t.dropdown.order && (h = t.dropdown.order)
        }, keyboard: function (t, e) {
            var o = document.getElementById(e.id + "-drop");
            if (o && "block" == addeventstc.getstyle(o, "display")) {
                for (var n = o.getElementsByTagName("SPAN"), a = null, d = 0, c = 0, i = 0; i < n.length; i += 1) d++, addeventstc.hasclass(n[i], "drop_markup") && (a = n[i], c = d);
                null === a ? c = 1 : "down" == e.key ? d <= c ? c = 1 : c++ : 1 == c ? c = d : c--;
                for (i = d = 0; i < n.length; i += 1) if (++d == c) n[i].className += " drop_markup"; else {
                    var s = new RegExp("(\\s|^)drop_markup(\\s|$)");
                    n[i].className = n[i].className.replace(s, " "), n[i].className = n[i].className.replace(/\s+$/, "")
                }
            }
        }, keyboardclick: function (t, e) {
            var o = document.getElementById(e.id + "-drop");
            if (o) {
                for (var n = o.getElementsByTagName("SPAN"), a = null, d = 0; d < n.length; d += 1) addeventstc.hasclass(n[d], "drop_markup") && (a = n[d]);
                if (null !== a) {
                    a.click();
                    for (d = 0; d < n.length; d += 1) {
                        var c = new RegExp("(\\s|^)drop_markup(\\s|$)");
                        n[d].className = n[d].className.replace(c, " "), n[d].className = n[d].className.replace(/\s+$/, "")
                    }
                }
            }
        }, agent: function () {
            var t = navigator.userAgent || navigator.vendor || window.opera;
            return /windows phone/i.test(t) ? "windows_phone" : /android/i.test(t) ? "android" : /iPad|iPhone|iPod/.test(t) && !window.MSStream ? "ios" : "unknown"
        }
    }
}();
!function (t, e) {
    "use strict";
    t = t || "docReady", e = e || window;
    var o = [], n = !1, a = !1;

    function d() {
        if (!n) {
            n = !0;
            for (var t = 0; t < o.length; t++) o[t].fn.call(window, o[t].ctx);
            o = []
        }
    }

    function c() {
        "complete" === document.readyState && d()
    }

    e[t] = function (t, e) {
        if ("function" != typeof t) throw new TypeError("callback for docReady(fn) must be a function");
        n ? setTimeout(function () {
            t(e)
        }, 1) : (o.push({
            fn: t,
            ctx: e
        }), "complete" === document.readyState || !document.attachEvent && "interactive" === document.readyState ? setTimeout(d, 1) : a || (document.addEventListener ? (document.addEventListener("DOMContentLoaded", d, !1), window.addEventListener("load", d, !1)) : (document.attachEvent("onreadystatechange", c), window.attachEvent("onload", d)), a = !0))
    }
}("addeventReady", window);
var ate_touch_capable = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch || 0 < navigator.maxTouchPoints || 0 < window.navigator.msMaxTouchPoints;
window.addEventListener ? (document.addEventListener("click", addeventstc.documentclick, !1), ate_touch_capable && document.addEventListener("touchend", addeventstc.documentclick, !1)) : window.attachEvent ? (document.attachEvent("onclick", addeventstc.documentclick), ate_touch_capable && document.addEventListener("ontouchend", addeventstc.documentclick, !1)) : document.onclick = function () {
    addeventstc.documentclick(event)
}, addeventReady(function () {
    addeventstc.initialize(), setTimeout("addeventstc.initialize();", 200)
});