/// <reference types="googlemaps" />
import { OnChanges, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
export declare class AgmDirection implements OnChanges, OnInit, OnDestroy {
    private gmapsApi;
    origin: string | google.maps.Place | google.maps.LatLng | google.maps.LatLngLiteral;
    destination: string | google.maps.Place | google.maps.LatLng | google.maps.LatLngLiteral;
    travelMode?: google.maps.TravelMode;
    transitOptions?: google.maps.TransitOptions;
    drivingOptions?: google.maps.DrivingOptions;
    waypoints: google.maps.DirectionsWaypoint[];
    optimizeWaypoints: boolean;
    provideRouteAlternatives: boolean;
    avoidHighways: boolean;
    avoidTolls: boolean;
    renderOptions?: google.maps.DirectionsRendererOptions;
    panel?: Element;
    markerOptions: {
        origin: google.maps.MarkerOptions;
        destination: google.maps.MarkerOptions;
        waypoints: google.maps.MarkerOptions;
    };
    infoWindow: google.maps.InfoWindow;
    visible: boolean;
    renderRoute?: google.maps.DirectionsResult | null;
    onChange: EventEmitter<google.maps.DirectionsResult>;
    onResponse: EventEmitter<google.maps.DirectionsResult>;
    sendInfoWindow: EventEmitter<google.maps.InfoWindow>;
    status: EventEmitter<google.maps.DirectionsStatus>;
    originDrag: EventEmitter<any>;
    destinationDrag: EventEmitter<any>;
    directionsService: google.maps.DirectionsService;
    directionsRenderer: google.maps.DirectionsRenderer;
    private originMarker?;
    private destinationMarker?;
    private waypointsMarker;
    private isFirstChange;
    constructor(gmapsApi: GoogleMapsAPIWrapper);
    ngOnInit(): void;
    ngOnChanges(obj: any): void;
    ngOnDestroy(): void;
    /**
     * This event is fired when the user creating or updating this direction
     */
    private directionDraw;
    /**
     * Custom Origin and Destination Icon
     * @param map map
     * @param marker marker
     * @param markerOpts properties
     * @param content marker's infowindow content
     * @returns new marker
     * @memberof AgmDirection
     */
    private setMarker;
    /**
     * This event is fired when remove markers
     */
    private removeMarkers;
    /**
     * This event is fired when remove directions
     */
    private removeDirections;
    /**
     * This event is fired when destroy markers
     */
    private destroyMarkers;
}
