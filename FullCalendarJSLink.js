"use strict";

var StarcrossedCalendar = StarcrossedCalendar || {};

StarcrossedCalendar.OnPreRender = function (ctx) {
    StarcrossedCalendar.Context = ctx;
    StarcrossedCalendar.appWebUrl = _spPageContextInfo.webServerRelativeUrl;
    SP.SOD.registerSod("jQuery", StarcrossedCalendar.appWebUrl + "/fullcalendar-2.2.3/lib/jquery.min.js");
    LoadSodByKeySync("jQuery");
    SP.SOD.registerSod("moment", StarcrossedCalendar.appWebUrl + "/fullcalendar-2.2.3/lib/moment.min.js");
    LoadSodByKeySync("moment");
    SP.SOD.registerSod("fullCalendar", StarcrossedCalendar.appWebUrl + "/fullcalendar-2.2.3/fullcalendar.js");
    LoadSodByKeySync("fullCalendar");
    $("head").append("<link rel='stylesheet' type='text/css' href='" + StarcrossedCalendar.appWebUrl + "/fullcalendar-2.2.3/fullcalendar.min.css' />");
};

StarcrossedCalendar.OnPostRender = function (ctx) {
    StarcrossedCalendar.Context = ctx;
    $(document).ready(function () {
        $('#calendar').fullCalendar({
            events: StarcrossedCalendar.Events
        });
    });
};

StarcrossedCalendar.Header = function (ctx) {
    StarcrossedCalendar.Context = ctx;
    return "";
};

StarcrossedCalendar.Item = function (ctx) {
    StarcrossedCalendar.Context = ctx;
    return "";
};

StarcrossedCalendar.Footer = function (ctx) {
    StarcrossedCalendar.Context = ctx;
    return "<div id='calendar'></div>";
};

StarcrossedCalendar.Events = function (start, end, timezone, callback) {
    var ctx = StarcrossedCalendar.Context;
    $.ajax({
        url: StarcrossedCalendar.appWebUrl + "/_api/web/lists/getbytitle('Calendar')/items?$filter=StartDate ge datetime'" + start.toJSON() + "' and EndDate le datetime'" + end.toJSON() + "'",
        headers: {
            accept: "application/json;odata=verbose"
        }
    }).done(function (bcsEvents) {
        var events = [];
        for (var i = 0; i < bcsEvents.d.results.length; i++) {
            events.push({
                title: bcsEvents.d.results[i].CourseName,
                start: bcsEvents.d.results[i].StartDate,
                end: bcsEvents.d.results[i].EndDate,
                url: StarcrossedCalendar.appWebUrl + "/_layouts/15/listform.aspx?PageType=4&ListId=" + ctx.listName + "&ID=" + bcsEvents.d.results[i].BdcIdentity + "&ContentTypeId=0x0"
            })
        }
        callback(events);
    }).fail(StarcrossedCalendar.onError);
};

(function () {
    StarcrossedCalendar.Overrides = {};
    StarcrossedCalendar.Overrides.Templates = {};
    StarcrossedCalendar.Overrides.Templates.OnPreRender = StarcrossedCalendar.OnPreRender;
    StarcrossedCalendar.Overrides.Templates.OnPostRender = StarcrossedCalendar.OnPostRender;
    StarcrossedCalendar.Overrides.Templates.Header = StarcrossedCalendar.Header;
    StarcrossedCalendar.Overrides.Templates.Item = StarcrossedCalendar.Item;
    StarcrossedCalendar.Overrides.Templates.Footer = StarcrossedCalendar.Footer;
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(StarcrossedCalendar.Overrides);
})();