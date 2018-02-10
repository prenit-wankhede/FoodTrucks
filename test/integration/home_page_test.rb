require 'test_helper'

class HomePageTest < ActionDispatch::IntegrationTest
  test "can see the home page" do
    get "/"
    assert_select "h1", "Drag the blue marker on the map to locate nearby food trucks !"
    assert_select "h2", "Or enter your geo cordinates. Try (37.78 , -122.43)"
    assert_select "input[id=address]", 1
    assert_select "input[id=latitude]", 1
    assert_select "input[id=longitude]", 1
    assert_select "button[type=submit]", 2
    assert_select "div[id=google-map-div]", 1
    assert_select "div[id=food-truck-div]", 1

    assert_response :success
  end
end
