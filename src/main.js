"use strict";

require("materialize-css");
import HeadlineType from './headline-type';

function ready(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  
  ready(function() {
    var x = 2;
    // Nav.
    new M.Sidenav(document.getElementById("nav-mobile"));

    // The self typing headline.
    const headline = document.getElementById("headline-type");
    if (headline) {
      new HeadlineType(headline);
    }
  })