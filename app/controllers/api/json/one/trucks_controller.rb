class Api::Json::One::TrucksController < ApplicationController
	def index
		latitude = params[:latitude].to_f
		longitude = params[:longitude].to_f
		
		trucks = ::LocationDataCenter.get_nearby_food_trucks(latitude, longitude, 1000)
		render json: {trucks: trucks}
	end
end
