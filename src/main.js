"use strict";

import "./scss/main.scss";

// import 'bootstrap/js/dist/alert';
// import 'bootstrap/js/dist/button';
// import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/collapse';
// import 'bootstrap/js/dist/dropdown';
// import 'bootstrap/js/dist/modal';
// import 'bootstrap/js/dist/popover';
// import 'bootstrap/js/dist/scrollspy';
// import 'bootstrap/js/dist/tab';
// import 'bootstrap/js/dist/toast';
// import 'bootstrap/js/dist/tooltip';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faEnvelopeOpen, faUser, faPaperPlane, faFileCode, faSatelliteDish, faProjectDiagram, faCode, faUserShield, faShip, faClock, faBook, faMapMarkerAlt, faGlobeEurope } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter, faLinkedin, faNodeJs, faReact, faJs } from '@fortawesome/free-brands-svg-icons';

library.add(
  faUser, faEnvelopeOpen, faPaperPlane, faFileCode, faSatelliteDish, faProjectDiagram, faCode, faUserShield, faShip, faClock, faBook, faMapMarkerAlt, faGlobeEurope,
  faGithub, faTwitter, faLinkedin,
  faNodeJs, faReact, faJs
);

dom.watch();

