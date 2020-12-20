import "regenerator-runtime/runtime";
import "../sass/style.scss";

import { $ } from "./modules/bling";
import autocomplete from "./modules/autoComplete";
import typeahead from "./modules/typeahead";

autocomplete($("#address"), $("#lat"), $("#lng"));
typeahead($(".search"));
