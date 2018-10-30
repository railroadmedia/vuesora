function $d(e) {
    return document.getElementById(e)
}

window.addeventatc = function () {
    var u, v, l, t, e = !1, s = 1, r = !1, p = !0, m = !1, g = !1, h = !1, E = 1, f = "", w = !0, x = !0, b = !0,
        k = !0, y = !0, _ = !0, T = "Apple", N = "Google <em>(online)</em>", z = "Outlook",
        C = "Outlook.com <em>(online)</em>", I = "Yahoo <em>(online)</em>", A = "Facebook Event", $ = null, S = null,
        a = null, L = null, H = null, R = null, M = !1;
    return {
        initialize: function () {
            if (!e) {
                e = !0;
                try {
                    addeventasync()
                } catch (e) {
                }
                "https:", "addevent.com", "https://addevent.com", "undefined" != typeof SVGRect ? "https://www.addevent.com/gfx/icon-calendar-t1.svg" : "https://www.addevent.com/gfx/icon-calendar-t5.png", addeventatc.trycss(), addeventatc.generate()
            }
        }, generate: function () {
            for (var c = document.getElementsByTagName("*"), i = 0; i < c.length; i += 1) addeventatc.hasclass(c[i], "addeventatc") && function () {
                var a = "addeventatc" + s;
                c[i].id = a, c[i].title = "", c[i].setAttribute("aria-haspopup", "true"), c[i].setAttribute("aria-expanded", "false"), c[i].setAttribute("tabindex", "0"), r ? (c[i].onclick = function () {
                    return !1
                }, c[i].onmouseover = function () {
                    clearTimeout(l), addeventatc.toogle(this, {type: "mouseover", id: a})
                }, c[i].onmouseout = function () {
                    l = setTimeout(function () {
                        addeventatc.mouseout(this, {type: "mouseout", id: a})
                    }, 100)
                }) : (c[i].onclick = function () {
                    return addeventatc.toogle(this, {type: "click", id: a}), !1
                }, c[i].onmouseover = function () {
                }, c[i].onmouseout = function () {
                }), c[i].onkeydown = function (e) {
                    var t = e.which || e.keyCode;
                    "13" != t && "32" != t && "27" != t && "38" != t && "40" != t || e.preventDefault(), "13" != t && "32" != t || (addeventatc.keyboardclick(this, {
                        type: "click",
                        id: a
                    }), addeventatc.toogle(this, {
                        type: "click",
                        id: a,
                        keynav: !0
                    })), "27" == t && addeventatc.hideandreset(), "38" == t && addeventatc.keyboard(this, {
                        type: "keyboard",
                        id: a,
                        key: "up"
                    }), "40" == t && addeventatc.keyboard(this, {type: "keyboard", id: a, key: "down"}), M = !0
                }, c[i].onblur = function () {
                    M && setTimeout(function () {
                        addeventatc.hideandreset()
                    }, 300)
                };
                var e = c[i];
                if ("none" != c[i].getAttribute("data-styling") && "inline-buttons" != c[i].getAttribute("data-render") || (p = !1), p) {
                    var t = document.createElement("span");
                    t.className = "addeventatc_icon", e.appendChild(t)
                }
                s++, m = !0;
                for (var n = c[i].getElementsByTagName("*"), o = 0; o < n.length; o += 1) addeventatc.hasclass(n[o], "atc_node") || ("" != n[o].className ? n[o].className += " atc_node" : n[o].className += "atc_node");
                if ("inline-buttons" == c[i].getAttribute("data-render")) {
                    c[i].onclick = function () {
                    }, addeventatc.toogle(c[i], {
                        type: "render",
                        id: a
                    }), c[i].setAttribute("aria-expanded", "true"), c[i].removeAttribute("tabindex"), c[i].onkeydown = function () {
                    }, c[i].blur = function () {
                    };
                    var d = document.getElementById(a + "-drop");
                    if (d) {
                        d.setAttribute("aria-hidden", "false");
                        for (n = d.getElementsByTagName("SPAN"), o = 0; o < n.length; o += 1) {
                            n[o];
                            n[o].tabIndex = "0", n[o].onkeydown = function (e) {
                                var t = e.which || e.keyCode;
                                "13" != t && "32" != t || e.target.click()
                            }
                        }
                    }
                }
            }();
            p ? addeventatc.applycss() : (addeventatc.removeelement($d("ate_css")), addeventatc.removeelement($d("ate_tmp_css")), addeventatc.helpercss()), m && !g && (g = !0, addeventatc.track({
                typ: "exposure",
                cal: ""
            }))
        }, toogle: function (e, t) {
            var a, n, o, d = !1, c = "";
            if (n = $d(a = e.id)) {
                o = n.getAttribute("data-direct");
                var i = n.getAttribute("data-intel"), l = n.getAttribute("data-intel-apple");
                if ("ios" == addeventatc.agent() && "click" == t.type && "true" !== l && "false" !== i && (o = "appleical", n.setAttribute("data-intel-apple", "true")), "outlook" == o || "google" == o || "yahoo" == o || "hotmail" == o || "outlookcom" == o || "appleical" == o || "apple" == o || "facebook" == o) "click" == t.type && (addeventatc.click({
                    button: a,
                    service: o,
                    id: t.id
                }), null != $ && addeventatc.trigger("button_click", {id: a})); else if ("mouseover" == t.type && v != n && (h = !1), "click" == t.type || "render" == t.type || "mouseover" == t.type && !h) {
                    "mouseover" == t.type && (h = !0, null != S && addeventatc.trigger("button_mouseover", {id: a})), d = addeventatc.getburl({
                        id: a,
                        facebook: !0
                    }), "" == f && (f = "appleical,google,outlook,outlookcom,yahoo,facebook");
                    for (var s = (f = (f += ",").replace(/ /gi, "")).split(","), r = 0; r < s.length; r += 1) (w && "ical" == s[r] || w && "appleical" == s[r]) && (c += '<span class="ateappleical" id="' + a + '-appleical" role="menuitem">' + T + "</span>"), x && "google" == s[r] && (c += '<span class="ategoogle" id="' + a + '-google" role="menuitem">' + N + "</span>"), b && "outlook" == s[r] && (c += '<span class="ateoutlook" id="' + a + '-outlook" role="menuitem">' + z + "</span>"), (k && "hotmail" == s[r] || k && "outlookcom" == s[r]) && (c += '<span class="ateoutlookcom" id="' + a + '-outlookcom" role="menuitem">' + C + "</span>"), y && "yahoo" == s[r] && (c += '<span class="ateyahoo" id="' + a + '-yahoo" role="menuitem">' + I + "</span>"), d && "facebook" == s[r] && _ && "facebook" == s[r] && (c += '<span class="atefacebook" id="' + a + '-facebook" role="menuitem">' + A + "</span>");
                    if (addeventatc.getlicense(u) || (c += '<em class="copyx"><em class="brx"></em><em class="frs"><a href="https://www.addevent.com" title="" tabindex="-1" id="' + a + '-home">AddEvent.com</a></em></em>'), !$d(a + "-drop")) {
                        var p = document.createElement("span");
                        p.id = a + "-drop", p.className = "addeventatc_dropdown", p.setAttribute("aria-hidden", "true"), p.setAttribute("aria-labelledby", a), p.innerHTML = c, n.appendChild(p)
                    }
                    $d(a + "-appleical") && ($d(a + "-appleical").onclick = function () {
                        addeventatc.click({button: a, service: "appleical", id: t.id})
                    }), $d(a + "-google") && ($d(a + "-google").onclick = function () {
                        addeventatc.click({button: a, service: "google", id: t.id})
                    }), $d(a + "-outlook") && ($d(a + "-outlook").onclick = function () {
                        addeventatc.click({button: a, service: "outlook", id: t.id})
                    }), $d(a + "-outlookcom") && ($d(a + "-outlookcom").onclick = function () {
                        addeventatc.click({button: a, service: "outlookcom", id: t.id})
                    }), $d(a + "-yahoo") && ($d(a + "-yahoo").onclick = function () {
                        addeventatc.click({button: a, service: "yahoo", id: t.id})
                    }), $d(a + "-facebook") && ($d(a + "-facebook").onclick = function () {
                        addeventatc.click({button: a, service: "facebook", id: t.id})
                    }), $d(a + "-home") && ($d(a + "-home").onclick = function () {
                        addeventatc.click({button: a, service: "home", id: t.id})
                    }), addeventatc.show(a, t)
                }
                return v = n, !1
            }
        }, click: function (e) {
            var t, a, n, o = location.origin, d = !0;
            if (void 0 === location.origin && (o = location.protocol + "//" + location.host), t = $d(e.button)) {
                if ("home" == e.service) n = "https://www.addevent.com"; else {
                    a = addeventatc.getburl({
                        id: e.button,
                        facebook: !1
                    }), n = "https://www.addevent.com/create/?service=" + e.service + a + "&reference=" + o, "outlook" != e.service && "appleical" != e.service || (d = !1, addeventatc.usewebcal() && (n = "webcal://www.addevent.com/create/?uwc=on&service=" + e.service + a + "&reference=" + o));
                    var c = t.getAttribute("data-id");
                    null !== c && (n = "https://www.addevent.com/event/" + c + "+" + e.service)
                }
                if (!$d("atecllink")) {
                    var i = document.createElement("a");
                    i.id = "atecllink", i.rel = "external", i.setAttribute("data-role", "none"), i.innerHTML = "{addeventatc-ghost-link}", i.style.display = "none", document.body.appendChild(i)
                }
                var l = $d("atecllink");
                if (l.target = d ? "_blank" : "_self", l.href = n, addeventatc.eclick("atecllink"), addeventatc.track({
                    typ: "click",
                    cal: e.service
                }), null != R) {
                    addeventatc.trigger("button_dropdown_click", {id: e.button, service: e.service});
                    try {
                        (event || window.event).stopPropagation()
                    } catch (e) {
                    }
                }
            }
        }, mouseout: function (e, t) {
            h = !1, addeventatc.hideandreset(), null != a && addeventatc.trigger("button_mouseout", {id: t.id})
        }, show: function (e, t) {
            var a = $d(e), n = $d(e + "-drop");
            if (a && n) if ("block" == addeventatc.getstyle(n, "display")) addeventatc.hideandreset(); else {
                addeventatc.hideandreset(!0), n.style.display = "block", a.style.outline = "0", E = addeventatc.topzindex(), a.style.zIndex = E + 1, a.className = a.className.replace(/\s+/g, " "), a.setAttribute("aria-expanded", "true"), n.setAttribute("aria-hidden", "false"), t.keynav && addeventatc.keyboard(this, {
                    type: "keyboard",
                    id: e,
                    key: "down"
                });
                var o = a.getAttribute("data-dropdown-x"), d = a.getAttribute("data-dropdown-y"), c = "auto",
                    i = "auto";
                null != o && (i = o), null != d && (c = d), n.style.left = "0px", n.style.top = "0px", n.style.display = "block";
                var l = parseInt(a.offsetHeight), s = parseInt(a.offsetWidth), r = parseInt(n.offsetHeight),
                    p = parseInt(n.offsetWidth), u = addeventatc.viewport(), v = parseInt(u.w), m = parseInt(u.h),
                    g = parseInt(u.x), h = parseInt(u.y), f = addeventatc.elementposition(n), w = parseInt(f.x),
                    x = (parseInt(f.y), addeventatc.elementposition(a)), b = (x.x, w + p), k = v + g, y = 0, _ = 0,
                    T = "", N = x.y - (r / 2 - l);
                "down" == c && "left" == i ? (_ = y = "-2px", T = "topdown") : "up" == c && "left" == i ? (y = "0px", _ = -(r - l - 2) + "px") : "down" == c && "right" == i ? (y = -(p - s - 2) + "px", _ = "-2px", T = "topdown") : "up" == c && "right" == i ? (y = -(p - s - 2) + "px", _ = -(r - l - 2) + "px") : "auto" == c && "left" == i ? (y = "0px", N < h ? (_ = "-2px", T = "topdown") : _ = h + m < N + r ? -(r - l - 2) + "px" : -(r / 2 - l) + "px") : "auto" == c && "right" == i ? (y = -(p - s - 2) + "px", N < h ? (_ = "-2px", T = "topdown") : _ = h + m < N + r ? -(r - l - 2) + "px" : -(r / 2 - l) + "px") : "down" == c && "auto" == i ? (y = k < b ? -(p - s - 2) + "px" : "-2px", _ = "-2px", T = "topdown") : "up" == c && "auto" == i ? (y = k < b ? -(p - s - 2) + "px" : "-2px", _ = -(r - l - 2) + "px") : (N < h ? (_ = "-2px", T = "topdown") : _ = h + m < N + r ? -(r - l - 2) + "px" : -(r / 2 - l) + "px", y = k < b ? -(p - s - 2) + "px" : "-2px"), n.style.left = y, n.style.top = _, "" != T && (n.className = n.className + " " + T), setTimeout(function () {
                    n.className = n.className + " addeventatc-selected"
                }, 1), "click" == t.type && null != $ && addeventatc.trigger("button_click", {id: e}), null != L && addeventatc.trigger("button_dropdown_show", {id: e})
            }
        }, hide: function (e) {
            var t = !1;
            ("string" == typeof e && "" !== e || e instanceof String && "" !== e) && (-1 < e.indexOf("addeventatc") || -1 < e.indexOf("atc_node")) && (t = !0), t || addeventatc.hideandreset()
        }, hideandreset: function (e) {
            for (var t = "", a = document.getElementsByTagName("*"), n = 0; n < a.length; n += 1) if (addeventatc.hasclass(a[n], "addeventatc")) {
                a[n].className = a[n].className.replace(/addeventatc-selected/gi, ""), a[n].className = a[n].className.replace(/\s+$/, ""), a[n].style.outline = "";
                var o = $d(a[n].id + "-drop");
                if (o) {
                    var d = addeventatc.getstyle(o, "display");
                    "block" == d && (t = a[n].id), o.style.display = "none", "block" !== (d = addeventatc.getstyle(o, "display")) && (a[n].setAttribute("aria-expanded", "false"), o.setAttribute("aria-hidden", "true"), o.className = o.className.replace(/addeventatc-selected/gi, ""), o.className = o.className.replace(/topdown/gi, ""), o.removeAttribute("style"));
                    for (var c = o.getElementsByTagName("SPAN"), i = 0; i < c.length; i += 1) {
                        var l = new RegExp("(\\s|^)drop_markup(\\s|$)");
                        c[i].className = c[i].className.replace(l, " "), c[i].className = c[i].className.replace(/\s+$/, "")
                    }
                }
            }
            e || null != H && addeventatc.trigger("button_dropdown_hide", {id: t})
        }, getburl: function (e) {
            var t = $d(e.id), a = "", n = !1;
            if (t) {
                for (var o = t.getElementsByTagName("*"), d = 0; d < o.length; d += 1) (addeventatc.hasclass(o[d], "_start") || addeventatc.hasclass(o[d], "start")) && (a += "&dstart=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_end") || addeventatc.hasclass(o[d], "end")) && (a += "&dend=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_zonecode") || addeventatc.hasclass(o[d], "zonecode")) && (a += "&dzone=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_timezone") || addeventatc.hasclass(o[d], "timezone")) && (a += "&dtime=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_summary") || addeventatc.hasclass(o[d], "summary") || addeventatc.hasclass(o[d], "title")) && (a += "&dsum=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_description") || addeventatc.hasclass(o[d], "description")) && (a += "&ddesc=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_location") || addeventatc.hasclass(o[d], "location")) && (a += "&dloca=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_organizer") || addeventatc.hasclass(o[d], "organizer")) && (a += "&dorga=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_organizer_email") || addeventatc.hasclass(o[d], "organizer_email")) && (a += "&dorgaem=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_attendees") || addeventatc.hasclass(o[d], "attendees")) && (a += "&datte=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_all_day_event") || addeventatc.hasclass(o[d], "all_day_event")) && (a += "&dallday=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_date_format") || addeventatc.hasclass(o[d], "date_format")) && (a += "&dateformat=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_alarm_reminder") || addeventatc.hasclass(o[d], "alarm_reminder")) && (a += "&alarm=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_recurring") || addeventatc.hasclass(o[d], "recurring")) && (a += "&drule=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_facebook_event") || addeventatc.hasclass(o[d], "facebook_event")) && (a += "&fbevent=" + encodeURIComponent(o[d].innerHTML), n = !0), (addeventatc.hasclass(o[d], "_client") || addeventatc.hasclass(o[d], "client")) && (a += "&client=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_calname") || addeventatc.hasclass(o[d], "calname")) && (a += "&calname=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_uid") || addeventatc.hasclass(o[d], "uid")) && (a += "&uid=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_status") || addeventatc.hasclass(o[d], "status")) && (a += "&status=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_method") || addeventatc.hasclass(o[d], "method")) && (a += "&method=" + encodeURIComponent(o[d].innerHTML)), (addeventatc.hasclass(o[d], "_transp") || addeventatc.hasclass(o[d], "transp")) && (a += "&transp=" + encodeURIComponent(o[d].innerHTML));
                "false" == t.getAttribute("data-google-api") && (a += "&gapi=false")
            }
            return e.facebook && (a = n), a
        }, trycss: function () {
            if (!$d("ate_tmp_css")) {
                try {
                    var e = "";
                    e += ".addeventatc .data {display:none!important;}", e += ".addeventatc .start, .addeventatc .end, .addeventatc .timezone, .addeventatc .title, .addeventatc .description, .addeventatc .location, .addeventatc .organizer, .addeventatc .organizer_email, .addeventatc .facebook_event, .addeventatc .all_day_event, .addeventatc .date_format, .addeventatc .alarm_reminder, .addeventatc .recurring, .addeventatc .attendees, .addeventatc .client, .addeventatc .calname, .addeventatc .uid, .addeventatc .status, .addeventatc .method, .addeventatc .transp {display:none!important;}", p && (e += ".addeventatc {background-image:url(https://www.addevent.com/gfx/icon-calendar-t5.png), url(https://www.addevent.com/gfx/icon-calendar-t1.svg), url(https://www.addevent.com/gfx/icon-apple-t5.svg), url(https://www.addevent.com/gfx/icon-facebook-t5.svg), url(https://www.addevent.com/gfx/icon-google-t5.svg), url(https://www.addevent.com/gfx/icon-outlook-t5.svg),  url(https://www.addevent.com/gfx/icon-outlookcom-t5.svg), url(https://www.addevent.com/gfx/icon-yahoo-t5.svg);background-position:-9999px -9999px;background-repeat:no-repeat;}");
                    var t = document.createElement("style");
                    t.type = "text/css", t.id = "ate_tmp_css", t.styleSheet ? t.styleSheet.cssText = e : t.appendChild(document.createTextNode(e)), document.getElementsByTagName("head")[0].appendChild(t)
                } catch (e) {
                }
                addeventatc.track({typ: "jsinit", cal: ""})
            }
        }, applycss: function () {
            if (!$d("ate_css")) {
                var e = "";
                e += '@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600");', e += '.addeventatc \t\t\t\t\t\t\t{display:inline-block;position:relative;z-index:99998;font-family:"Open Sans",Roboto,"Helvetica Neue",Helvetica,Optima,Segoe,"Segoe UI",Candara,Calibri,Arial,sans-serif;color:#000!important;font-weight:600;line-height:100%;background:#fff;font-size:15px;text-decoration:none;border:1px solid transparent;padding:13px 12px 12px 43px;-webkit-border-radius:3px;border-radius:3px;cursor:pointer;-webkit-font-smoothing:antialiased!important;outline-color:rgba(0,78,255,0.5);text-shadow:1px 1px 1px rgba(0,0,0,0.004);-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);box-shadow:0 0 0 0.5px rgba(50,50,93,.17), 0 2px 5px 0 rgba(50,50,93,.1), 0 1px 1.5px 0 rgba(0,0,0,.07), 0 1px 2px 0 rgba(0,0,0,.08), 0 0 0 0 transparent!important;background-image:url(https://www.addevent.com/gfx/icon-calendar-t5.png), url(https://www.addevent.com/gfx/icon-calendar-t1.svg), url(https://www.addevent.com/gfx/icon-apple-t5.svg), url(https://www.addevent.com/gfx/icon-facebook-t5.svg), url(https://www.addevent.com/gfx/icon-google-t5.svg), url(https://www.addevent.com/gfx/icon-outlook-t5.svg),  url(https://www.addevent.com/gfx/icon-outlookcom-t5.svg), url(https://www.addevent.com/gfx/icon-yahoo-t5.svg);background-position:-9999px -9999px;background-repeat:no-repeat;}', e += ".addeventatc:hover \t\t\t\t\t\t{background-color:#fafafa;color:#000;font-size:15px;text-decoration:none;}", e += ".addeventatc:active \t\t\t\t\t{border-width:2px 1px 0px 1px;}", e += ".addeventatc-selected \t\t\t\t\t{background-color:#f9f9f9;}", e += ".addeventatc .addeventatc_icon \t\t\t{width:18px;height:18px;position:absolute;z-index:1;left:12px;top:10px;background:url(https://www.addevent.com/gfx/icon-calendar-t1.svg) no-repeat;background-size:18px 18px;}", e += ".addeventatc .start, .addeventatc .end, .addeventatc .timezone, .addeventatc .title, .addeventatc .description, .addeventatc .location, .addeventatc .organizer, .addeventatc .organizer_email, .addeventatc .facebook_event, .addeventatc .all_day_event, .addeventatc .date_format, .addeventatc .alarm_reminder, .addeventatc .recurring, .addeventatc .attendees, .addeventatc .calname, .addeventatc .uid, .addeventatc .status, .addeventatc .method, .addeventatc .client, .addeventatc .transp {display:none!important;}", e += ".addeventatc br \t\t\t\t\t\t{display:none;}", addeventatc.getlicense(u) ? e += '.addeventatc_dropdown \t\t\t\t{width:230px;position:absolute;padding:6px 0px 6px 0px;font-family:"Open Sans",Roboto,"Helvetica Neue",Helvetica,Optima,Segoe,"Segoe UI",Candara,Calibri,Arial,sans-serif;color:#000!important;font-weight:600;line-height:100%;background:#fff;font-size:15px;text-decoration:none;text-align:left;margin-left:-1px;display:none;-moz-border-radius:3px;-webkit-border-radius:3px;-webkit-box-shadow:rgba(0,0,0,0.4) 0px 10px 26px;-moz-box-shadow:rgba(0,0,0,0.4) 0px 10px 26px;box-shadow:rgba(0,0,0,0.4) 0px 10px 26px;transform:scale(.98,.98) translateY(5px);opacity:0.5;z-index:-1;transition:transform .15s ease;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);}' : e += '.addeventatc_dropdown \t\t\t\t{width:230px;position:absolute;padding:6px 0px 0px 0px;font-family:"Open Sans",Roboto,"Helvetica Neue",Helvetica,Optima,Segoe,"Segoe UI",Candara,Calibri,Arial,sans-serif;color:#000!important;font-weight:600;line-height:100%;background:#fff;font-size:15px;text-decoration:none;text-align:left;margin-left:-1px;display:none;-moz-border-radius:3px;-webkit-border-radius:3px;-webkit-box-shadow:rgba(0,0,0,0.4) 0px 10px 26px;-moz-box-shadow:rgba(0,0,0,0.4) 0px 10px 26px;box-shadow:rgba(0,0,0,0.4) 0px 10px 26px;transform:scale(.98,.98) translateY(5px);opacity:0.5;z-index:-1;transition:transform .15s ease;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);}', e += ".addeventatc_dropdown.topdown \t\t\t{transform:scale(.98,.98) translateY(-5px)!important;}", e += ".addeventatc_dropdown span \t\t\t\t{display:block;line-height:100%;background:#fff;text-decoration:none;cursor:pointer;font-size:15px;color:#333;font-weight:600;padding:14px 10px 14px 55px;-webkit-transition:background-color .3s;transition:background-color .3s;}", e += ".addeventatc_dropdown span:hover \t\t{background-color:#f4f4f4;color:#000;text-decoration:none;font-size:15px;}", e += ".addeventatc_dropdown em \t\t\t\t{color:#999!important;font-size:12px!important;font-weight:400;}", e += ".addeventatc_dropdown .frs a \t\t\t{background:#fff;color:#cacaca!important;cursor:pointer;font-size:9px!important;font-style:normal!important;font-weight:400!important;line-height:110%!important;padding-left:10px;position:absolute;right:10px;text-align:right;text-decoration:none;top:5px;z-index:101;}", e += ".addeventatc_dropdown .frs a:hover \t\t{color:#999!important;}", e += ".addeventatc_dropdown .ateappleical \t{background:url(https://www.addevent.com/gfx/icon-apple-t5.svg) 18px 40% no-repeat;background-size:22px 100%;}", e += ".addeventatc_dropdown .ategoogle \t\t{background:url(https://www.addevent.com/gfx/icon-google-t5.svg) 18px 50% no-repeat;background-size:22px 100%;}", e += ".addeventatc_dropdown .ateoutlook \t\t{background:url(https://www.addevent.com/gfx/icon-outlook-t5.svg) 18px 50% no-repeat;background-size:22px 100%;}", e += ".addeventatc_dropdown .ateoutlookcom \t{background:url(https://www.addevent.com/gfx/icon-outlookcom-t5.svg) 18px 50% no-repeat;background-size:22px 100%;}", e += ".addeventatc_dropdown .ateyahoo \t\t{background:url(https://www.addevent.com/gfx/icon-yahoo-t5.svg) 18px 50% no-repeat;background-size:22px 100%;}", e += ".addeventatc_dropdown .atefacebook \t\t{background:url(https://www.addevent.com/gfx/icon-facebook-t5.svg) 18px 50% no-repeat;background-size:22px 100%;}", e += ".addeventatc_dropdown .copyx \t\t\t{height:21px;display:block;position:relative;cursor:default;}", e += ".addeventatc_dropdown .brx \t\t\t\t{height:1px;overflow:hidden;background:#e8e8e8;position:absolute;z-index:100;left:10px;right:10px;top:9px;}", e += ".addeventatc_dropdown.addeventatc-selected {opacity:1;transform:scale(1,1) translateY(0px);z-index:99999999;}", e += ".addeventatc_dropdown.topdown.addeventatc-selected {transform:scale(1,1) translateY(0px)!important;}", e += ".addeventatc_dropdown .drop_markup {background-color:#f4f4f4;}";
                var t = document.createElement("style");
                t.type = "text/css", t.id = "ate_css", t.styleSheet ? t.styleSheet.cssText = e : t.appendChild(document.createTextNode(e)), document.getElementsByTagName("head")[0].appendChild(t), addeventatc.removeelement($d("ate_tmp_css"))
            }
        }, helpercss: function () {
            if (!$d("ate_helper_css")) {
                var e = "";
                e += ".addeventatc_dropdown .drop_markup {background-color:#f4f4f4;}", e += ".addeventatc_dropdown .frs a {margin:0!important;padding:0!important;font-style:normal!important;font-weight:normal!important;line-height:110%!important;background-color:#fff!important;text-decoration:none;font-size:9px!important;color:#cacaca!important;display:inline-block;}", e += ".addeventatc_dropdown .frs a:hover {color:#999!important;}", e += ".addeventatc .start, .addeventatc .end, .addeventatc .timezone, .addeventatc .title, .addeventatc .description, .addeventatc .location, .addeventatc .organizer, .addeventatc .organizer_email, .addeventatc .facebook_event, .addeventatc .all_day_event, .addeventatc .date_format, .addeventatc .alarm_reminder, .addeventatc .recurring, .addeventatc .attendees, .addeventatc .client, .addeventatc .calname, .addeventatc .uid, .addeventatc .status, .addeventatc .method, .addeventatc .transp {display:none!important;}";
                var t = document.createElement("style");
                t.type = "text/css", t.id = "ate_helper_css", t.styleSheet ? t.styleSheet.cssText = e : t.appendChild(document.createTextNode(e)), document.getElementsByTagName("head")[0].appendChild(t)
            }
        }, removeelement: function (e) {
            try {
                return !!(hdx = e) && hdx.parentNode.removeChild(hdx)
            } catch (e) {
            }
        }, topzindex: function () {
            for (var e = 1, t = document.getElementsByTagName("*"), a = 0; a < t.length; a += 1) if (addeventatc.hasclass(t[a], "addeventatc") || addeventatc.hasclass(t[a], "addeventstc")) {
                var n = addeventatc.getstyle(t[a], "z-index");
                !isNaN(parseFloat(n)) && isFinite(n) && e < (n = parseInt(n)) && (e = n)
            }
            return e
        }, viewport: function () {
            var e = 0, t = 0, a = 0, n = 0;
            return "number" == typeof window.innerWidth ? (e = window.innerWidth, t = window.innerHeight) : document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight) ? (e = document.documentElement.clientWidth, t = document.documentElement.clientHeight) : document.body && (document.body.clientWidth || document.body.clientHeight) && (e = document.body.clientWidth, t = document.body.clientHeight), document.all ? (n = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft, a = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) : (n = window.pageXOffset, a = window.pageYOffset), {
                w: e,
                h: t,
                x: n,
                y: a
            }
        }, elementposition: function (e) {
            var t = 0, a = 0;
            if (e.offsetParent) for (t = e.offsetLeft, a = e.offsetTop; e = e.offsetParent;) t += e.offsetLeft, a += e.offsetTop;
            return {x: t, y: a}
        }, getstyle: function (e, t) {
            var a, n = e;
            return n.currentStyle ? a = n.currentStyle[t] : window.getComputedStyle && (a = document.defaultView.getComputedStyle(n, null).getPropertyValue(t)), a
        }, getlicense: function (e) {
            var t = location.origin, a = !1;
            if (void 0 === location.origin && (t = location.protocol + "//" + location.host), e) {
                var n = e.substring(0, 1), o = e.substring(9, 10), d = e.substring(17, 18);
                "a" == n && "z" == o && "m" == d && (a = !0)
            }
            return (-1 == t.indexOf("addevent.com") && "aao8iuet5zp9iqw5sm9z" == e || -1 == t.indexOf("addevent.to") && "aao8iuet5zp9iqw5sm9z" == e || -1 == t.indexOf("addevent.com") && "aao8iuet5zp9iqw5sm9z" == e) && (a = !0), a
        }, refresh: function () {
            for (var e = document.getElementsByTagName("*"), t = [], a = 0; a < e.length; a += 1) if (addeventatc.hasclass(e[a], "addeventatc")) {
                e[a].className = e[a].className.replace(/addeventatc-selected/gi, ""), e[a].id = "";
                for (var n = e[a].getElementsByTagName("*"), o = 0; o < n.length; o += 1) (addeventatc.hasclass(n[o], "addeventatc_icon") || addeventatc.hasclass(n[o], "addeventatc_dropdown")) && t.push(n[o])
            }
            for (var d = 0; d < t.length; d += 1) addeventatc.removeelement(t[d]);
            addeventatc.removeelement($d("ate_css")), g = !(s = 1), addeventatc.generate()
        }, hasclass: function (e, t) {
            return new RegExp("(\\s|^)" + t + "(\\s|$)").test(e.className)
        }, eclick: function (e) {
            var t = document.getElementById(e);
            if (t.click) t.click(); else if (document.createEvent) {
                var a = document.createEvent("MouseEvents");
                a.initEvent("click", !0, !0), t.dispatchEvent(a)
            }
        }, track: function (e) {
            new Image, (new Date).getTime(), encodeURIComponent(window.location.origin)
        }, getguid: function () {
            for (var e = "addevent_track_cookie=", t = "", a = document.cookie.split(";"), n = 0; n < a.length; n++) {
                for (var o = a[n]; " " == o.charAt(0);) o = o.substring(1, o.length);
                0 == o.indexOf(e) && (t = o.substring(e.length, o.length))
            }
            if ("" == t) {
                var d = (addeventatc.s4() + addeventatc.s4() + "-" + addeventatc.s4() + "-4" + addeventatc.s4().substr(0, 3) + "-" + addeventatc.s4() + "-" + addeventatc.s4() + addeventatc.s4() + addeventatc.s4()).toLowerCase(),
                    c = new Date;
                c.setTime(c.getTime() + 31536e6);
                var i = "expires=" + c.toUTCString();
                document.cookie = "addevent_track_cookie=" + d + "; " + i, t = d
            }
            return t
        }, s4: function () {
            return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
        }, documentclick: function (e) {
            e = (e = e || window.event).target || e.srcElement, ate_touch_capable ? (clearTimeout(t), t = setTimeout(function () {
                addeventatc.hide(e.className)
            }, 200)) : addeventatc.hide(e.className)
        }, trigger: function (e, t) {
            if ("button_click" == e) try {
                $(t)
            } catch (e) {
            }
            if ("button_mouseover" == e) try {
                S(t)
            } catch (e) {
            }
            if ("button_mouseout" == e) try {
                a(t)
            } catch (e) {
            }
            if ("button_dropdown_show" == e) try {
                L(t)
            } catch (e) {
            }
            if ("button_dropdown_hide" == e) try {
                H(t)
            } catch (e) {
            }
            if ("button_dropdown_click" == e) try {
                R(t)
            } catch (e) {
            }
        }, register: function (e, t) {
            "button-click" == e && ($ = t), "button-mouseover" == e && (S = t), "button-mouseout" == e && (a = t), "button-dropdown-show" == e && (L = t), "button-dropdown-hide" == e && (H = t), "button-dropdown-click" == e && (R = t)
        }, settings: function (e) {
            null != e.license && (u = e.license), null != e.css && (e.css ? p = !0 : (p = !1, addeventatc.removeelement($d("ate_css")))), null != e.mouse && (r = e.mouse), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (r = !1), null != e.outlook && null != e.outlook.show && (b = e.outlook.show), null != e.google && null != e.google.show && (x = e.google.show), null != e.yahoo && null != e.yahoo.show && (y = e.yahoo.show), null != e.hotmail && null != e.hotmail.show && (k = e.hotmail.show), null != e.outlookcom && null != e.outlookcom.show && (k = e.outlookcom.show), null != e.ical && null != e.ical.show && (w = e.ical.show), null != e.appleical && null != e.appleical.show && (w = e.appleical.show), null != e.facebook && null != e.facebook.show && (_ = e.facebook.show), null != e.outlook && null != e.outlook.text && (z = e.outlook.text), null != e.google && null != e.google.text && (N = e.google.text), null != e.yahoo && null != e.yahoo.text && (I = e.yahoo.text), null != e.hotmail && null != e.hotmail.text && (C = e.hotmail.text), null != e.outlookcom && null != e.outlookcom.text && (C = e.outlookcom.text), null != e.ical && null != e.ical.text && (T = e.ical.text), null != e.appleical && null != e.appleical.text && (T = e.appleical.text), null != e.facebook && null != e.facebook.text && (A = e.facebook.text), null != e.dropdown && null != e.dropdown.order && (f = e.dropdown.order)
        }, keyboard: function (e, t) {
            var a = document.getElementById(t.id + "-drop");
            if (a && "block" == addeventatc.getstyle(a, "display")) {
                for (var n = a.getElementsByTagName("SPAN"), o = null, d = 0, c = 0, i = 0; i < n.length; i += 1) d++, addeventatc.hasclass(n[i], "drop_markup") && (o = n[i], c = d);
                null === o ? c = 1 : "down" == t.key ? d <= c ? c = 1 : c++ : 1 == c ? c = d : c--;
                for (i = d = 0; i < n.length; i += 1) if (++d == c) n[i].className += " drop_markup"; else {
                    var l = new RegExp("(\\s|^)drop_markup(\\s|$)");
                    n[i].className = n[i].className.replace(l, " "), n[i].className = n[i].className.replace(/\s+$/, "")
                }
            }
        }, keyboardclick: function (e, t) {
            var a = document.getElementById(t.id + "-drop");
            if (a) {
                for (var n = a.getElementsByTagName("SPAN"), o = null, d = 0; d < n.length; d += 1) addeventatc.hasclass(n[d], "drop_markup") && (o = n[d]);
                if (null !== o) {
                    o.click();
                    for (d = 0; d < n.length; d += 1) {
                        var c = new RegExp("(\\s|^)drop_markup(\\s|$)");
                        n[d].className = n[d].className.replace(c, " "), n[d].className = n[d].className.replace(/\s+$/, "")
                    }
                }
            }
        }, usewebcal: function () {
            var e = !1, t = !1, a = window.navigator.userAgent.toLowerCase();
            navigator.userAgent.match(/CriOS|FxiOS|OPiOS|mercury|gsa/i) && (t = !0);
            var n = /iphone|ipod|ipad/.test(a),
                o = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
            return (n && o || n && t) && (e = !0), e
        }, agent: function () {
            var e = navigator.userAgent || navigator.vendor || window.opera;
            return /windows phone/i.test(e) ? "windows_phone" : /android/i.test(e) ? "android" : /iPad|iPhone|iPod/.test(e) && !window.MSStream ? "ios" : "unknown"
        }
    }
}();
!function (e, t) {
    "use strict";
    e = e || "docReady", t = t || window;
    var a = [], n = !1, o = !1;

    function d() {
        if (!n) {
            n = !0;
            for (var e = 0; e < a.length; e++) a[e].fn.call(window, a[e].ctx);
            a = []
        }
    }

    function c() {
        "complete" === document.readyState && d()
    }

    t[e] = function (e, t) {
        if ("function" != typeof e) throw new TypeError("callback for docReady(fn) must be a function");
        n ? setTimeout(function () {
            e(t)
        }, 1) : (a.push({
            fn: e,
            ctx: t
        }), "complete" === document.readyState || !document.attachEvent && "interactive" === document.readyState ? setTimeout(d, 1) : o || (document.addEventListener ? (document.addEventListener("DOMContentLoaded", d, !1), window.addEventListener("load", d, !1)) : (document.attachEvent("onreadystatechange", c), window.attachEvent("onload", d)), o = !0))
    }
}("addeventReady", window);
var ate_touch_capable = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch || 0 < navigator.maxTouchPoints || 0 < window.navigator.msMaxTouchPoints;
window.addEventListener ? (document.addEventListener("click", addeventatc.documentclick, !1), ate_touch_capable && document.addEventListener("touchend", addeventatc.documentclick, !1)) : window.attachEvent ? (document.attachEvent("onclick", addeventatc.documentclick), ate_touch_capable && document.attachEvent("ontouchend", addeventatc.documentclick)) : document.onclick = function () {
    addeventatc.documentclick(event)
}, addeventReady(function () {
    addeventatc.initialize(), setTimeout("addeventatc.initialize();", 200)
});

window.addeventasync = function () {
    addeventatc.settings({
        mouse:true,
        css: false
    });
};