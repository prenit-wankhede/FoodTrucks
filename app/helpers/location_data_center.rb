module LocationDataCenter

	def self.get_nearby_food_trucks (latitude, longitude, radius)
		client = ::SODA::Client.new({:domain => "data.sfgov.org", :app_token => "mWNblZvMkUiwYhqDzGfvo34md"})
		trucks = client.get("6a9r-agq8", {"$where" => "within_circle(location, #{latitude}, #{longitude}, #{radius})"})
		return trucks
	end
end