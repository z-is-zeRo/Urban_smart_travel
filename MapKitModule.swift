

import Foundation
import MapKit

@objc(MapKitModule)
class MapKitModule: NSObject {
  
  @objc
  func getDirections(fromLat: Double, fromLon: Double, toLat: Double, toLon: Double, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let sourceCoordinates = CLLocationCoordinate2D(latitude: fromLat, longitude: fromLon)
    let destinationCoordinates = CLLocationCoordinate2D(latitude: toLat, longitude: toLon)
    
    let sourcePlacemark = MKPlacemark(coordinate: sourceCoordinates)
    let destinationPlacemark = MKPlacemark(coordinate: destinationCoordinates)
    
    let request = MKDirections.Request()
    request.source = MKMapItem(placemark: sourcePlacemark)
    request.destination = MKMapItem(placemark: destinationPlacemark)
    request.transportType = .transit  
    
    let directions = MKDirections(request: request)
    directions.calculate { (response, error) in
      guard let response = response else {
        if let error = error {
          reject("Error", "Failed to get directions: \(error)", error)
        }
        return
      }
      
      let route = response.routes[0] 
      let polyline = route.polyline.coordinates  
      let travelTime = route.expectedTravelTime
      let distance = route.distance
      
      resolve(["polyline": polyline, "travelTime": travelTime, "distance": distance])
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
