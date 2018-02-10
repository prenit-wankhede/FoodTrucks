require 'test_helper'

class Api::Json::One::TrucksControllerTest < ActionDispatch::IntegrationTest
  test "should get one or more food trucks nearby" do
	::LocationDataCenter.expects(:get_nearby_food_trucks).with(1, 2, 1000).returns([{applicant: "abc", address: "pqr", latitude: 3, longitude: 4, fooditems: "xyz"}])

    get api_json_one_trucks_path, params: {latitude: 1, longitude: 2}

    assert_equal @response.body, {trucks: [{applicant: "abc", address: "pqr", latitude: 3, longitude: 4, fooditems: "xyz"}]}.to_json
    assert_response :success
  end

  test "should get zero food trucks nearby" do
	::LocationDataCenter.expects(:get_nearby_food_trucks).with(1, 2, 1000).returns([])

    get api_json_one_trucks_path, params: {latitude: 1, longitude: 2}

    assert_equal @response.body, {trucks: []}.to_json
    assert_response :success
  end
end
