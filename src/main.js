"use strict";

import "materialize-css";
import HeadlineType from './headline-type';
import years from './years';

function ready(fn) {
    if (document.readyState !== 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function() {
    // Nav.
    new M.Sidenav(document.getElementById("nav-mobile"));

    // The self typing headline.
    const headline = document.getElementById("headline-type");
    if (headline) {
      new HeadlineType(headline);
    }

    const yearsElement = document.getElementById("years");
    if (yearsElement) {
      years(yearsElement);
    }
  })
