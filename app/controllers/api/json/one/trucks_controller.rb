class Api::Json::One::TrucksController < ApplicationController
	def index
		render json: params
	end
end
