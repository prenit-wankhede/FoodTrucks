class Api::Json::One::TrucksController < ApplicationController
	def index
		latitude = params[:latitude].to_f
		longitude = params[:longitude].to_f

		if (!latitude.nil? and !longitude.nil?) 
			trucks = ::LocationDataCenter.get_nearby_food_trucks(latitude, longitude, 1000) # 1000 meter radius of given location
			render json: {trucks: trucks}
		else
			render json: {error: "required query params not present"}
		end
	end
end
