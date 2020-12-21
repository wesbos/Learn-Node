import "regenerator-runtime/runtime";
import "../sass/style.scss";

import { $ } from "./modules/bling";
import autocomplete from "./modules/autoComplete";
import typeahead from "./modules/typeahead";
import makeMap from "./modules/map";

autocomplete($("#address"), $("#lat"), $("#lng"));
typeahead($(".search"));
makeMap($("#map"));
