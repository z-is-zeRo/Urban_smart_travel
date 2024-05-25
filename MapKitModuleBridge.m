// MapKitModuleBridge.m

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MapKitModule, NSObject)

RCT_EXTERN_METHOD(getDirections:(double)fromLat fromLon:(double)fromLon toLat:(double)toLat toLon:(double)toLon resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
