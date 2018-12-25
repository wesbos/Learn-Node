import '../sass/style.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import Search from './components/search.jsx';

autocomplete($("#address"), $("#lat"), $("#lng"));

const searchBox = document.getElementById("search_result");
searchBox && ReactDOM.render(<Search />, searchBox)
