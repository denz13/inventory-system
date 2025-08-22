<html lang="en" class="light"><!-- BEGIN: Head --><head><style>:root{--litepicker-container-months-color-bg: #fff;--litepicker-container-months-box-shadow-color: #ddd;--litepicker-footer-color-bg: #fafafa;--litepicker-footer-box-shadow-color: #ddd;--litepicker-tooltip-color-bg: #fff;--litepicker-month-header-color: #333;--litepicker-button-prev-month-color: #9e9e9e;--litepicker-button-next-month-color: #9e9e9e;--litepicker-button-prev-month-color-hover: #2196f3;--litepicker-button-next-month-color-hover: #2196f3;--litepicker-month-width: calc(var(--litepicker-day-width) * 7);--litepicker-month-weekday-color: #9e9e9e;--litepicker-month-week-number-color: #9e9e9e;--litepicker-day-width: 38px;--litepicker-day-color: #333;--litepicker-day-color-hover: #2196f3;--litepicker-is-today-color: #f44336;--litepicker-is-in-range-color: #bbdefb;--litepicker-is-locked-color: #9e9e9e;--litepicker-is-start-color: #fff;--litepicker-is-start-color-bg: #2196f3;--litepicker-is-end-color: #fff;--litepicker-is-end-color-bg: #2196f3;--litepicker-button-cancel-color: #fff;--litepicker-button-cancel-color-bg: #9e9e9e;--litepicker-button-apply-color: #fff;--litepicker-button-apply-color-bg: #2196f3;--litepicker-button-reset-color: #909090;--litepicker-button-reset-color-hover: #2196f3;--litepicker-highlighted-day-color: #333;--litepicker-highlighted-day-color-bg: #ffeb3b}.show-week-numbers{--litepicker-month-width: calc(var(--litepicker-day-width) * 8)}.litepicker{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;font-size:0.8em;display:none}.litepicker button{border:none;background:none}.litepicker .container__main{display:-webkit-box;display:-ms-flexbox;display:flex}.litepicker .container__months{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;background-color:var(--litepicker-container-months-color-bg);border-radius:5px;-webkit-box-shadow:0 0 5px var(--litepicker-container-months-box-shadow-color);box-shadow:0 0 5px var(--litepicker-container-months-box-shadow-color);width:calc(var(--litepicker-month-width) + 10px);-webkit-box-sizing:content-box;box-sizing:content-box}.litepicker .container__months.columns-2{width:calc((var(--litepicker-month-width) * 2) + 20px)}.litepicker .container__months.columns-3{width:calc((var(--litepicker-month-width) * 3) + 30px)}.litepicker .container__months.columns-4{width:calc((var(--litepicker-month-width) * 4) + 40px)}.litepicker .container__months.split-view .month-item-header .button-previous-month,.litepicker .container__months.split-view .month-item-header .button-next-month{visibility:visible}.litepicker .container__months .month-item{padding:5px;width:var(--litepicker-month-width);-webkit-box-sizing:content-box;box-sizing:content-box}.litepicker .container__months .month-item-header{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;font-weight:500;padding:10px 5px;text-align:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:var(--litepicker-month-header-color)}.litepicker .container__months .month-item-header div{-webkit-box-flex:1;-ms-flex:1;flex:1}.litepicker .container__months .month-item-header div>.month-item-name{margin-right:5px}.litepicker .container__months .month-item-header div>.month-item-year{padding:0}.litepicker .container__months .month-item-header .reset-button{color:var(--litepicker-button-reset-color)}.litepicker .container__months .month-item-header .reset-button>svg{fill:var(--litepicker-button-reset-color)}.litepicker .container__months .month-item-header .reset-button *{pointer-events:none}.litepicker .container__months .month-item-header .reset-button:hover{color:var(--litepicker-button-reset-color-hover)}.litepicker .container__months .month-item-header .reset-button:hover>svg{fill:var(--litepicker-button-reset-color-hover)}.litepicker .container__months .month-item-header .button-previous-month,.litepicker .container__months .month-item-header .button-next-month{visibility:hidden;text-decoration:none;padding:3px 5px;border-radius:3px;-webkit-transition:color 0.3s, border 0.3s;transition:color 0.3s, border 0.3s;cursor:default}.litepicker .container__months .month-item-header .button-previous-month *,.litepicker .container__months .month-item-header .button-next-month *{pointer-events:none}.litepicker .container__months .month-item-header .button-previous-month{color:var(--litepicker-button-prev-month-color)}.litepicker .container__months .month-item-header .button-previous-month>svg,.litepicker .container__months .month-item-header .button-previous-month>img{fill:var(--litepicker-button-prev-month-color)}.litepicker .container__months .month-item-header .button-previous-month:hover{color:var(--litepicker-button-prev-month-color-hover)}.litepicker .container__months .month-item-header .button-previous-month:hover>svg{fill:var(--litepicker-button-prev-month-color-hover)}.litepicker .container__months .month-item-header .button-next-month{color:var(--litepicker-button-next-month-color)}.litepicker .container__months .month-item-header .button-next-month>svg,.litepicker .container__months .month-item-header .button-next-month>img{fill:var(--litepicker-button-next-month-color)}.litepicker .container__months .month-item-header .button-next-month:hover{color:var(--litepicker-button-next-month-color-hover)}.litepicker .container__months .month-item-header .button-next-month:hover>svg{fill:var(--litepicker-button-next-month-color-hover)}.litepicker .container__months .month-item-weekdays-row{display:-webkit-box;display:-ms-flexbox;display:flex;justify-self:center;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;color:var(--litepicker-month-weekday-color)}.litepicker .container__months .month-item-weekdays-row>div{padding:5px 0;font-size:85%;-webkit-box-flex:1;-ms-flex:1;flex:1;width:var(--litepicker-day-width);text-align:center}.litepicker .container__months .month-item:first-child .button-previous-month{visibility:visible}.litepicker .container__months .month-item:last-child .button-next-month{visibility:visible}.litepicker .container__months .month-item.no-previous-month .button-previous-month{visibility:hidden}.litepicker .container__months .month-item.no-next-month .button-next-month{visibility:hidden}.litepicker .container__days{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;justify-self:center;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;text-align:center;-webkit-box-sizing:content-box;box-sizing:content-box}.litepicker .container__days>div,.litepicker .container__days>a{padding:5px 0;width:var(--litepicker-day-width)}.litepicker .container__days .day-item{color:var(--litepicker-day-color);text-align:center;text-decoration:none;border-radius:3px;-webkit-transition:color 0.3s, border 0.3s;transition:color 0.3s, border 0.3s;cursor:default}.litepicker .container__days .day-item:hover{color:var(--litepicker-day-color-hover);-webkit-box-shadow:inset 0 0 0 1px var(--litepicker-day-color-hover);box-shadow:inset 0 0 0 1px var(--litepicker-day-color-hover)}.litepicker .container__days .day-item.is-today{color:var(--litepicker-is-today-color)}.litepicker .container__days .day-item.is-locked{color:var(--litepicker-is-locked-color)}.litepicker .container__days .day-item.is-locked:hover{color:var(--litepicker-is-locked-color);-webkit-box-shadow:none;box-shadow:none;cursor:default}.litepicker .container__days .day-item.is-in-range{background-color:var(--litepicker-is-in-range-color);border-radius:0}.litepicker .container__days .day-item.is-start-date{color:var(--litepicker-is-start-color);background-color:var(--litepicker-is-start-color-bg);border-top-left-radius:5px;border-bottom-left-radius:5px;border-top-right-radius:0;border-bottom-right-radius:0}.litepicker .container__days .day-item.is-start-date.is-flipped{border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:5px;border-bottom-right-radius:5px}.litepicker .container__days .day-item.is-end-date{color:var(--litepicker-is-end-color);background-color:var(--litepicker-is-end-color-bg);border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:5px;border-bottom-right-radius:5px}.litepicker .container__days .day-item.is-end-date.is-flipped{border-top-left-radius:5px;border-bottom-left-radius:5px;border-top-right-radius:0;border-bottom-right-radius:0}.litepicker .container__days .day-item.is-start-date.is-end-date{border-top-left-radius:5px;border-bottom-left-radius:5px;border-top-right-radius:5px;border-bottom-right-radius:5px}.litepicker .container__days .day-item.is-highlighted{color:var(--litepicker-highlighted-day-color);background-color:var(--litepicker-highlighted-day-color-bg)}.litepicker .container__days .week-number{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;color:var(--litepicker-month-week-number-color);font-size:85%}.litepicker .container__footer{text-align:right;padding:10px 5px;margin:0 5px;background-color:var(--litepicker-footer-color-bg);-webkit-box-shadow:inset 0px 3px 3px 0px var(--litepicker-footer-box-shadow-color);box-shadow:inset 0px 3px 3px 0px var(--litepicker-footer-box-shadow-color);border-bottom-left-radius:5px;border-bottom-right-radius:5px}.litepicker .container__footer .preview-date-range{margin-right:10px;font-size:90%}.litepicker .container__footer .button-cancel{background-color:var(--litepicker-button-cancel-color-bg);color:var(--litepicker-button-cancel-color);border:0;padding:3px 7px 4px;border-radius:3px}.litepicker .container__footer .button-cancel *{pointer-events:none}.litepicker .container__footer .button-apply{background-color:var(--litepicker-button-apply-color-bg);color:var(--litepicker-button-apply-color);border:0;padding:3px 7px 4px;border-radius:3px;margin-left:10px;margin-right:10px}.litepicker .container__footer .button-apply:disabled{opacity:0.7}.litepicker .container__footer .button-apply *{pointer-events:none}.litepicker .container__tooltip{position:absolute;margin-top:-4px;padding:4px 8px;border-radius:4px;background-color:var(--litepicker-tooltip-color-bg);-webkit-box-shadow:0 1px 3px rgba(0,0,0,0.25);box-shadow:0 1px 3px rgba(0,0,0,0.25);white-space:nowrap;font-size:11px;pointer-events:none;visibility:hidden}.litepicker .container__tooltip:before{position:absolute;bottom:-5px;left:calc(50% - 5px);border-top:5px solid rgba(0,0,0,0.12);border-right:5px solid transparent;border-left:5px solid transparent;content:""}.litepicker .container__tooltip:after{position:absolute;bottom:-4px;left:calc(50% - 4px);border-top:4px solid var(--litepicker-tooltip-color-bg);border-right:4px solid transparent;border-left:4px solid transparent;content:""}
</style>
        <meta charset="utf-8">
        <link href="dist/images/logo.svg" rel="shortcut icon">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Midone admin is super flexible, powerful, clean &amp; modern responsive tailwind admin template with unlimited possibilities.">
        <meta name="keywords" content="admin template, Midone Admin Template, dashboard template, flat admin template, responsive admin template, web app">
        <meta name="author" content="LEFT4CODE">
        <title>Register - Midone - Tailwind HTML Admin Template</title>
        <!-- BEGIN: CSS Assets-->
        <link rel="stylesheet" href="dist/css/app.css">
        <!-- END: CSS Assets-->
    <style>
/* classes attached to <body> */
/* TODO: make fc-event selector work when calender in shadow DOM */
.fc-not-allowed,
.fc-not-allowed .fc-event { /* override events' custom cursors */
  cursor: not-allowed;
}
/* TODO: not attached to body. attached to specific els. move */
.fc-unselectable {
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.fc {
  /* layout of immediate children */
  display: flex;
  flex-direction: column;

  font-size: 1em
}
.fc,
  .fc *,
  .fc *:before,
  .fc *:after {
    box-sizing: border-box;
  }
.fc table {
    border-collapse: collapse;
    border-spacing: 0;
    font-size: 1em; /* normalize cross-browser */
  }
.fc th {
    text-align: center;
  }
.fc th,
  .fc td {
    vertical-align: top;
    padding: 0;
  }
.fc a[data-navlink] {
    cursor: pointer;
  }
.fc a[data-navlink]:hover {
    text-decoration: underline;
  }
.fc-direction-ltr {
  direction: ltr;
  text-align: left;
}
.fc-direction-rtl {
  direction: rtl;
  text-align: right;
}
.fc-theme-standard td,
  .fc-theme-standard th {
    border: 1px solid #ddd;
    border: 1px solid var(--fc-border-color, #ddd);
  }
/* for FF, which doesn't expand a 100% div within a table cell. use absolute positioning */
/* inner-wrappers are responsible for being absolute */
/* TODO: best place for this? */
.fc-liquid-hack td,
  .fc-liquid-hack th {
    position: relative;
  }
@font-face {
  font-family: 'fcicons';
  src: url("data:application/x-font-ttf;charset=utf-8;base64,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") format('truetype');
  font-weight: normal;
  font-style: normal;
}
.fc-icon {
  /* added for fc */
  display: inline-block;
  width: 1em;
  height: 1em;
  text-align: center;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;

  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'fcicons' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.fc-icon-chevron-left:before {
  content: "\e900";
}
.fc-icon-chevron-right:before {
  content: "\e901";
}
.fc-icon-chevrons-left:before {
  content: "\e902";
}
.fc-icon-chevrons-right:before {
  content: "\e903";
}
.fc-icon-minus-square:before {
  content: "\e904";
}
.fc-icon-plus-square:before {
  content: "\e905";
}
.fc-icon-x:before {
  content: "\e906";
}
/*
Lots taken from Flatly (MIT): https://bootswatch.com/4/flatly/bootstrap.css

These styles only apply when the standard-theme is activated.
When it's NOT activated, the fc-button classes won't even be in the DOM.
*/
.fc {

  /* reset */

}
.fc .fc-button {
    border-radius: 0;
    overflow: visible;
    text-transform: none;
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }
.fc .fc-button:focus {
    outline: 1px dotted;
    outline: 5px auto -webkit-focus-ring-color;
  }
.fc .fc-button {
    -webkit-appearance: button;
  }
.fc .fc-button:not(:disabled) {
    cursor: pointer;
  }
.fc .fc-button::-moz-focus-inner {
    padding: 0;
    border-style: none;
  }
.fc {

  /* theme */

}
.fc .fc-button {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    padding: 0.4em 0.65em;
    font-size: 1em;
    line-height: 1.5;
    border-radius: 0.25em;
  }
.fc .fc-button:hover {
    text-decoration: none;
  }
.fc .fc-button:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(44, 62, 80, 0.25);
  }
.fc .fc-button:disabled {
    opacity: 0.65;
  }
.fc {

  /* "primary" coloring */

}
.fc .fc-button-primary {
    color: #fff;
    color: var(--fc-button-text-color, #fff);
    background-color: #2C3E50;
    background-color: var(--fc-button-bg-color, #2C3E50);
    border-color: #2C3E50;
    border-color: var(--fc-button-border-color, #2C3E50);
  }
.fc .fc-button-primary:hover {
    color: #fff;
    color: var(--fc-button-text-color, #fff);
    background-color: #1e2b37;
    background-color: var(--fc-button-hover-bg-color, #1e2b37);
    border-color: #1a252f;
    border-color: var(--fc-button-hover-border-color, #1a252f);
  }
.fc .fc-button-primary:disabled { /* not DRY */
    color: #fff;
    color: var(--fc-button-text-color, #fff);
    background-color: #2C3E50;
    background-color: var(--fc-button-bg-color, #2C3E50);
    border-color: #2C3E50;
    border-color: var(--fc-button-border-color, #2C3E50); /* overrides :hover */
  }
.fc .fc-button-primary:focus {
    box-shadow: 0 0 0 0.2rem rgba(76, 91, 106, 0.5);
  }
.fc .fc-button-primary:not(:disabled):active,
  .fc .fc-button-primary:not(:disabled).fc-button-active {
    color: #fff;
    color: var(--fc-button-text-color, #fff);
    background-color: #1a252f;
    background-color: var(--fc-button-active-bg-color, #1a252f);
    border-color: #151e27;
    border-color: var(--fc-button-active-border-color, #151e27);
  }
.fc .fc-button-primary:not(:disabled):active:focus,
  .fc .fc-button-primary:not(:disabled).fc-button-active:focus {
    box-shadow: 0 0 0 0.2rem rgba(76, 91, 106, 0.5);
  }
.fc {

  /* icons within buttons */

}
.fc .fc-button .fc-icon {
    vertical-align: middle;
    font-size: 1.5em; /* bump up the size (but don't make it bigger than line-height of button, which is 1.5em also) */
  }
.fc .fc-button-group {
    position: relative;
    display: inline-flex;
    vertical-align: middle;
  }
.fc .fc-button-group > .fc-button {
    position: relative;
    flex: 1 1 auto;
  }
.fc .fc-button-group > .fc-button:hover {
    z-index: 1;
  }
.fc .fc-button-group > .fc-button:focus,
  .fc .fc-button-group > .fc-button:active,
  .fc .fc-button-group > .fc-button.fc-button-active {
    z-index: 1;
  }
.fc-direction-ltr .fc-button-group > .fc-button:not(:first-child) {
    margin-left: -1px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
.fc-direction-ltr .fc-button-group > .fc-button:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
.fc-direction-rtl .fc-button-group > .fc-button:not(:first-child) {
    margin-right: -1px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
.fc-direction-rtl .fc-button-group > .fc-button:not(:last-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
.fc .fc-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
.fc .fc-toolbar.fc-header-toolbar {
    margin-bottom: 1.5em;
  }
.fc .fc-toolbar.fc-footer-toolbar {
    margin-top: 1.5em;
  }
.fc .fc-toolbar-title {
    font-size: 1.75em;
    margin: 0;
  }
.fc-direction-ltr .fc-toolbar > * > :not(:first-child) {
    margin-left: .75em; /* space between */
  }
.fc-direction-rtl .fc-toolbar > * > :not(:first-child) {
    margin-right: .75em; /* space between */
  }
.fc-direction-rtl .fc-toolbar-ltr { /* when the toolbar-chunk positioning system is explicitly left-to-right */
    flex-direction: row-reverse;
  }
.fc .fc-scroller {
    -webkit-overflow-scrolling: touch;
    position: relative; /* for abs-positioned elements within */
  }
.fc .fc-scroller-liquid {
    height: 100%;
  }
.fc .fc-scroller-liquid-absolute {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
.fc .fc-scroller-harness {
    position: relative;
    overflow: hidden;
    direction: ltr;
      /* hack for chrome computing the scroller's right/left wrong for rtl. undone below... */
      /* TODO: demonstrate in codepen */
  }
.fc .fc-scroller-harness-liquid {
    height: 100%;
  }
.fc-direction-rtl .fc-scroller-harness > .fc-scroller { /* undo above hack */
    direction: rtl;
  }
.fc-theme-standard .fc-scrollgrid {
    border: 1px solid #ddd;
    border: 1px solid var(--fc-border-color, #ddd); /* bootstrap does this. match */
  }
.fc .fc-scrollgrid,
    .fc .fc-scrollgrid table { /* all tables (self included) */
      width: 100%; /* because tables don't normally do this */
      table-layout: fixed;
    }
.fc .fc-scrollgrid table { /* inner tables */
      border-top-style: hidden;
      border-left-style: hidden;
      border-right-style: hidden;
    }
.fc .fc-scrollgrid {

    border-collapse: separate;
    border-right-width: 0;
    border-bottom-width: 0;

  }
.fc .fc-scrollgrid-liquid {
    height: 100%;
  }
.fc .fc-scrollgrid-section { /* a <tr> */
    height: 1px /* better than 0, for firefox */

  }
.fc .fc-scrollgrid-section > td {
      height: 1px; /* needs a height so inner div within grow. better than 0, for firefox */
    }
.fc .fc-scrollgrid-section table {
      height: 1px;
        /* for most browsers, if a height isn't set on the table, can't do liquid-height within cells */
        /* serves as a min-height. harmless */
    }
.fc .fc-scrollgrid-section-liquid > td {
      height: 100%; /* better than `auto`, for firefox */
    }
.fc .fc-scrollgrid-section > * {
    border-top-width: 0;
    border-left-width: 0;
  }
.fc .fc-scrollgrid-section-header > *,
  .fc .fc-scrollgrid-section-footer > * {
    border-bottom-width: 0;
  }
.fc .fc-scrollgrid-section-body table,
  .fc .fc-scrollgrid-section-footer table {
    border-bottom-style: hidden; /* head keeps its bottom border tho */
  }
.fc {

  /* stickiness */

}
.fc .fc-scrollgrid-section-sticky > * {
    background: #fff;
    background: var(--fc-page-bg-color, #fff);
    position: -webkit-sticky;
    position: sticky;
    z-index: 3; /* TODO: var */
    /* TODO: box-shadow when sticking */
  }
.fc .fc-scrollgrid-section-header.fc-scrollgrid-section-sticky > * {
    top: 0; /* because border-sharing causes a gap at the top */
      /* TODO: give safari -1. has bug */
  }
.fc .fc-scrollgrid-section-footer.fc-scrollgrid-section-sticky > * {
    bottom: 0; /* known bug: bottom-stickiness doesn't work in safari */
  }
.fc .fc-scrollgrid-sticky-shim { /* for horizontal scrollbar */
    height: 1px; /* needs height to create scrollbars */
    margin-bottom: -1px;
  }
.fc-sticky { /* no .fc wrap because used as child of body */
  position: -webkit-sticky;
  position: sticky;
}
.fc .fc-view-harness {
    flex-grow: 1; /* because this harness is WITHIN the .fc's flexbox */
    position: relative;
  }
.fc {

  /* when the harness controls the height, make the view liquid */

}
.fc .fc-view-harness-active > .fc-view {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
.fc .fc-col-header-cell-cushion {
    display: inline-block; /* x-browser for when sticky (when multi-tier header) */
    padding: 2px 4px;
  }
.fc .fc-bg-event,
  .fc .fc-non-business,
  .fc .fc-highlight {
    /* will always have a harness with position:relative/absolute, so absolutely expand */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
.fc .fc-non-business {
    background: rgba(215, 215, 215, 0.3);
    background: var(--fc-non-business-color, rgba(215, 215, 215, 0.3));
  }
.fc .fc-bg-event {
    background: rgb(143, 223, 130);
    background: var(--fc-bg-event-color, rgb(143, 223, 130));
    opacity: 0.3;
    opacity: var(--fc-bg-event-opacity, 0.3)
  }
.fc .fc-bg-event .fc-event-title {
      margin: .5em;
      font-size: .85em;
      font-size: var(--fc-small-font-size, .85em);
      font-style: italic;
    }
.fc .fc-highlight {
    background: rgba(188, 232, 241, 0.3);
    background: var(--fc-highlight-color, rgba(188, 232, 241, 0.3));
  }
.fc .fc-cell-shaded,
  .fc .fc-day-disabled {
    background: rgba(208, 208, 208, 0.3);
    background: var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3));
  }
/* link resets */
/* ---------------------------------------------------------------------------------------------------- */
a.fc-event,
a.fc-event:hover {
  text-decoration: none;
}
/* cursor */
.fc-event[href],
.fc-event.fc-event-draggable {
  cursor: pointer;
}
/* event text content */
/* ---------------------------------------------------------------------------------------------------- */
.fc-event .fc-event-main {
    position: relative;
    z-index: 2;
  }
/* dragging */
/* ---------------------------------------------------------------------------------------------------- */
.fc-event-dragging:not(.fc-event-selected) { /* MOUSE */
    opacity: 0.75;
  }
.fc-event-dragging.fc-event-selected { /* TOUCH */
    box-shadow: 0 2px 7px rgba(0, 0, 0, 0.3);
  }
/* resizing */
/* ---------------------------------------------------------------------------------------------------- */
/* (subclasses should hone positioning for touch and non-touch) */
.fc-event .fc-event-resizer {
    display: none;
    position: absolute;
    z-index: 4;
  }
.fc-event:hover, /* MOUSE */
.fc-event-selected { /* TOUCH */

}
.fc-event:hover .fc-event-resizer, .fc-event-selected .fc-event-resizer {
    display: block;
  }
.fc-event-selected .fc-event-resizer {
    border-radius: 4px;
    border-radius: calc(var(--fc-event-resizer-dot-total-width, 8px) / 2);
    border-width: 1px;
    border-width: var(--fc-event-resizer-dot-border-width, 1px);
    width: 8px;
    width: var(--fc-event-resizer-dot-total-width, 8px);
    height: 8px;
    height: var(--fc-event-resizer-dot-total-width, 8px);
    border-style: solid;
    border-color: inherit;
    background: #fff;
    background: var(--fc-page-bg-color, #fff)

    /* expand hit area */

  }
.fc-event-selected .fc-event-resizer:before {
      content: '';
      position: absolute;
      top: -20px;
      left: -20px;
      right: -20px;
      bottom: -20px;
    }
/* selecting (always TOUCH) */
/* OR, focused by tab-index */
/* (TODO: maybe not the best focus-styling for .fc-daygrid-dot-event) */
/* ---------------------------------------------------------------------------------------------------- */
.fc-event-selected,
.fc-event:focus {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2)

  /* expand hit area (subclasses should expand) */

}
.fc-event-selected:before, .fc-event:focus:before {
    content: "";
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
.fc-event-selected,
.fc-event:focus {

  /* dimmer effect */

}
.fc-event-selected:after, .fc-event:focus:after {
    content: "";
    background: rgba(0, 0, 0, 0.25);
    background: var(--fc-event-selected-overlay-color, rgba(0, 0, 0, 0.25));
    position: absolute;
    z-index: 1;

    /* assume there's a border on all sides. overcome it. */
    /* sometimes there's NOT a border, in which case the dimmer will go over */
    /* an adjacent border, which looks fine. */
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
  }
/*
A HORIZONTAL event
*/
.fc-h-event { /* allowed to be top-level */
  display: block;
  border: 1px solid #3788d8;
  border: 1px solid var(--fc-event-border-color, #3788d8);
  background-color: #3788d8;
  background-color: var(--fc-event-bg-color, #3788d8)

}
.fc-h-event .fc-event-main {
    color: #fff;
    color: var(--fc-event-text-color, #fff);
  }
.fc-h-event .fc-event-main-frame {
    display: flex; /* for make fc-event-title-container expand */
  }
.fc-h-event .fc-event-time {
    max-width: 100%; /* clip overflow on this element */
    overflow: hidden;
  }
.fc-h-event .fc-event-title-container { /* serves as a container for the sticky cushion */
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0; /* important for allowing to shrink all the way */
  }
.fc-h-event .fc-event-title {
    display: inline-block; /* need this to be sticky cross-browser */
    vertical-align: top; /* for not messing up line-height */
    left: 0;  /* for sticky */
    right: 0; /* for sticky */
    max-width: 100%; /* clip overflow on this element */
    overflow: hidden;
  }
.fc-h-event.fc-event-selected:before {
    /* expand hit area */
    top: -10px;
    bottom: -10px;
  }
/* adjust border and border-radius (if there is any) for non-start/end */
.fc-direction-ltr .fc-daygrid-block-event:not(.fc-event-start),
.fc-direction-rtl .fc-daygrid-block-event:not(.fc-event-end) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left-width: 0;
}
.fc-direction-ltr .fc-daygrid-block-event:not(.fc-event-end),
.fc-direction-rtl .fc-daygrid-block-event:not(.fc-event-start) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right-width: 0;
}
/* resizers */
.fc-h-event:not(.fc-event-selected) .fc-event-resizer {
  top: 0;
  bottom: 0;
  width: 8px;
  width: var(--fc-event-resizer-thickness, 8px);
}
.fc-direction-ltr .fc-h-event:not(.fc-event-selected) .fc-event-resizer-start,
.fc-direction-rtl .fc-h-event:not(.fc-event-selected) .fc-event-resizer-end {
  cursor: w-resize;
  left: -4px;
  left: calc(-0.5 * var(--fc-event-resizer-thickness, 8px));
}
.fc-direction-ltr .fc-h-event:not(.fc-event-selected) .fc-event-resizer-end,
.fc-direction-rtl .fc-h-event:not(.fc-event-selected) .fc-event-resizer-start {
  cursor: e-resize;
  right: -4px;
  right: calc(-0.5 * var(--fc-event-resizer-thickness, 8px));
}
/* resizers for TOUCH */
.fc-h-event.fc-event-selected .fc-event-resizer {
  top: 50%;
  margin-top: -4px;
  margin-top: calc(-0.5 * var(--fc-event-resizer-dot-total-width, 8px));
}
.fc-direction-ltr .fc-h-event.fc-event-selected .fc-event-resizer-start,
.fc-direction-rtl .fc-h-event.fc-event-selected .fc-event-resizer-end {
  left: -4px;
  left: calc(-0.5 * var(--fc-event-resizer-dot-total-width, 8px));
}
.fc-direction-ltr .fc-h-event.fc-event-selected .fc-event-resizer-end,
.fc-direction-rtl .fc-h-event.fc-event-selected .fc-event-resizer-start {
  right: -4px;
  right: calc(-0.5 * var(--fc-event-resizer-dot-total-width, 8px));
}
.fc .fc-popover {
    position: absolute;
    z-index: 9999;
    box-shadow: 0 2px 6px rgba(0,0,0,.15);
  }
.fc .fc-popover-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 3px 4px;
  }
.fc .fc-popover-title {
    margin: 0 2px;
  }
.fc .fc-popover-close {
    cursor: pointer;
    opacity: 0.65;
    font-size: 1.1em;
  }
.fc-theme-standard .fc-popover {
    border: 1px solid #ddd;
    border: 1px solid var(--fc-border-color, #ddd);
    background: #fff;
    background: var(--fc-page-bg-color, #fff);
  }
.fc-theme-standard .fc-popover-header {
    background: rgba(208, 208, 208, 0.3);
    background: var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3));
  }
</style><style>
:root {
  --fc-daygrid-event-dot-width: 8px;
}
/* help things clear margins of inner content */
.fc-daygrid-day-frame,
.fc-daygrid-day-events,
.fc-daygrid-event-harness { /* for event top/bottom margins */
}
.fc-daygrid-day-frame:before, .fc-daygrid-day-events:before, .fc-daygrid-event-harness:before {
  content: "";
  clear: both;
  display: table; }
.fc-daygrid-day-frame:after, .fc-daygrid-day-events:after, .fc-daygrid-event-harness:after {
  content: "";
  clear: both;
  display: table; }
.fc .fc-daygrid-body { /* a <div> that wraps the table */
    position: relative;
    z-index: 1; /* container inner z-index's because <tr>s can't do it */
  }
.fc .fc-daygrid-day.fc-day-today {
      background-color: rgba(255, 220, 40, 0.15);
      background-color: var(--fc-today-bg-color, rgba(255, 220, 40, 0.15));
    }
.fc .fc-daygrid-day-frame {
    position: relative;
    min-height: 100%; /* seems to work better than `height` because sets height after rows/cells naturally do it */
  }
.fc {

  /* cell top */

}
.fc .fc-daygrid-day-top {
    display: flex;
    flex-direction: row-reverse;
  }
.fc .fc-day-other .fc-daygrid-day-top {
    opacity: 0.3;
  }
.fc {

  /* day number (within cell top) */

}
.fc .fc-daygrid-day-number {
    position: relative;
    z-index: 4;
    padding: 4px;
  }
.fc {

  /* event container */

}
.fc .fc-daygrid-day-events {
    margin-top: 1px; /* needs to be margin, not padding, so that available cell height can be computed */
  }
.fc {

  /* positioning for balanced vs natural */

}
.fc .fc-daygrid-body-balanced .fc-daygrid-day-events {
      position: absolute;
      left: 0;
      right: 0;
    }
.fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events {
      position: relative; /* for containing abs positioned event harnesses */
      min-height: 2em; /* in addition to being a min-height during natural height, equalizes the heights a little bit */
    }
.fc .fc-daygrid-body-natural { /* can coexist with -unbalanced */
  }
.fc .fc-daygrid-body-natural .fc-daygrid-day-events {
      margin-bottom: 1em;
    }
.fc {

  /* event harness */

}
.fc .fc-daygrid-event-harness {
    position: relative;
  }
.fc .fc-daygrid-event-harness-abs {
    position: absolute;
    top: 0; /* fallback coords for when cannot yet be computed */
    left: 0; /* */
    right: 0; /* */
  }
.fc .fc-daygrid-bg-harness {
    position: absolute;
    top: 0;
    bottom: 0;
  }
.fc {

  /* bg content */

}
.fc .fc-daygrid-day-bg .fc-non-business { z-index: 1 }
.fc .fc-daygrid-day-bg .fc-bg-event { z-index: 2 }
.fc .fc-daygrid-day-bg .fc-highlight { z-index: 3 }
.fc {

  /* events */

}
.fc .fc-daygrid-event {
    z-index: 6;
    margin-top: 1px;
  }
.fc .fc-daygrid-event.fc-event-mirror {
    z-index: 7;
  }
.fc {

  /* cell bottom (within day-events) */

}
.fc .fc-daygrid-day-bottom {
    font-size: .85em;
    padding: 2px 3px 0
  }
.fc .fc-daygrid-day-bottom:before {
  content: "";
  clear: both;
  display: table; }
.fc .fc-daygrid-more-link {
    position: relative;
    z-index: 4;
    cursor: pointer;
  }
.fc {

  /* week number (within frame) */

}
.fc .fc-daygrid-week-number {
    position: absolute;
    z-index: 5;
    top: 0;
    padding: 2px;
    min-width: 1.5em;
    text-align: center;
    background-color: rgba(208, 208, 208, 0.3);
    background-color: var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3));
    color: #808080;
    color: var(--fc-neutral-text-color, #808080);
  }
.fc {

  /* popover */

}
.fc .fc-more-popover .fc-popover-body {
    min-width: 220px;
    padding: 10px;
  }
.fc-direction-ltr .fc-daygrid-event.fc-event-start,
.fc-direction-rtl .fc-daygrid-event.fc-event-end {
  margin-left: 2px;
}
.fc-direction-ltr .fc-daygrid-event.fc-event-end,
.fc-direction-rtl .fc-daygrid-event.fc-event-start {
  margin-right: 2px;
}
.fc-direction-ltr .fc-daygrid-week-number {
    left: 0;
    border-radius: 0 0 3px 0;
  }
.fc-direction-rtl .fc-daygrid-week-number {
    right: 0;
    border-radius: 0 0 0 3px;
  }
.fc-liquid-hack .fc-daygrid-day-frame {
    position: static; /* will cause inner absolute stuff to expand to <td> */
  }
.fc-daygrid-event { /* make root-level, because will be dragged-and-dropped outside of a component root */
  position: relative; /* for z-indexes assigned later */
  white-space: nowrap;
  border-radius: 3px; /* dot event needs this to when selected */
  font-size: .85em;
  font-size: var(--fc-small-font-size, .85em);
}
/* --- the rectangle ("block") style of event --- */
.fc-daygrid-block-event .fc-event-time {
    font-weight: bold;
  }
.fc-daygrid-block-event .fc-event-time,
  .fc-daygrid-block-event .fc-event-title {
    padding: 1px;
  }
/* --- the dot style of event --- */
.fc-daygrid-dot-event {
  display: flex;
  align-items: center;
  padding: 2px 0

}
.fc-daygrid-dot-event .fc-event-title {
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0; /* important for allowing to shrink all the way */
    overflow: hidden;
    font-weight: bold;
  }
.fc-daygrid-dot-event:hover,
  .fc-daygrid-dot-event.fc-event-mirror {
    background: rgba(0, 0, 0, 0.1);
  }
.fc-daygrid-dot-event.fc-event-selected:before {
    /* expand hit area */
    top: -10px;
    bottom: -10px;
  }
.fc-daygrid-event-dot { /* the actual dot */
  margin: 0 4px;
  box-sizing: content-box;
  width: 0;
  height: 0;
  border: 4px solid #3788d8;
  border: calc(var(--fc-daygrid-event-dot-width, 8px) / 2) solid var(--fc-event-border-color, #3788d8);
  border-radius: 4px;
  border-radius: calc(var(--fc-daygrid-event-dot-width, 8px) / 2);
}
/* --- spacing between time and title --- */
.fc-direction-ltr .fc-daygrid-event .fc-event-time {
    margin-right: 3px;
  }
.fc-direction-rtl .fc-daygrid-event .fc-event-time {
    margin-left: 3px;
  }
</style><style>
/*
A VERTICAL event
*/

.fc-v-event { /* allowed to be top-level */
  display: block;
  border: 1px solid #3788d8;
  border: 1px solid var(--fc-event-border-color, #3788d8);
  background-color: #3788d8;
  background-color: var(--fc-event-bg-color, #3788d8)

}

.fc-v-event .fc-event-main {
    color: #fff;
    color: var(--fc-event-text-color, #fff);
    height: 100%;
  }

.fc-v-event .fc-event-main-frame {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

.fc-v-event .fc-event-time {
    flex-grow: 0;
    flex-shrink: 0;
    max-height: 100%;
    overflow: hidden;
  }

.fc-v-event .fc-event-title-container { /* a container for the sticky cushion */
    flex-grow: 1;
    flex-shrink: 1;
    min-height: 0; /* important for allowing to shrink all the way */
  }

.fc-v-event .fc-event-title { /* will have fc-sticky on it */
    top: 0;
    bottom: 0;
    max-height: 100%; /* clip overflow */
    overflow: hidden;
  }

.fc-v-event:not(.fc-event-start) {
    border-top-width: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

.fc-v-event:not(.fc-event-end) {
    border-bottom-width: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

.fc-v-event.fc-event-selected:before {
    /* expand hit area */
    left: -10px;
    right: -10px;
  }

.fc-v-event {

  /* resizer (mouse AND touch) */

}

.fc-v-event .fc-event-resizer-start {
    cursor: n-resize;
  }

.fc-v-event .fc-event-resizer-end {
    cursor: s-resize;
  }

.fc-v-event {

  /* resizer for MOUSE */

}

.fc-v-event:not(.fc-event-selected) .fc-event-resizer {
      height: 8px;
      height: var(--fc-event-resizer-thickness, 8px);
      left: 0;
      right: 0;
    }

.fc-v-event:not(.fc-event-selected) .fc-event-resizer-start {
      top: -4px;
      top: calc(var(--fc-event-resizer-thickness, 8px) / -2);
    }

.fc-v-event:not(.fc-event-selected) .fc-event-resizer-end {
      bottom: -4px;
      bottom: calc(var(--fc-event-resizer-thickness, 8px) / -2);
    }

.fc-v-event {

  /* resizer for TOUCH (when event is "selected") */

}

.fc-v-event.fc-event-selected .fc-event-resizer {
      left: 50%;
      margin-left: -4px;
      margin-left: calc(var(--fc-event-resizer-dot-total-width, 8px) / -2);
    }

.fc-v-event.fc-event-selected .fc-event-resizer-start {
      top: -4px;
      top: calc(var(--fc-event-resizer-dot-total-width, 8px) / -2);
    }

.fc-v-event.fc-event-selected .fc-event-resizer-end {
      bottom: -4px;
      bottom: calc(var(--fc-event-resizer-dot-total-width, 8px) / -2);
    }

.fc .fc-timegrid .fc-daygrid-body { /* the all-day daygrid within the timegrid view */
    z-index: 2; /* put above the timegrid-body so that more-popover is above everything. TODO: better solution */
  }

.fc .fc-timegrid-divider {
    padding: 0 0 2px; /* browsers get confused when you set height. use padding instead */
  }

.fc .fc-timegrid-body {
    position: relative;
    z-index: 1; /* scope the z-indexes of slots and cols */
    min-height: 100%; /* fill height always, even when slat table doesn't grow */
  }

.fc .fc-timegrid-axis-chunk { /* for advanced ScrollGrid */
    position: relative /* offset parent for now-indicator-container */

  }

.fc .fc-timegrid-axis-chunk > table {
      position: relative;
      z-index: 1; /* above the now-indicator-container */
    }

.fc .fc-timegrid-slots {
    position: relative;
    z-index: 1;
  }

.fc .fc-timegrid-slot { /* a <td> */
    height: 1.5em;
    border-bottom: 0 /* each cell owns its top border */
  }

.fc .fc-timegrid-slot:empty:before {
      content: '\00a0'; /* make sure there's at least an empty space to create height for height syncing */
    }

.fc .fc-timegrid-slot-minor {
    border-top-style: dotted;
  }

.fc .fc-timegrid-slot-label-cushion {
    display: inline-block;
    white-space: nowrap;
  }

.fc .fc-timegrid-slot-label {
    vertical-align: middle; /* vertical align the slots */
  }

.fc {


  /* slots AND axis cells (top-left corner of view including the "all-day" text) */

}

.fc .fc-timegrid-axis-cushion,
  .fc .fc-timegrid-slot-label-cushion {
    padding: 0 4px;
  }

.fc {


  /* axis cells (top-left corner of view including the "all-day" text) */
  /* vertical align is more complicated, uses flexbox */

}

.fc .fc-timegrid-axis-frame-liquid {
    height: 100%; /* will need liquid-hack in FF */
  }

.fc .fc-timegrid-axis-frame {
    overflow: hidden;
    display: flex;
    align-items: center; /* vertical align */
    justify-content: flex-end; /* horizontal align. matches text-align below */
  }

.fc .fc-timegrid-axis-cushion {
    max-width: 60px; /* limits the width of the "all-day" text */
    flex-shrink: 0; /* allows text to expand how it normally would, regardless of constrained width */
  }

.fc-direction-ltr .fc-timegrid-slot-label-frame {
    text-align: right;
  }

.fc-direction-rtl .fc-timegrid-slot-label-frame {
    text-align: left;
  }

.fc-liquid-hack .fc-timegrid-axis-frame-liquid {
  height: auto;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  }

.fc .fc-timegrid-col.fc-day-today {
      background-color: rgba(255, 220, 40, 0.15);
      background-color: var(--fc-today-bg-color, rgba(255, 220, 40, 0.15));
    }

.fc .fc-timegrid-col-frame {
    min-height: 100%; /* liquid-hack is below */
    position: relative;
  }

.fc-media-screen.fc-liquid-hack .fc-timegrid-col-frame {
  height: auto;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
    }

.fc-media-screen .fc-timegrid-cols {
    position: absolute; /* no z-index. children will decide and go above slots */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0
  }

.fc-media-screen .fc-timegrid-cols > table {
      height: 100%;
    }

.fc-media-screen .fc-timegrid-col-bg,
  .fc-media-screen .fc-timegrid-col-events,
  .fc-media-screen .fc-timegrid-now-indicator-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

.fc {

  /* bg */

}

.fc .fc-timegrid-col-bg {
    z-index: 2; /* TODO: kill */
  }

.fc .fc-timegrid-col-bg .fc-non-business { z-index: 1 }

.fc .fc-timegrid-col-bg .fc-bg-event { z-index: 2 }

.fc .fc-timegrid-col-bg .fc-highlight { z-index: 3 }

.fc .fc-timegrid-bg-harness {
    position: absolute; /* top/bottom will be set by JS */
    left: 0;
    right: 0;
  }

.fc {

  /* fg events */
  /* (the mirror segs are put into a separate container with same classname, */
  /* and they must be after the normal seg container to appear at a higher z-index) */

}

.fc .fc-timegrid-col-events {
    z-index: 3;
    /* child event segs have z-indexes that are scoped within this div */
  }

.fc {

  /* now indicator */

}

.fc .fc-timegrid-now-indicator-container {
    bottom: 0;
    overflow: hidden; /* don't let overflow of lines/arrows cause unnecessary scrolling */
    /* z-index is set on the individual elements */
  }

.fc-direction-ltr .fc-timegrid-col-events {
    margin: 0 2.5% 0 2px;
  }

.fc-direction-rtl .fc-timegrid-col-events {
    margin: 0 2px 0 2.5%;
  }

.fc-timegrid-event-harness {
  position: absolute /* top/left/right/bottom will all be set by JS */
}

.fc-timegrid-event-harness > .fc-timegrid-event {
    position: absolute; /* absolute WITHIN the harness */
    top: 0; /* for when not yet positioned */
    bottom: 0; /* " */
    left: 0;
    right: 0;
  }

.fc-timegrid-event-harness-inset .fc-timegrid-event,
.fc-timegrid-event.fc-event-mirror,
.fc-timegrid-more-link {
  box-shadow: 0px 0px 0px 1px #fff;
  box-shadow: 0px 0px 0px 1px var(--fc-page-bg-color, #fff);
}

.fc-timegrid-event,
.fc-timegrid-more-link { /* events need to be root */
  font-size: .85em;
  font-size: var(--fc-small-font-size, .85em);
  border-radius: 3px;
}

.fc-timegrid-event { /* events need to be root */
  margin-bottom: 1px /* give some space from bottom */
}

.fc-timegrid-event .fc-event-main {
    padding: 1px 1px 0;
  }

.fc-timegrid-event .fc-event-time {
    white-space: nowrap;
    font-size: .85em;
    font-size: var(--fc-small-font-size, .85em);
    margin-bottom: 1px;
  }

.fc-timegrid-event-short .fc-event-main-frame {
    flex-direction: row;
    overflow: hidden;
  }

.fc-timegrid-event-short .fc-event-time:after {
    content: '\00a0-\00a0'; /* dash surrounded by non-breaking spaces */
  }

.fc-timegrid-event-short .fc-event-title {
    font-size: .85em;
    font-size: var(--fc-small-font-size, .85em)
  }

.fc-timegrid-more-link { /* does NOT inherit from fc-timegrid-event */
  position: absolute;
  z-index: 9999; /* hack */
  color: inherit;
  color: var(--fc-more-link-text-color, inherit);
  background: #d0d0d0;
  background: var(--fc-more-link-bg-color, #d0d0d0);
  cursor: pointer;
  margin-bottom: 1px; /* match space below fc-timegrid-event */
}

.fc-timegrid-more-link-inner { /* has fc-sticky */
  padding: 3px 2px;
  top: 0;
}

.fc-direction-ltr .fc-timegrid-more-link {
    right: 0;
  }

.fc-direction-rtl .fc-timegrid-more-link {
    left: 0;
  }

.fc {

  /* line */

}

.fc .fc-timegrid-now-indicator-line {
    position: absolute;
    z-index: 4;
    left: 0;
    right: 0;
    border-style: solid;
    border-color: red;
    border-color: var(--fc-now-indicator-color, red);
    border-width: 1px 0 0;
  }

.fc {

  /* arrow */

}

.fc .fc-timegrid-now-indicator-arrow {
    position: absolute;
    z-index: 4;
    margin-top: -5px; /* vertically center on top coordinate */
    border-style: solid;
    border-color: red;
    border-color: var(--fc-now-indicator-color, red);
  }

.fc-direction-ltr .fc-timegrid-now-indicator-arrow {
    left: 0;

    /* triangle pointing right. TODO: mixin */
    border-width: 5px 0 5px 6px;
    border-top-color: transparent;
    border-bottom-color: transparent;
  }

.fc-direction-rtl .fc-timegrid-now-indicator-arrow {
    right: 0;

    /* triangle pointing left. TODO: mixin */
    border-width: 5px 6px 5px 0;
    border-top-color: transparent;
    border-bottom-color: transparent;
  }
</style><style>
:root {
  --fc-list-event-dot-width: 10px;
  --fc-list-event-hover-bg-color: #f5f5f5;
}
.fc-theme-standard .fc-list {
    border: 1px solid #ddd;
    border: 1px solid var(--fc-border-color, #ddd);
  }
.fc {

  /* message when no events */

}
.fc .fc-list-empty {
    background-color: rgba(208, 208, 208, 0.3);
    background-color: var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3));
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center; /* vertically aligns fc-list-empty-inner */
  }
.fc .fc-list-empty-cushion {
    margin: 5em 0;
  }
.fc {

  /* table within the scroller */
  /* ---------------------------------------------------------------------------------------------------- */

}
.fc .fc-list-table {
    width: 100%;
    border-style: hidden; /* kill outer border on theme */
  }
.fc .fc-list-table tr > * {
    border-left: 0;
    border-right: 0;
  }
.fc .fc-list-sticky .fc-list-day > * { /* the cells */
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      background: #fff;
      background: var(--fc-page-bg-color, #fff); /* for when headers are styled to be transparent and sticky */
    }
.fc {

  /* only exists for aria reasons, hide for non-screen-readers */

}
.fc .fc-list-table thead {
    position: absolute;
    left: -10000px;
  }
.fc {

  /* the table's border-style:hidden gets confused by hidden thead. force-hide top border of first cell */

}
.fc .fc-list-table tbody > tr:first-child th {
    border-top: 0;
  }
.fc .fc-list-table th {
    padding: 0; /* uses an inner-wrapper instead... */
  }
.fc .fc-list-table td,
  .fc .fc-list-day-cushion {
    padding: 8px 14px;
  }
.fc {


  /* date heading rows */
  /* ---------------------------------------------------------------------------------------------------- */

}
.fc .fc-list-day-cushion:after {
  content: "";
  clear: both;
  display: table; /* clear floating */
    }
.fc-theme-standard .fc-list-day-cushion {
    background-color: rgba(208, 208, 208, 0.3);
    background-color: var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3));
  }
.fc-direction-ltr .fc-list-day-text,
.fc-direction-rtl .fc-list-day-side-text {
  float: left;
}
.fc-direction-ltr .fc-list-day-side-text,
.fc-direction-rtl .fc-list-day-text {
  float: right;
}
/* make the dot closer to the event title */
.fc-direction-ltr .fc-list-table .fc-list-event-graphic { padding-right: 0 }
.fc-direction-rtl .fc-list-table .fc-list-event-graphic { padding-left: 0 }
.fc .fc-list-event.fc-event-forced-url {
    cursor: pointer; /* whole row will seem clickable */
  }
.fc .fc-list-event:hover td {
    background-color: #f5f5f5;
    background-color: var(--fc-list-event-hover-bg-color, #f5f5f5);
  }
.fc {

  /* shrink certain cols */

}
.fc .fc-list-event-graphic,
  .fc .fc-list-event-time {
    white-space: nowrap;
    width: 1px;
  }
.fc .fc-list-event-dot {
    display: inline-block;
    box-sizing: content-box;
    width: 0;
    height: 0;
    border: 5px solid #3788d8;
    border: calc(var(--fc-list-event-dot-width, 10px) / 2) solid var(--fc-event-border-color, #3788d8);
    border-radius: 5px;
    border-radius: calc(var(--fc-list-event-dot-width, 10px) / 2);
  }
.fc {

  /* reset <a> styling */

}
.fc .fc-list-event-title a {
    color: inherit;
    text-decoration: none;
  }
.fc {

  /* underline link when hovering over any part of row */

}
.fc .fc-list-event.fc-event-forced-url:hover a {
    text-decoration: underline;
  }
</style></head>
    <!-- END: Head -->
    <body class="login">
        <div class="container sm:px-10">
            <div class="block xl:grid grid-cols-2 gap-4">
                <!-- BEGIN: Register Info -->
                <div class="hidden xl:flex flex-col min-h-screen">
                    <a href="" class="-intro-x flex items-center pt-5">
                      <img alt="Midone - HTML Admin Template" class="w-6" src="dist/images/logo.png">
                      <span class="text-white text-lg ml-3"> GCH </span> 
                    </a>
                    <div class="my-auto">
                      <img alt="Midone - HTML Admin Template" class="-intro-x w-1/2 -mt-16" src="dist/images/logo.png">
                      <div class="-intro-x text-white font-medium text-2xl leading-tight mt-10">
                          Welcome to Golden Country Homes 
                          {{-- <br>
                          sign in to your account. --}}
                      </div>
                      <div class="-intro-x mt-5 text-xs text-white text-opacity-70 dark:text-slate-400">Manage all your property accounts in one place</div>
                  </div>
                </div>
                <!-- END: Register Info -->
                <!-- BEGIN: Register Form -->
                <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                    <div class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                        <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                            Create Appointment
                        </h2>
                        <div class="intro-x mt-2 text-slate-400 dark:text-slate-400 xl:hidden text-center">Fill in the details below to create a new appointment</div>
                        <form id="appointmentForm">
                            @csrf
                            <div class="intro-x mt-8">
                                <textarea class="intro-x login__input form-control py-3 px-4 block" name="description" placeholder="Appointment Description" rows="3" maxlength="1000" required></textarea>
                                <input type="datetime-local" class="intro-x login__input form-control py-3 px-4 block mt-4" name="appointment_date" required>
                                <input type="text" class="intro-x login__input form-control py-3 px-4 block mt-4" name="tracking_number" placeholder="Tracking Number (Auto-generated)" readonly style="display: none; background-color: #f8f9fa; cursor: not-allowed;">
                                <input type="hidden" name="status" value="pending">
                            </div>
                        </form>
                        <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                            <button type="submit" form="appointmentForm" class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top whitespace-nowrap text-xs">Create Appointment</button>
                            <a href="{{ route('view-appointments.index') }}" class="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top whitespace-nowrap text-xs">View Appointments</a>
                            <a href="{{ route('login.index') }}" class="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top whitespace-nowrap text-xs">Back to Login</a>
                        </div>
                    </div>
                </div>
                <!-- END: Register Form -->
            </div>
        </div>
        
        <!-- BEGIN: Tracking Number Modal -->
        <div id="trackingNumberModal" class="modal" tabindex="-1" aria-hidden="true" style="display: none !important; position: fixed !important; z-index: 99999 !important; left: 0 !important; top: 0 !important; width: 100% !important; height: 100% !important; background-color: rgba(0, 0, 0, 0.5) !important;">
            <div class="modal-dialog" style="position: relative !important; width: auto !important; margin: 5% auto !important; max-width: 500px !important;">
                <div class="modal-content" style="position: relative !important; background-color: #fff !important; border-radius: 0.5rem !important; box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important; border: 1px solid #e9ecef !important;">
                    <div class="modal-body px-5 py-10" style="padding: 1.5rem !important;">
                        <div class="text-center">
                            <div class="mb-5">
                                <h3 class="text-lg font-medium mb-3">Your Appointment Details</h3>
                                <div class="text-left bg-gray-50 p-4 rounded-lg mb-4" style="text-align: left !important; background-color: #f9fafb !important; padding: 1rem !important; border-radius: 0.5rem !important; margin-bottom: 1rem !important;">
                                    <p><strong>Description:</strong> <span id="modalDescription"></span></p>
                                    <p><strong>Date & Time:</strong> <span id="modalDateTime"></span></p>
                                    <p><strong>Tracking Number:</strong> <span id="modalTrackingNumber" class="font-bold text-blue-600" style="font-weight: 700 !important; color: #2563eb !important;"></span></p>
                                </div>
                                <p class="text-gray-600" style="color: #4b5563 !important;">Your appointment has been successfully created and saved please click view appointment button to track the status of your appointment!</p>
                            </div>
                            <button type="button" class="btn btn-primary w-24" onclick="closeModal()">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END: Tracking Number Modal -->
        <!-- BEGIN: JS Assets-->
        @vite('resources/css/app.css')
        @vite('resources/js/app.js')
        <script src="{{ asset('js/appointment/appointment.js') }}"></script>

        <style>
        /* Modal styles for vanilla JavaScript */
        .modal {
            display: none;
            position: fixed;
            z-index: 99999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            overflow: auto;
        }
        
        .modal.show {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        .modal-dialog {
            position: relative;
            width: auto;
            margin: 5% auto;
            max-width: 500px;
            min-height: 200px;
        }
        
        .modal-content {
            position: relative;
            background-color: #fff;
            border-radius: 0.5rem;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
            border: 1px solid #e9ecef;
        }
        
        .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #e9ecef;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .modal-footer {
            padding: 1rem 1.5rem;
            border-top: 1px solid #e9ecef;
            background-color: #f8f9fa;
        }
        
        /* Ensure modal is visible when shown */
        #trackingNumberModal.show {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        /* Force modal visibility */
        #trackingNumberModal[style*="display: block"] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        /* Override any conflicting styles */
        #trackingNumberModal {
            display: none;
        }
        
        #trackingNumberModal.show,
        #trackingNumberModal[style*="display: block"] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        /* Force modal to be visible and positioned correctly */
        #trackingNumberModal[style*="display: block"],
        #trackingNumberModal.show {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: fixed !important;
            z-index: 99999 !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0, 0, 0, 0.5) !important;
        }
        
        /* Ensure modal dialog is visible */
        #trackingNumberModal[style*="display: block"] .modal-dialog,
        #trackingNumberModal.show .modal-dialog {
            position: relative !important;
            width: auto !important;
            margin: 5% auto !important;
            max-width: 500px !important;
            min-height: 200px !important;
        }
        
        /* Ensure modal content is visible */
        #trackingNumberModal[style*="display: block"] .modal-content,
        #trackingNumberModal.show .modal-content {
            position: relative !important;
            background-color: #fff !important;
            border-radius: 0.5rem !important;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
            border: 1px solid #e9ecef !important;
        }
        </style>
    
</body></html>