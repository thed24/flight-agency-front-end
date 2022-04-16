import { Typography, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import {
  Categories,
  Location,
  Trip,
  Place,
  PlacesRequest,
  LoadCountries,
  getStopsPerDay,
} from "common/types";
import { SC } from "common/components";
import React, { useEffect, useMemo } from "react";
import { Map, Marker, ScrollableStops } from "modules/createTrip/components";
import { IsError, useGet } from "common/hooks";
import { RequestLocationDataEndpoint } from "common/utilities";
import { SSC } from "modules/createTrip/steps";

interface Props {
  trip: Trip;
  center: Location;
  apiKey: string;
  destination: string;
  onClickMarker: (place: Place, day: number) => void;
  onMoveMap: (lat: number, lng: number) => void;
}

export const StopStep = ({
  center,
  trip,
  onClickMarker,
  onMoveMap,
  apiKey,
  destination,
}: Props) => {
  const [places, setPlaces] = React.useState<Place[]>([]);
  const [category, setCategory] = React.useState<string>("");
  const [zoom, setZoom] = React.useState<number>(15);
  const [index, setIndex] = React.useState<number>(0);

  const dayToStopMap = getStopsPerDay(trip.stops);
  const days = Object.keys(dayToStopMap);
  const stopsForDay = Object.values(dayToStopMap)[index];

  const countries = LoadCountries();

  const {
    loading: placesLoading,
    payload: placesResult,
    request: placesRequest,
  } = useGet<Place[]>(RequestLocationDataEndpoint);

  useEffect(() => {
    setCategory("Food");

    const currentCountry = countries.find(
      (country) => country.name === destination
    );

    if (currentCountry) {
      onMoveMap(currentCountry.lat, currentCountry.lng);
    }
  }, []);

  useEffect(() => {
    var request: PlacesRequest = {
      lat: center.lat.toString(),
      lng: center.lng.toString(),
      zoom: zoom.toString(),
      radius: "2000",
      keyword: `'${category}'`,
    };

    placesRequest(request);
  }, [category, center]);

  useEffect(() => {
    if (!IsError(placesResult)) {
      setPlaces(placesResult.data);
    }
  }, [placesResult]);

  const onDragEnd = (lat: number, lng: number) => {
    onMoveMap(lat, lng);
  };

  const onZoomEnd = (zoom: number) => {
    setZoom(zoom);
  };

  const handleOnChangeCategory = (e: SelectChangeEvent<string>) => {
    setCategory(e.target.value);
  };

  const markers = useMemo(() => {
    const handleOnClickMarker =
      (place: Place) => (e: React.MouseEvent<Element, MouseEvent>) => {
        e.preventDefault();
        onClickMarker(place, days.length > 0 ? parseInt(days[index]) : 1);
      };

    return places.map((place, i) => (
      <Marker
        key={i}
        onClick={handleOnClickMarker(place)}
        place={place}
        lat={place.geometry.location.latitude}
        lng={place.geometry.location.longitude}
      />
    ));
  }, [days, index, onClickMarker, places]);

  const entries = useMemo(() => {
    return stopsForDay && stopsForDay.length > 0
      ? stopsForDay.map((stop) => {
          return [
            {
              header: `${stop.name}`,
              content: `${stop.time.start.toLocaleTimeString()} to ${stop.time.end.toLocaleTimeString()}`,
            },
          ];
        })
      : [];
  }, [stopsForDay]);

  return (
    <SC.Container>
      <SSC.MapContainer>
        <Map
          key="map"
          center={center}
          zoom={zoom}
          onDrag={onDragEnd}
          onZoom={onZoomEnd}
          apiKey={apiKey}
        >
          {markers}
        </Map>

        {trip.stops.length > 0 && (
          <ScrollableStops
            setIndex={setIndex}
            index={index}
            dayToStopsMap={dayToStopMap}
            entries={entries}
          />
        )}
      </SSC.MapContainer>

      <Typography gutterBottom variant="h6">
        Select a category
      </Typography>

      <Select
        placeholder="Select a category"
        value={category}
        label="Category"
        onChange={handleOnChangeCategory}
      >
        {Categories.map((category, index) => {
          return (
            <MenuItem value={category} key={index}>
              {category}
            </MenuItem>
          );
        })}
      </Select>
    </SC.Container>
  );
};
