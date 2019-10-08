# SOS Opioid Web Dashboard

[Link to this repository](https://github.com/choisteph/SOSFlaskDashboard)

---
## How the information is structured

### Content and base originate from Alex Cao's repository
  - [Original Repo](https://github.com/caocscar/opioid-web)

### HTML pages use bootstrap CDN
Coded by [Stephanie Choi](https://github.com/choisteph)
Referenced during creation of html page templates:
  - [Bootstrap Documentation](https://getbootstrap.com/docs/4.3/getting-started/introduction/)
  - [W3 Schools Bootstrap 4 Tutorials](https://www.w3schools.com/bootstrap4/bootstrap_get_started.asp)
  - [Stack Overflow Threads such as this](https://stackoverflow.com/questions/29258382/bootstrap-align-divs-to-top-middle-and-bottom)


### Scripts draw information from files in data and geojson folders
  - Mapbox/Leaflet-Mapbox, items in data folder (geojson, csv, topojson), and time series created by and lifted from [Alex Cao](https://github.com/caocscar)
  - d3 coding for infographics and table created by [Kevin Zhao](https://github.com/kevinzhao07)
  - SVG images of Michigan and their subsequent interactability, tooltips, and cross-hatching were created by [Alex Cao](https://github.com/caocscar).

### Routes and templates are created with Flask
  -  paths and login and authentication behavior coded by [Alex Cao](https://github.com/caocscar).
  -  dashboard paths coded by [Stephanie Choi](https://github.com/choisteph).

## In this repository:
- **application.py** : flask app that runs templates for opioid dashboard
- `opioid_dict.py` : definitions, dictionaries, etc. that format the information necessary for flask to process data into the HTML templates
- `requirements.txt` : things you need to have installed to run this program
- `templates/`
    - `about.html`
        - more information about this project
    - `contact.html`
        - a page with a contact email
    - `dashboard.html`
        - bootstrap layout template for dashboard with map positioned on top, then time series under the map, then a series of 3 infographics arranged in a row. under this is a table. the side navigation occupies 1 column.
    - `howtouse.html`
        - a page (currently empty) with directions on how to use the dashboard. Accessible from `dashboard.html`
    - `landing.html`
        - a landing page with two data visualizations of EMS-related incidents and ME-related incidents in Michigan
    - `login.html`
        - a login page with access to the EULA statement.
    - `search.html`
        - bootstrap layout template for search page. Contains 1 interactable county/city map, radio buttons for data source, and a search bar with autocomplete.
- `static/`
    - `css/`
        - `aboutcss.css`
            - styles the about page elements that need to be different than the style specified in landingcss
        - `contactuscss.css`
            - styles the contact us page elements that need to be different than the style specified in landingcss
        - `landingcss.css`
            - styles the landing page and child pages of the landing page (contact, about)
        - `logincss.css`
            - styles the login page
        - `map.css`
            - formats and styles the mapbox item for `dashboard.html`
        - `mediaquery.css`
            - positioning the footer when screen width is less than 992px for `landing.html`
        - `michigan.css`
            - styles the map and tooltips in `search.html`
        - `nondatastyle.css`
            - styles non-dashboard pages (`search.html`, `howtouse.html`)
        - `print.css`
            - styles the print view for the dashboard. currently very primitive
        - `style.css`
            - styles `dashboard.html`
        - `style.json`
            - a JSON-format file with the Mapbox style information for the main maps used on the dashboard.
        - `tablecharts.css`
            - styles the d3 infographics (bar graphs and donut) for `dashboard.html`
        - `timetable.css`
            - styles the d3 time series (2 bar graphs with moving average) for `dashboard.html`
    - `data/`
        - `map_fake_history/`
            - contains previous versions of map_fake.csv
        - `cities.csv`
            - names cities of interest and their latitude and longitudes
            - used in `search.html`
        - `emsData.csv`
            - counts used in `landing.html`
        - `gz_2010_iz_050_00_5m_MI_counties.topojson`
            - topojson-format information
            - used by `search.html`
        - `map_fake.csv`
            - fake data of approximately 2000 coordinates, dates, demographics
            - used in `dashboard.html`
        - `meData.csv`
            - counts used in `landing.html`
    - `geojson/`
        - `cities/`
            - geoJSON-format information about cities of interest
            - used by `dashboard.html`
        - `counties/`
            - geoJSON-format information about counties
            - used by `dashboard.html`
        - `gz_2010_iz_050_00_5m_MI_counties.topojson`
            - topojson-format information
            - used by `search.html`

    - `images/` - includes favicon (icon_t) and placeholders
        - hidta.png
        - icon.png
        - icon_t.png
            - the current favicon
        - ipc.png
            - the IPC banner used on every page
        - SOS.png
        - SOS_icon_logo_white.png
    - `js/`
        - `ageChart.js`
            - creates and updates the bar graphs for age representation
            - function definitions are referenced in `dashboard.js`
        - `autocomplete.js`
            - codes the autocomplete search used in `search.html`
        - `dashboard.js`
            - runs the function definitions defined in `ageChart.js`, `genderChart.js`, `htmlTable.js`, `raceChart.js`, and `timeSeries.js`
            - function definition for creating infographics from csv defined here
        - `genderChart.js`
            - creates and updates the gender donut
            - function definitions are referenced in `dashboard.js`
        - `htmlTable.js`
            - creates and updates the HTML table
            - function definitions are referenced in `dashboard.js`  
        - `makeLandingMichSvg.js`
            - creates the d3 svg maps of Michigan counties and cities
            - used in `landing.html`    
        - `makeSearchMichSvg.js`
            - creates the d3 svg map of Michigan counties and cities
            - used in `search.html`
        - `map.js`
            - creates mapbox-leaflet map used in main view
            - function definitions are referenced in `dashboard.js`
            - Flask-created variables are present in-line in `dashboard.html`
        - `navfromsearch.js`
            - codes the navigation to correct dashboard page after a place name is input into the search bar
            - used by `search.html`
        - `raceChart.js`
            - creates and updates the bar graphs for race representation
            - function definitions are referenced in `dashboard.js`
        - `srcFromRadio.js`
            - selects and sets data source from radio buttons
            - used by `search.html`
        - `timeSeries.js`
            - creates and updates the time time series
            - function definitions are referenced in `dashboard.js`
    - `markers/` - svg map markers used by leaflet mapbox in `dashboard.html`
        - ambulance_icon_blues.svg
            - unused
        - hospital_icon_blues.svg
            - unused
        - morguetable_5.svg
            - unused
        - green_circle.svg
