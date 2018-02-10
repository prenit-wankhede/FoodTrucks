
# README
A simple web application to find Food Trucks within 1000 meters radius of a given location. 

* GitHub repository url: `https://github.com/prenit-wankhede/FoodTrucks.git`
* Live Demo: `https://my-foodtrucks.herokuapp.com/`
* Food Trucks Location data: `https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat/data`
  
System Overview: 

* Ruby version: 2.3.3

* System dependencies: ruby, rails 5.1, rubygem, node.js

* ThirdParty gems used: `mocha` for test stubs,  `soda-ruby` for food truck location data api client

* Database creation: Edit database root password in `cofig/database.yml` file and run 
`rake db:create`

* Database initialization
Edit database root password in `cofig/database.yml` file and run 
`rake db:migrate`

* How to run the test suite: Run 
`bin/rails tests -v`

* Deployment instructions. Run
`bundle install`
`rails server`
	
# How it works ?

* When you open the application root url `/`, you will be presented with a HTML page showing a google map, one form to enter address where you want to locate the food trucks and one form to enter latitude, longitude where you want to locate the food trucks.
* On page load, google map javascript library is requested with API_KEY registered with google for this application. After the map file is loaded, initMap function is called which sets the google map.
* On page load, You will be asked permission to detect your current location. If permitted, your current location is detected and a blue marker is placed on the google map to show your current location. If your location is not granted or could not be detected, then default location (37.78,-122.43) is used.
* You can drag the blue marker to location where you want to search food trucks nearby. On drag end, new location is retrieved and geocoded using google map geo-coder. You can also search location using address or latitude, longitude using the forms given on the HTML page.
* Location from above step is then sent to json api endpoint `/api/json/one/trucks.json`with params `latitude`, `longitude`
* Server then sends a third-party request to location data center to get the nearby trucks. Server then sends back the food trucks info in json format.
* Upon receiving the nearby food trucks, browser parse the response and create a red marker for Truck types and a green marker Push Cart type food trucks. When clicked on marker, details like vendor name, address and available food items are shown. Nearby food trucks are also listed besides the map in ascending order of distance from your location. In this list, Truck types are highlighted in red and Push Carts are highlighted in green.

# API Endpoints
* Host: `"localhost:3000" or "https://my-foodtrucks.herokuapp.com/"`


# HTML APIs
* Root or home page 
```
path: "/",
method: GET,
type: "html"
response: 	{
				status: 200 OK,
				body: HTML page containg google map, form to fill location adrress or latitude, logitude
			}
```
# JSON APIs
* get food trucks within 1000 meters of given latitude and longitude
```
path: "/api/json/one/trucks",
method: GET,
type: "json",
query: {
	latitude: 1.0, // required
	longitude: 2.0 // required
},
response: 	{
				status: 200 OK,
				body: {
					trucks: [
						{
							applicant: "Prenit Wankhede",
							address: "Mumbai, India",
							latitude: 1.1,
							longitude: 2.2,
							fooditems: "Chinese, Italian"
						},
						{
							applicant: "Prenit Kumar",
							address: "Mumbai, India",
							latitude: 1.2,
							longitude: 2.3,
							fooditems: "Thai, Italian"
						}
					]
				}
			}
```

# Code Structure

* Code is structured according to MVC methodology.
* At root directory,  `Gemfile` contains the gem specifications of the dependancies. We have added `pg` gem for postgres database when deploying on heroku, `mocha` for test stubs,  `soda-ruby` for food truck location data api client.
* At root directory a `Procfile` is placed to start heroku service automatically after code changes or crashes.
* Application specific configurations are placed in `config` directory. 
* Database config is in `config/database.yml` file. MySQL is used in development and Postgres is used in heroku productio deploy. Specify root username and password here. On production machine, database password is stored in environment variable `FOODTRUCKS_DATABASE_PASSWORD`
* Permitted api endpoints or routes are configured in `config/routes.rb` file. Root address is pointed at `home/index`. For JSON api, name-spaced  resourceful routes are used.
* `app` directory contains the application logic. 
* Within `app` directory, there are `controllers` and `views` folder which has business logic and html templates respectively.
* Within `app` directory, there is assets folder which contains CSS and javascript files for front end. Frontend application is written in `application.js` file within `app/assets/javascript` directory.


## Controllers: 
* HomeController	
	* `app/controllers/home_controller.rb`
		* Action: `index`
			* renders `app/views/home/index.html.erb` page
* TrucksController	
	* `app/controllers/api/json/one/trucks_contrioller.rb`
		* Action: `index`
			* make call to `/app/helpers/location_data_center.rb` module's `get_nearby_food_trucks` method with received latitude and longitude to get nearby food trucks and then returns the result to client.

## Helpers
* LocationDataCenter
	* `app/helpers/location_data_center.rb`
		* Method: `get_nearby_food_trucks(latitude, longitude, radius)`
			* creates a location data center API client instance with API key obtained from data vendor. sends a GET request to fetch the food trucks within given radius of given latitude, longitude and returns the data


# Testing

* Tests are located at `tests/` directory. You can run all tests by running `bin/rails test -v` or individual test by running 	`bin/rails test test_filepath -v`

## Integration Tests
* HomePageTest
	* `tests/integration/home_page_test.rb`
		* gets home page and tests if it has all required html elements

## Controller Tests
* HomeControllerTest
	* `tests/controllers/home_controller_test.rb`
		* gets home page and tests if response is ok
* TrucksControllerTest
	* `tests/controllers/api/json/one/trucks_controller_test.rb`
		*  mocks location data center api call. creates sample response. tests if sample response is equal to response from data center method. tests if response is ok.
		* tests scenario when no data is returned from location data service 
##  Helper Tests
* LocationDataCenterTest
	* `tests/helpers/location_data_center.rb`
		* makes an actual API call to test if third-party service api is working and up to date with our system. Tests if actual response matches saved response on our system
