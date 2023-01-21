# greenminds
Code, styles, assets and scripts for the Green Minds Data microsite.  

Data for the network forcegraph is contained in prn_data.json which is converted from an arrows.app file.  

Data for the geospatial map of network members is contained in data/network_entries.csv which is a cleaned version of the original network_entries.txt.  
The text file contained too many structural errors to be usable, so we need to maintain the CSV file in its current form and use this as the single source of the truth.  

There are 3 versions of the front page, each with their own set of scripts and. distinct palettes.  
* indexStrong.html uses more saturated hues
* indexBright.html uses a bright clusterof colours
* indexSoft.html uses a muted grayscale palette with some pastel accents
  
The colours are used across the network force graph and the geospatial map of network members. Each version of the index page uses its own version of makeGraph.js (labelled makeGraphBright.js, makeGraphStrong.js and makeGraphSOft.js) and each has its own CSS to define the map markers. (markersBright.css, markersStrong.css and markersSoft.css). These call on custom SVGs for the markers, each has 3 options. If more classes of network members are needed we would need to update the CSS with more marker definitions and create new SVGs. 
